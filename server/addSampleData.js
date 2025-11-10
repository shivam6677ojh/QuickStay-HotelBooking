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

        // Create a simple hotel (without owner requirement for now)
        console.log('🏨 Creating sample hotel...');
        const hotel = await hotelsCollection.insertOne({
            name: 'Grand Luxury Hotel',
            address: 'New York, USA',
            contact: '+1-555-0123',
            city: 'New York',
            createdAt: new Date(),
            updatedAt: new Date()
        });
        
        const hotelId = hotel.insertedId;
        console.log(`✅ Hotel created with ID: ${hotelId}\n`);

        // Create sample rooms
        console.log('🛏️  Creating sample rooms...');
        const sampleRooms = [
            {
                hotel: hotelId,
                roomType: 'Luxury Suite',
                pricePerNignt: 350,
                capacity: 4,
                description: 'Spacious luxury suite with amazing city views and premium amenities',
                amenities: ['Free Wifi', 'Free Breakfast', 'Pool access', 'Mountain view'],
                images: [
                    'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800',
                    'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800'
                ],
                isAvailable: true,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                hotel: hotelId,
                roomType: 'Double Bed',
                pricePerNignt: 200,
                capacity: 2,
                description: 'Comfortable double bed room perfect for couples',
                amenities: ['Free Wifi', 'Free Breakfast', 'Free Services'],
                images: [
                    'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800',
                    'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800'
                ],
                isAvailable: true,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                hotel: hotelId,
                roomType: 'Single Bed',
                pricePerNignt: 120,
                capacity: 1,
                description: 'Cozy single room for solo travelers with all essentials',
                amenities: ['Free Wifi', 'Free Services'],
                images: [
                    'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800',
                    'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800'
                ],
                isAvailable: true,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                hotel: hotelId,
                roomType: 'Family Suite',
                pricePerNignt: 450,
                capacity: 6,
                description: 'Large family suite with multiple bedrooms and living area',
                amenities: ['Free Wifi', 'Free Breakfast', 'Pool access', 'Mountain view', 'Free Services'],
                images: [
                    'https://images.unsplash.com/photo-1596701062351-8c2c14d1fdd0?w=800',
                    'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?w=800'
                ],
                isAvailable: true,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                hotel: hotelId,
                roomType: 'Luxury Room',
                pricePerNignt: 280,
                capacity: 2,
                description: 'Premium room with modern amenities and elegant decor',
                amenities: ['Free Wifi', 'Free Breakfast', 'Pool access'],
                images: [
                    'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800',
                    'https://images.unsplash.com/photo-1631049035182-249067d7618e?w=800'
                ],
                isAvailable: true,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                hotel: hotelId,
                roomType: 'Double Bed',
                pricePerNignt: 180,
                capacity: 2,
                description: 'Standard double room with comfortable bedding',
                amenities: ['Free Wifi', 'Free Services'],
                images: [
                    'https://images.unsplash.com/photo-1595576508898-0ad5c879a061?w=800'
                ],
                isAvailable: true,
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ];

        const rooms = await roomsCollection.insertMany(sampleRooms);
        console.log(`✅ Created ${Object.keys(rooms.insertedIds).length} rooms\n`);

        // Display summary
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('🎉 DATABASE SEEDED SUCCESSFULLY!');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
        console.log(`📊 Summary:`);
        console.log(`   Hotels: 1`);
        console.log(`   Rooms: ${Object.keys(rooms.insertedIds).length}`);
        console.log(`\n🌐 You can now view rooms at: http://localhost:5173/rooms`);
        console.log('\n✨ All rooms are set to "isAvailable: true"\n');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding database:', error);
        process.exit(1);
    }
};

seedDatabase();
