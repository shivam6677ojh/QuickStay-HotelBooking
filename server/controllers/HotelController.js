import Hotel from "../models/HotelModel.js";
import User from "../models/UserModel.js";

// Create hotel
export const createHotel = async (req, res) => {
    try {
        const { name, address, contact, city, ownerId, image } = req.body;
        const isAdmin = req.user?.role === 'admin';
        const owner = isAdmin && ownerId ? ownerId : req.auth.userId;

        // Validate required fields
        if (!name || !address || !contact || !city) {
            return res.status(400).json({ 
                success: false, 
                message: "All fields (name, address, contact, city) are required" 
            });
        }

        const sanitizedContact = contact?.trim();
        const contactPattern = /^[+]?[\d\s\-()]{7,20}$/;
        if (sanitizedContact && !contactPattern.test(sanitizedContact)) {
            return res.status(400).json({ 
                success: false, 
                message: "Invalid contact number format" 
            });
        }

        // Ensure selected owner exists when admin assigns a hotel
        if (owner !== req.auth.userId) {
            const ownerUser = await User.findById(owner);
            if (!ownerUser) {
                return res.status(404).json({
                    success: false,
                    message: "Selected owner not found"
                });
            }
        }

        if (!isAdmin) {
            const existingHotel = await Hotel.findOne({ owner });
            if (existingHotel) {
                return res.status(400).json({ 
                    success: false, 
                    message: "Hotel already registered" 
                });
            }
        }

        const newHotel = await Hotel.create({
            name,
            address,
            contact,
            city,
            owner,
            image: image || ''
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
        const { name, address, contact, city, ownerId, image } = req.body;
        const isAdmin = req.user?.role === 'admin';
        
        const hotel = await Hotel.findById(id);
        
        if (!hotel) {
            return res.status(404).json({ 
                success: false, 
                message: "Hotel not found" 
            });
        }
        
        // Allow admins to edit any hotel, but restrict regular owners to their own hotel
        if (!isAdmin && hotel.owner.toString() !== req.auth.userId) {
            return res.status(403).json({ 
                success: false, 
                message: "Not authorized to update this hotel" 
            });
        }
        
        if (ownerId && isAdmin) {
            const ownerUser = await User.findById(ownerId);
            if (!ownerUser) {
                return res.status(404).json({
                    success: false,
                    message: "Selected owner not found"
                });
            }
            hotel.owner = ownerId;
        }
        
        if (name) hotel.name = name;
        if (address) hotel.address = address;
        if (contact) {
            const sanitizedContact = contact.trim();
            const contactPattern = /^[+]?[\d\s\-()]{7,20}$/;
            if (!contactPattern.test(sanitizedContact)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid contact number format"
                });
            }
            hotel.contact = sanitizedContact;
        }
        if (city) hotel.city = city;
        if (typeof image === 'string') hotel.image = image;
        
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