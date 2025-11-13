import mongoose from 'mongoose';
import 'dotenv/config';

// Simple schema definitions without validation
const seedDatabase = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ MongoDB connected successfully\n');

        // Get collections directly
        const db = mongoose.connection.db;
        const hotelsCollection = db.collection('hotels');
        const roomsCollection = db.collection('rooms');
        
        // Clear existing data
        console.log('🗑️  Clearing existing data...');
        await roomsCollection.deleteMany({});
        await hotelsCollection.deleteMany({});
        console.log('✅ Data cleared\n');

        // Create multiple hotels in different Indian cities
        console.log('🏨 Creating sample hotels...');
        
        const indianHotels = [
            {
                name: 'Taj Palace Hotel',
                address: '2, Sardar Patel Marg, Diplomatic Enclave, New Delhi',
                contact: '+91-11-2611-0202',
                city: 'New Delhi'
            },
            {
                name: 'The Oberoi Mumbai',
                address: 'Nariman Point, Mumbai, Maharashtra',
                contact: '+91-22-6632-5757',
                city: 'Mumbai'
            },
            {
                name: 'ITC Grand Chola',
                address: 'Mount Road, Guindy, Chennai, Tamil Nadu',
                contact: '+91-44-2220-0000',
                city: 'Chennai'
            },
            {
                name: 'Leela Palace Bangalore',
                address: '23, Old Airport Road, Bangalore, Karnataka',
                contact: '+91-80-2521-1234',
                city: 'Bangalore'
            },
            {
                name: 'Taj Lake Palace',
                address: 'Pichola Lake, Udaipur, Rajasthan',
                contact: '+91-294-242-8800',
                city: 'Udaipur'
            },
            {
                name: 'The Oberoi Amarvilas',
                address: 'Taj East Gate Road, Agra, Uttar Pradesh',
                contact: '+91-562-223-1515',
                city: 'Agra'
            }
        ];

        const hotelIds = [];
        for (const hotelData of indianHotels) {
            const hotel = await hotelsCollection.insertOne({
                ...hotelData,
                createdAt: new Date(),
                updatedAt: new Date()
            });
            hotelIds.push({ id: hotel.insertedId, name: hotelData.name, city: hotelData.city });
            console.log(`✅ Hotel created: ${hotelData.name} in ${hotelData.city}`);
        }
        console.log('\n');

        // Create sample rooms
        console.log('🛏️  Creating sample rooms for each hotel...');
        
        const roomTypes = [
            {
                type: 'Luxury Suite',
                price: 8500,
                capacity: 4,
                description: 'Spacious luxury suite with amazing city views and premium amenities',
                amenities: ['Free Wifi', 'Free Breakfast', 'Pool access', 'Mountain view'],
                images: [
                    'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800',
                    'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800'
                ]
            },
            {
                type: 'Double Bed',
                price: 4500,
                capacity: 2,
                description: 'Comfortable double bed room perfect for couples',
                amenities: ['Free Wifi', 'Free Breakfast', 'Free Services'],
                images: [
                    'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800',
                    'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800'
                ]
            },
            {
                type: 'Single Bed',
                price: 2500,
                capacity: 1,
                description: 'Cozy single room for solo travelers with all essentials',
                amenities: ['Free Wifi', 'Free Services'],
                images: [
                    'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800',
                    'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800'
                ]
            },
            {
                type: 'Family Suite',
                price: 12000,
                capacity: 6,
                description: 'Large family suite with multiple bedrooms and living area',
                amenities: ['Free Wifi', 'Free Breakfast', 'Pool access', 'Mountain view', 'Free Services'],
                images: [
                    'https://images.unsplash.com/photo-1596701062351-8c2c14d1fdd0?w=800',
                    'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?w=800'
                ]
            }
        ];

        let totalRooms = 0;
        for (const hotel of hotelIds) {
            // Create 2-4 rooms per hotel
            const numRooms = Math.floor(Math.random() * 3) + 2;
            for (let i = 0; i < numRooms; i++) {
                const roomType = roomTypes[i % roomTypes.length];
                await roomsCollection.insertOne({
                    hotel: hotel.id,
                    roomType: roomType.type,
                    pricePerNignt: roomType.price,
                    capacity: roomType.capacity,
                    description: roomType.description,
                    amenities: roomType.amenities,
                    images: roomType.images,
                    isAvailable: true,
                    createdAt: new Date(),
                    updatedAt: new Date()
                });
                totalRooms++;
            }
            console.log(`✅ Created rooms for ${hotel.name}`);
        }
        console.log(`\n✅ Total ${totalRooms} rooms created\n`);

        // Display summary
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('🎉 DATABASE SEEDED SUCCESSFULLY!');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
        console.log(`📊 Summary:`);
        console.log(`   Hotels: ${hotelIds.length}`);
        console.log(`   Rooms: ${totalRooms}`);
        console.log(`\n🏨 Indian Hotels Created:`);
        hotelIds.forEach(hotel => {
            console.log(`   • ${hotel.name} - ${hotel.city}`);
        });
        console.log(`\n🌐 You can now view rooms at: http://localhost:5173/rooms`);
        console.log('✨ All rooms are set to "isAvailable: true"\n');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding database:', error);
        process.exit(1);
    }
};

seedDatabase();
