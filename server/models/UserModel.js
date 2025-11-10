import mongoose from "mongoose";

const userSchema = new mongoose.Schema({

    _id: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    image:{
        type: String,
        required: true
    },
    role:{
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    recentSearchedCites: [{
        type: String,
        required: true
    }]
    
}, 

{ timestamps: true });

const User = mongoose.model("User", userSchema);

export default User;