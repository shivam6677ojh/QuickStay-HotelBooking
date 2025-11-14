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
        address: '123 Fifth Avenue, Manhattan',
        city: 'New York',
        description: 'Luxury hotel in the heart of New York City with stunning skyline views',
        image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1200&q=80',
        owner: 'user_2oOg6XKjAJL9B7Y1wCfN3X8sE7G' // Replace with actual Clerk user ID
    },
    {
        name: 'Ocean View Resort',
        address: '456 Beach Boulevard',
        city: 'Miami',
        description: 'Beautiful beachfront resort with stunning ocean views and private beach access',
        image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1200&q=80',
        owner: 'user_2oOg6XKjAJL9B7Y1wCfN3X8sE7G' // Replace with actual Clerk user ID
    }
];

const sampleRooms = [
    {
        roomType: 'Luxury Suite',
        pricePerNignt: 350,
        capacity: 4,
        amenities: ['Free WiFi', 'Free Breakfast', 'Pool Access', 'Mountain View'],
        description: 'Spacious luxury suite with amazing city views',
        images: [
            'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=1200&q=80',
            'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1200&q=80',
            'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=1200&q=80'
        ],
        isAvailable: true
    },
    {
        roomType: 'Double Bed',
        pricePerNignt: 200,
        capacity: 2,
        amenities: ['Free WiFi', 'Free Breakfast', 'Room Service'],
        description: 'Comfortable double bed room perfect for couples',
        images: [
            'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=1200&q=80',
            'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=1200&q=80',
            'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1200&q=80'
        ],
        isAvailable: true
    },
    {
        roomType: 'Single Bed',
        pricePerNignt: 120,
        capacity: 1,
        amenities: ['Free WiFi', 'Room Service'],
        description: 'Cozy single room for solo travelers',
        images: [
            'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1200&q=80',
            'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=1200&q=80'
        ],
        isAvailable: true
    },
    {
        roomType: 'Family Suite',
        pricePerNignt: 450,
        capacity: 6,
        amenities: ['Free WiFi', 'Free Breakfast', 'Pool Access', 'Mountain View', 'Room Service'],
        description: 'Large family suite with multiple bedrooms',
        images: [
            'https://images.unsplash.com/photo-1596701062351-8c2c14d1fdd0?w=1200&q=80',
            'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?w=1200&q=80',
            'https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?w=1200&q=80'
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
