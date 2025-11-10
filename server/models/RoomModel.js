import mongoose from "mongoose";

const RoomSchema = new mongoose.Schema(
    {
        hotel: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Hotel",
            required: true
        },
        roomType:{
            type: String,
            required: true
        },
        pricePerNignt:{
            type: String,
            required: true,
        },
        amenities: [
            {
                type: String
            }
        ],
        capacity: {
            type: Number,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        images: [
            {
                type: String
            }
        ],
        isAvailable: {
            type: Boolean,
            default : true
        }


    },
    { timestamps: true });


const Room = mongoose.model("Room", RoomSchema);

export default Room;