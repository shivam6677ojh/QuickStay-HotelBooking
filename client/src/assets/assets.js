import logo from './logo.svg'
import searchIcon from './searchIcon.svg'
import userIcon from './userIcon.svg'
import calenderIcon from './calenderIcon.svg'
import locationIcon from './locationIcon.svg'
import starIconFilled from './starIconFilled.svg'
import arrowIcon from './arrowIcon.svg'
import starIconOutlined from './starIconOutlined.svg'
import instagramIcon from './instagramIcon.svg'
import facebookIcon from './facebookIcon.svg'
import twitterIcon from './twitterIcon.svg'
import linkendinIcon from './linkendinIcon.svg'
import freeWifiIcon from './freeWifiIcon.svg'
import freeBreakfastIcon from './freeBreakfastIcon.svg'
import roomServiceIcon from './roomServiceIcon.svg'
import mountainIcon from './mountainIcon.svg'
import poolIcon from './poolIcon.svg'
import homeIcon from './homeIcon.svg'
import closeIcon from './closeIcon.svg'
import locationFilledIcon from './locationFilledIcon.svg'
import heartIcon from './heartIcon.svg'
import badgeIcon from './badgeIcon.svg'
import menuIcon from './menuIcon.svg'
import closeMenu from './closeMenu.svg'
import guestsIcon from './guestsIcon.svg'
import roomImg1 from './roomImg1.png'
import roomImg2 from './roomImg2.png'
import roomImg3 from './roomImg3.png'
import roomImg4 from './roomImg4.png'
import regImage from './regImage.png'
import exclusiveOfferCardImg1 from "./exclusiveOfferCardImg1.png";
import exclusiveOfferCardImg2 from "./exclusiveOfferCardImg2.png";
import exclusiveOfferCardImg3 from "./exclusiveOfferCardImg3.png";
import addIcon from "./addIcon.svg";
import dashboardIcon from "./dashboardIcon.svg";
import listIcon from "./listIcon.svg";
import uploadArea from "./uploadArea.svg";
import totalBookingIcon from "./totalBookingIcon.svg";
import totalRevenueIcon from "./totalRevenueIcon.svg";


export const assets = {
    logo,
    searchIcon,
    userIcon,
    calenderIcon,
    locationIcon,
    starIconFilled,
    arrowIcon,
    starIconOutlined,
    instagramIcon,
    facebookIcon,
    twitterIcon,
    linkendinIcon,
    freeWifiIcon,
    freeBreakfastIcon,
    roomServiceIcon,
    mountainIcon,
    poolIcon,
    closeIcon,
    homeIcon,
    locationFilledIcon,
    heartIcon,
    badgeIcon,
    menuIcon,
    closeMenu,
    guestsIcon,
    regImage,
    addIcon,
    dashboardIcon,
    listIcon,
    uploadArea,
    totalBookingIcon,
    totalRevenueIcon,
}

export const cities = [
    "Dubai",
    "Singapore",
    "New York",
    "London",
];

// Exclusive Offers Dummy Data
export const exclusiveOffers = [
    { _id: 1, title: "Summer Escape Package", description: "Enjoy a complimentary night and daily breakfast", priceOff: 25, expiryDate: "Aug 31", image: exclusiveOfferCardImg1 },
    { _id: 2, title: "Romantic Getaway", description: "Special couples package including spa treatment", priceOff: 20, expiryDate: "Sep 20", image: exclusiveOfferCardImg2 },
    { _id: 3, title: "Luxury Retreat", description: "Book 60 days in advance and save on your stay at any of our luxury properties worldwide.", priceOff: 30, expiryDate: "Sep 25", image: exclusiveOfferCardImg3 },
]

// Testimonials Dummy Data
export const testimonials = [
    { id: 1, name: "Emma Rodriguez", address: "Barcelona, Spain", image: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=200", rating: 5, review: "I've used many booking platforms before, but none compare to the personalized experience and attention to detail that QuickStay provides." },
    { id: 2, name: "Liam Johnson", address: "New York, USA", image: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200", rating: 4, review: "QuickStay exceeded my expectations. The booking process was seamless, and the hotels were absolutely top-notch. Highly recommended!" },
    { id: 3, name: "Sophia Lee", address: "Seoul, South Korea", image: "https://images.unsplash.com/photo-1701615004837-40d8573b6652?q=80&w=200", rating: 5, review: "Amazing service! I always find the best luxury accommodations through QuickStay. Their recommendations never disappoint!" }
];

// Facility Icon
export const facilityIcons = {
    "Free WiFi": assets.freeWifiIcon,
    "Free Breakfast": assets.freeBreakfastIcon,
    "Room Service": assets.roomServiceIcon,
    "Mountain View": assets.mountainIcon,
    "Pool Access": assets.poolIcon,
};

// For Room Details Page
export const roomCommonData = [
    { icon: assets.homeIcon, title: "Clean & Safe Stay", description: "A well-maintained and hygienic space just for you." },
    { icon: assets.badgeIcon, title: "Enhanced Cleaning", description: "This host follows Staybnb's strict cleaning standards." },
    { icon: assets.locationFilledIcon, title: "Excellent Location", description: "90% of guests rated the location 5 stars." },
    { icon: assets.heartIcon, title: "Smooth Check-In", description: "100% of guests gave check-in a 5-star rating." },
];

// User Dummy Data
export const userDummyData = {
    "_id": "user_2unqyL4diJFP1E3pIBnasc7w8hP",
    "username": "Great Stack",
    "email": "user.greatstack@gmail.com",
    "image": "https://img.clerk.com/eyJ0eXBlIjoicHJveHkiLCJzcmMiOiJodHRwczovL2ltYWdlcy5jbGVyay5kZXYvdXBsb2FkZWQvaW1nXzJ2N2c5YVpSSEFVYVUxbmVYZ2JkSVVuWnFzWSJ9",
    "role": "hotelOwner",
    "createdAt": "2025-03-25T09:29:16.367Z",
    "updatedAt": "2025-04-10T06:34:48.719Z",
    "__v": 1,
    "recentSearchedCities": [
        "New York"
    ]
}

// Hotel Dummy Data - Multiple Hotels
export const hotelsDummyData = [
    {
        "_id": "67f76393197ac559e4089b72",
        "name": "The Grand Meridian",
        "address": "789 Fifth Avenue, Manhattan",
        "contact": "+1 (212) 555-0123",
        "owner": userDummyData,
        "city": "New York",
        "createdAt": "2025-04-10T06:22:11.663Z",
        "updatedAt": "2025-04-10T06:22:11.663Z",
        "__v": 0
    },
    {
        "_id": "67f76393197ac559e4089b73",
        "name": "Azure Bay Resort",
        "address": "123 Ocean Drive, South Beach",
        "contact": "+1 (305) 555-0456",
        "owner": userDummyData,
        "city": "Miami",
        "createdAt": "2025-04-10T06:22:11.663Z",
        "updatedAt": "2025-04-10T06:22:11.663Z",
        "__v": 0
    },
    {
        "_id": "67f76393197ac559e4089b74",
        "name": "Skyline Palace Hotel",
        "address": "456 Michigan Avenue, Downtown",
        "contact": "+1 (312) 555-0789",
        "owner": userDummyData,
        "city": "Chicago",
        "createdAt": "2025-04-10T06:22:11.663Z",
        "updatedAt": "2025-04-10T06:22:11.663Z",
        "__v": 0
    },
    {
        "_id": "67f76393197ac559e4089b75",
        "name": "Golden Gate Luxury Suites",
        "address": "321 Market Street, Financial District",
        "contact": "+1 (415) 555-0321",
        "owner": userDummyData,
        "city": "San Francisco",
        "createdAt": "2025-04-10T06:22:11.663Z",
        "updatedAt": "2025-04-10T06:22:11.663Z",
        "__v": 0
    },
    {
        "_id": "67f76393197ac559e4089b76",
        "name": "Beverly Hills Royal Hotel",
        "address": "910 Rodeo Drive, Beverly Hills",
        "contact": "+1 (310) 555-0654",
        "owner": userDummyData,
        "city": "Los Angeles",
        "createdAt": "2025-04-10T06:22:11.663Z",
        "updatedAt": "2025-04-10T06:22:11.663Z",
        "__v": 0
    },
    {
        "_id": "67f76393197ac559e4089b77",
        "name": "Harbor View Grand",
        "address": "555 Waterfront Avenue, Harbor District",
        "contact": "+1 (206) 555-0987",
        "owner": userDummyData,
        "city": "Seattle",
        "createdAt": "2025-04-10T06:22:11.663Z",
        "updatedAt": "2025-04-10T06:22:11.663Z",
        "__v": 0
    },
    {
        "_id": "67f76393197ac559e4089b78",
        "name": "Desert Oasis Resort",
        "address": "777 Las Vegas Boulevard, The Strip",
        "contact": "+1 (702) 555-0147",
        "owner": userDummyData,
        "city": "Las Vegas",
        "createdAt": "2025-04-10T06:22:11.663Z",
        "updatedAt": "2025-04-10T06:22:11.663Z",
        "__v": 0
    },
    {
        "_id": "67f76393197ac559e4089b79",
        "name": "Historic Liberty Inn",
        "address": "234 Independence Mall, Old City",
        "contact": "+1 (215) 555-0258",
        "owner": userDummyData,
        "city": "Philadelphia",
        "createdAt": "2025-04-10T06:22:11.663Z",
        "updatedAt": "2025-04-10T06:22:11.663Z",
        "__v": 0
    },
    {
        "_id": "67f76393197ac559e4089b80",
        "name": "Coral Reef Beach Resort",
        "address": "888 Beachfront Road, Paradise Island",
        "contact": "+1 (786) 555-0369",
        "owner": userDummyData,
        "city": "Miami Beach",
        "createdAt": "2025-04-10T06:22:11.663Z",
        "updatedAt": "2025-04-10T06:22:11.663Z",
        "__v": 0
    },
    {
        "_id": "67f76393197ac559e4089b81",
        "name": "Mountain Peak Lodge",
        "address": "999 Alpine Way, Mountain Village",
        "contact": "+1 (303) 555-0741",
        "owner": userDummyData,
        "city": "Denver",
        "createdAt": "2025-04-10T06:22:11.663Z",
        "updatedAt": "2025-04-10T06:22:11.663Z",
        "__v": 0
    }
];

// Keep original for backward compatibility
export const hotelDummyData = hotelsDummyData[0];

// Rooms Dummy Data - Updated with different hotels
export const roomsDummyData = [
    {
        "_id": "67f7647c197ac559e4089b96",
        "hotel": hotelsDummyData[0],
        "roomType": "Luxury Suite",
        "pricePerNight": 599,
        "amenities": ["Free WiFi", "Room Service", "Mountain View", "Pool Access"],
        "images": [roomImg1, roomImg2, roomImg3, roomImg4],
        "isAvailable": true,
        "createdAt": "2025-04-10T06:26:04.013Z",
        "updatedAt": "2025-04-10T06:26:04.013Z",
        "__v": 0
    },
    {
        "_id": "67f76452197ac559e4089b8e",
        "hotel": hotelsDummyData[1],
        "roomType": "Ocean View Double",
        "pricePerNight": 449,
        "amenities": ["Free Breakfast", "Room Service", "Pool Access"],
        "images": [roomImg2, roomImg3, roomImg4, roomImg1],
        "isAvailable": true,
        "createdAt": "2025-04-10T06:25:22.593Z",
        "updatedAt": "2025-04-10T06:25:22.593Z",
        "__v": 0
    },
    {
        "_id": "67f76406197ac559e4089b82",
        "hotel": hotelsDummyData[2],
        "roomType": "Family Suite",
        "pricePerNight": 379,
        "amenities": ["Free WiFi", "Free Breakfast", "Room Service"],
        "images": [roomImg3, roomImg4, roomImg1, roomImg2],
        "isAvailable": true,
        "createdAt": "2025-04-10T06:24:06.285Z",
        "updatedAt": "2025-04-10T06:24:06.285Z",
        "__v": 0
    },
    {
        "_id": "67f763d8197ac559e4089b7a",
        "hotel": hotelsDummyData[3],
        "roomType": "Deluxe King Room",
        "pricePerNight": 329,
        "amenities": ["Free WiFi", "Room Service", "Mountain View"],
        "images": [roomImg4, roomImg1, roomImg2, roomImg3],
        "isAvailable": true,
        "createdAt": "2025-04-10T06:23:20.252Z",
        "updatedAt": "2025-04-10T06:23:20.252Z",
        "__v": 0
    },
    {
        "_id": "67f763d8197ac559e4089b7b",
        "hotel": hotelsDummyData[4],
        "roomType": "Premium Suite",
        "pricePerNight": 699,
        "amenities": ["Free WiFi", "Free Breakfast", "Pool Access"],
        "images": [roomImg1, roomImg3, roomImg2, roomImg4],
        "isAvailable": true,
        "createdAt": "2025-04-10T06:23:20.252Z",
        "updatedAt": "2025-04-10T06:23:20.252Z",
        "__v": 0
    },
    {
        "_id": "67f763d8197ac559e4089b7c",
        "hotel": hotelsDummyData[5],
        "roomType": "Harbor View Room",
        "pricePerNight": 289,
        "amenities": ["Free WiFi", "Room Service"],
        "images": [roomImg2, roomImg4, roomImg1, roomImg3],
        "isAvailable": true,
        "createdAt": "2025-04-10T06:23:20.252Z",
        "updatedAt": "2025-04-10T06:23:20.252Z",
        "__v": 0
    },
    {
        "_id": "67f763d8197ac559e4089b7d",
        "hotel": hotelsDummyData[6],
        "roomType": "Luxury King Suite",
        "pricePerNight": 799,
        "amenities": ["Free WiFi", "Free Breakfast", "Room Service", "Pool Access"],
        "images": [roomImg3, roomImg1, roomImg4, roomImg2],
        "isAvailable": true,
        "createdAt": "2025-04-10T06:23:20.252Z",
        "updatedAt": "2025-04-10T06:23:20.252Z",
        "__v": 0
    },
    {
        "_id": "67f763d8197ac559e4089b7e",
        "hotel": hotelsDummyData[7],
        "roomType": "Historic Suite",
        "pricePerNight": 349,
        "amenities": ["Free WiFi", "Free Breakfast"],
        "images": [roomImg4, roomImg2, roomImg3, roomImg1],
        "isAvailable": true,
        "createdAt": "2025-04-10T06:23:20.252Z",
        "updatedAt": "2025-04-10T06:23:20.252Z",
        "__v": 0
    },
    {
        "_id": "67f763d8197ac559e4089b7f",
        "hotel": hotelsDummyData[8],
        "roomType": "Beachfront Villa",
        "pricePerNight": 899,
        "amenities": ["Free WiFi", "Room Service", "Pool Access", "Mountain View"],
        "images": [roomImg1, roomImg4, roomImg2, roomImg3],
        "isAvailable": true,
        "createdAt": "2025-04-10T06:23:20.252Z",
        "updatedAt": "2025-04-10T06:23:20.252Z",
        "__v": 0
    },
    {
        "_id": "67f763d8197ac559e4089b80",
        "hotel": hotelsDummyData[9],
        "roomType": "Mountain View Lodge",
        "pricePerNight": 429,
        "amenities": ["Free WiFi", "Free Breakfast", "Mountain View"],
        "images": [roomImg2, roomImg1, roomImg3, roomImg4],
        "isAvailable": true,
        "createdAt": "2025-04-10T06:23:20.252Z",
        "updatedAt": "2025-04-10T06:23:20.252Z",
        "__v": 0
    }
]



// User Bookings Dummy Data
export const userBookingsDummyData = [
    {
        "_id": "67f76839994a731e97d3b8ce",
        "user": userDummyData,
        "room": roomsDummyData[1],
        "hotel": hotelDummyData,
        "checkInDate": "2025-04-30T00:00:00.000Z",
        "checkOutDate": "2025-05-01T00:00:00.000Z",
        "totalPrice": 299,
        "guests": 1,
        "status": "pending",
        "paymentMethod": "Stripe",
        "isPaid": true,
        "createdAt": "2025-04-10T06:42:01.529Z",
        "updatedAt": "2025-04-10T06:43:54.520Z",
        "__v": 0
    },
    {
        "_id": "67f76829994a731e97d3b8c3",
        "user": userDummyData,
        "room": roomsDummyData[0],
        "hotel": hotelDummyData,
        "checkInDate": "2025-04-27T00:00:00.000Z",
        "checkOutDate": "2025-04-28T00:00:00.000Z",
        "totalPrice": 399,
        "guests": 1,
        "status": "pending",
        "paymentMethod": "Pay At Hotel",
        "isPaid": false,
        "createdAt": "2025-04-10T06:41:45.873Z",
        "updatedAt": "2025-04-10T06:41:45.873Z",
        "__v": 0
    },
    {
        "_id": "67f76810994a731e97d3b8b4",
        "user": userDummyData,
        "room": roomsDummyData[3],
        "hotel": hotelDummyData,
        "checkInDate": "2025-04-11T00:00:00.000Z",
        "checkOutDate": "2025-04-12T00:00:00.000Z",
        "totalPrice": 199,
        "guests": 1,
        "status": "pending",
        "paymentMethod": "Pay At Hotel",
        "isPaid": false,
        "createdAt": "2025-04-10T06:41:20.501Z",
        "updatedAt": "2025-04-10T06:41:20.501Z",
        "__v": 0
    }
]

// Dashboard Dummy Data
export const dashboardDummyData = {
    "totalBookings": 3,
    "totalRevenue": 897,
    "bookings": userBookingsDummyData
}

// --------- SVG code for Book Icon------
/* 
const BookIcon = ()=>(
    <svg className="w-4 h-4 text-gray-700" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" >
    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 19V4a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v13H7a2 2 0 0 0-2 2Zm0 0a2 2 0 0 0 2 2h12M9 3v14m7 0v4" />
</svg>
)

*/