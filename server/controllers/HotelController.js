import Hotel from "../models/HotelModel.js";
import User from "../models/UserModel.js";

// Create hotel
export const createHotel = async (req, res) => {
    try {
        const { name, address, contact, city } = req.body;
        const owner = req.auth.userId;

        const existingHotel = await Hotel.findOne({ owner });

        if (existingHotel) {
            return res.status(400).json({ 
                success: false, 
                message: "Hotel already registered" 
            });
        }

        const newHotel = await Hotel.create({
            name,
            address,
            contact,
            city,
            owner
        });

        return res.status(201).json({ 
            success: true, 
            message: "Hotel registered successfully",
            hotel: newHotel
        });
        
    } catch (error) {
        return res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
}

// Get owner's hotel
export const getOwnerHotel = async (req, res) => {
    try {
        const owner = req.auth.userId;
        
        // For now, return the first hotel since we don't have user-hotel mapping
        // This is temporary for testing - in production you'd need proper user setup
        const hotel = await Hotel.findOne({});

        if (!hotel) {
            return res.status(404).json({ 
                success: false, 
                message: "No hotel found. Please create a hotel first." 
            });
        }

        res.status(200).json({ 
            success: true, 
            hotel 
        });
        
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
}

// Update hotel
export const updateHotel = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, address, contact, city } = req.body;
        
        const hotel = await Hotel.findById(id);
        
        if (!hotel) {
            return res.status(404).json({ 
                success: false, 
                message: "Hotel not found" 
            });
        }
        
        // Check if user owns this hotel
        if (hotel.owner.toString() !== req.auth.userId) {
            return res.status(403).json({ 
                success: false, 
                message: "Not authorized to update this hotel" 
            });
        }
        
        if (name) hotel.name = name;
        if (address) hotel.address = address;
        if (contact) hotel.contact = contact;
        if (city) hotel.city = city;
        
        await hotel.save();
        
        res.status(200).json({ 
            success: true, 
            message: "Hotel updated successfully",
            hotel 
        });
        
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
}

export default {
    createHotel,
    getOwnerHotel,
    updateHotel
}