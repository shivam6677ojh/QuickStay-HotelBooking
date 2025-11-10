import mongoose from 'mongoose';
import 'dotenv/config';
import Hotel from './models/HotelModel.js';
import Room from './models/RoomModel.js';
import User from './models/UserModel.js';

// Connect to MongoDB
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('MongoDB connection failed:', error.message);
        process.exit(1);
    }
};

// Sample data
const sampleHotels = [
    {
        name: 'Grand Palace Hotel',
        address: 'New York, USA',
        description: 'Luxury hotel in the heart of New York City',
        owner: 'user_2oOg6XKjAJL9B7Y1wCfN3X8sE7G' // Replace with actual Clerk user ID
    },
    {
        name: 'Ocean View Resort',
        address: 'Miami, Florida',
        description: 'Beautiful beachfront resort with stunning ocean views',
        owner: 'user_2oOg6XKjAJL9B7Y1wCfN3X8sE7G' // Replace with actual Clerk user ID
    }
];

const sampleRooms = [
    {
        roomType: 'Luxury Suite',
        pricePerNignt: 350,
        capacity: 4,
        amenities: ['Free Wifi', 'Free Breakfast', 'Pool access', 'Mountain view'],
        description: 'Spacious luxury suite with amazing city views',
        images: [
            'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800',
            'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800'
        ],
        isAvailable: true
    },
    {
        roomType: 'Double Bed',
        pricePerNignt: 200,
        capacity: 2,
        amenities: ['Free Wifi', 'Free Breakfast', 'Free Services'],
        description: 'Comfortable double bed room perfect for couples',
        images: [
            'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800',
            'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800'
        ],
        isAvailable: true
    },
    {
        roomType: 'Single Bed',
        pricePerNignt: 120,
        capacity: 1,
        amenities: ['Free Wifi', 'Free Services'],
        description: 'Cozy single room for solo travelers',
        images: [
            'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800'
        ],
        isAvailable: true
    },
    {
        roomType: 'Family Suite',
        pricePerNignt: 450,
        capacity: 6,
        amenities: ['Free Wifi', 'Free Breakfast', 'Pool access', 'Mountain view', 'Free Services'],
        description: 'Large family suite with multiple bedrooms',
        images: [
            'https://images.unsplash.com/photo-1596701062351-8c2c14d1fdd0?w=800',
            'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?w=800'
        ],
        isAvailable: true
    }
];

const seedData = async () => {
    try {
        await connectDB();

        // Clear existing data
        console.log('Clearing existing data...');
        await Room.deleteMany({});
        await Hotel.deleteMany({});

        // Create hotels
        console.log('Creating hotels...');
        const createdHotels = await Hotel.insertMany(sampleHotels);
        console.log(`✅ Created ${createdHotels.length} hotels`);

        // Create rooms for each hotel
        console.log('Creating rooms...');
        const roomsToCreate = [];
        
        createdHotels.forEach(hotel => {
            sampleRooms.forEach(room => {
                roomsToCreate.push({
                    ...room,
                    hotel: hotel._id
                });
            });
        });

        const createdRooms = await Room.insertMany(roomsToCreate);
        console.log(`✅ Created ${createdRooms.length} rooms`);

        console.log('\n🎉 Database seeded successfully!');
        console.log(`\nHotels: ${createdHotels.length}`);
        console.log(`Rooms: ${createdRooms.length}`);
        console.log('\n⚠️  NOTE: Update the "owner" field in sampleHotels with your actual Clerk user ID');
        
        process.exit(0);
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
};

seedData();
