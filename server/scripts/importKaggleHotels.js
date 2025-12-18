import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';
import csv from 'csv-parser';
import 'dotenv/config';
import { fileURLToPath } from 'url';

// Resolve CSV path (relative to this script)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const CSV_PATH = path.resolve(__dirname, '..', 'data', 'goibibo_com-travel_sample.csv', 'goibibo_com-travel_sample.csv');

// Config
const LIMIT = parseInt(process.env.KAGGLE_IMPORT_LIMIT || '200', 10); // number of hotels to import
const CLEAR_EXISTING = (process.env.CLEAR_EXISTING || 'true').toLowerCase() !== 'false';

const placeholderImages = [
  'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=1200&q=80',
  'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1200&q=80',
  'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1200&q=80'
];

function buildAddress(row) {
  const parts = [row.address, row.locality, row.area, row.city, (row.state || row.province), row.country]
    .map(v => (v || '').toString().trim())
    .filter(Boolean);
  return parts.join(', ');
}

function pickCity(row) {
  return (row.city || row.state || row.province || '').toString().trim() || 'Unknown';
}

function toAmenities(row) {
  const hotelFacilities = (row.hotel_facilities || '').split('|').map(s => s.trim()).filter(Boolean);
  const roomFacilities = (row.room_facilities || '').split('|').map(s => s.trim()).filter(Boolean);
  // Merge and limit to a reasonable list
  const set = new Set([
    ...hotelFacilities.slice(0, 10),
    ...roomFacilities.slice(0, 10)
  ]);
  return Array.from(set).slice(0, 12);
}

function deriveCapacity(roomType) {
  const rt = (roomType || '').toLowerCase();
  if (rt.includes('family')) return 4;
  if (rt.includes('suite')) return 4;
  if (rt.includes('1 bhk') || rt.includes('2 bhk')) return 3;
  if (rt.includes('double')) return 2;
  if (rt.includes('single')) return 1;
  return 2;
}

function derivePrice(row, starRating, roomType) {
  const stars = Number.parseInt(starRating || row.hotel_star_rating || '0', 10) || 0;
  let base = 1500 + Math.max(0, stars) * 1000; // INR-ish baseline
  base += Math.floor(Math.random() * 500);
  // small adjustment by room type
  const rt = (roomType || '').toLowerCase();
  if (rt.includes('suite')) base += 800;
  if (rt.includes('family')) base += 600;
  if (rt.includes('deluxe')) base += 400;
  // Store as string to align with current schema and queries
  return String(base);
}

async function run() {
  if (!process.env.MONGODB_URI) {
    console.error('❌ Missing MONGODB_URI in environment');
    process.exit(1);
  }

  if (!fs.existsSync(CSV_PATH)) {
    console.error(`❌ CSV file not found at: ${CSV_PATH}`);
    process.exit(1);
  }

  await mongoose.connect(process.env.MONGODB_URI);
  console.log('✅ Connected to MongoDB');

  const db = mongoose.connection.db;
  const hotelsCollection = db.collection('hotels');
  const roomsCollection = db.collection('rooms');

  if (CLEAR_EXISTING) {
    console.log('🗑️  Clearing existing hotels and rooms...');
    await roomsCollection.deleteMany({});
    await hotelsCollection.deleteMany({});
    console.log('✅ Cleared');
  }

  // Group by property_id → hotel, with unique room types per hotel
  const hotelsMap = new Map(); // property_id -> { hotelData, roomTypes: Map }
  let totalRows = 0;

  console.log(`📥 Reading CSV from ${CSV_PATH}`);

  await new Promise((resolve, reject) => {
    fs.createReadStream(CSV_PATH)
      .pipe(csv())
      .on('data', (row) => {
        totalRows++;
        const pid = (row.property_id || '').trim();
        const name = (row.property_name || '').trim();
        if (!pid || !name) return; // skip incomplete

        if (!hotelsMap.has(pid)) {
          const address = buildAddress(row);
          const city = pickCity(row);
          const description = (row.hotel_description || row.additional_info || '').toString().trim();
          const star = Number.parseInt(row.hotel_star_rating || row.hotel_category || '0', 10) || 0;

          hotelsMap.set(pid, {
            hotelData: {
              name,
              address: address || city,
              contact: '+91-000-000-0000',
              city,
              image: ''
            },
            meta: { description, star },
            roomTypes: new Map()
          });
        }

        // Build room entry per distinct room_type
        const ctx = hotelsMap.get(pid);
        const roomType = (row.room_type || 'Standard Room').toString().trim();
        if (!ctx.roomTypes.has(roomType)) {
          const amenities = toAmenities(row);
          const capacity = deriveCapacity(roomType);
          const pricePerNignt = derivePrice(row, ctx.meta.star, roomType);
          const description = ctx.meta.description || `${roomType} in ${pickCity(row)}`;

          ctx.roomTypes.set(roomType, {
            roomType,
            pricePerNignt,
            capacity,
            description,
            amenities,
            images: placeholderImages,
            isAvailable: true
          });
        }
      })
      .on('end', resolve)
      .on('error', reject);
  });

  const uniqueHotels = Array.from(hotelsMap.values());
  const importCount = Math.min(uniqueHotels.length, LIMIT);

  console.log(`\n🧮 CSV rows: ${totalRows}`);
  console.log(`🏨 Unique properties found: ${uniqueHotels.length}`);
  console.log(`⬇️  Importing: ${importCount} hotels (limit=${LIMIT})`);

  let hotelsInserted = 0;
  let roomsInserted = 0;

  for (let i = 0; i < importCount; i++) {
    const entry = uniqueHotels[i];

    const hotelResult = await hotelsCollection.insertOne({
      ...entry.hotelData,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    hotelsInserted++;

    const hotelId = hotelResult.insertedId;
    const roomDocs = Array.from(entry.roomTypes.values()).map(r => ({
      ...r,
      hotel: hotelId,
      createdAt: new Date(),
      updatedAt: new Date()
    }));

    if (roomDocs.length) {
      const res = await roomsCollection.insertMany(roomDocs);
      roomsInserted += res.insertedCount || roomDocs.length;
    }

    if ((i + 1) % 25 === 0 || i === importCount - 1) {
      console.log(`   • Imported ${i + 1}/${importCount} hotels...`);
    }
  }

  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🎉 Kaggle data import completed');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`Hotels: ${hotelsInserted}`);
  console.log(`Rooms:  ${roomsInserted}`);
  console.log('\nTip: Adjust KAGGLE_IMPORT_LIMIT or CLEAR_EXISTING as needed.');

  await mongoose.disconnect();
  process.exit(0);
}

run().catch((err) => {
  console.error('❌ Import failed:', err);
  process.exit(1);
});
