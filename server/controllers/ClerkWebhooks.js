import User from "../models/UserModel.js";
import { Webhook } from "svix";

const clerWebhook = async (req, res) => {
    try {
        const wh = new Webhook(process.env.ClERK_WEBHOOK_SECRET);

        const headers = {
            "svix-id": req.headers["svix-id"],
            "svix-timestamp": req.headers["svix-timestamp"],
            "svix-signature": req.headers["svix-signature"]
        };

        await wh.verify(JSON.stringify(req.body), headers);

        const { data, type } = req.body;

        const userData = {
            _id: data.id,
            name: data.first_name + " " + data.last_name,
            email: data.email_addresses[0].email_address,
            image: data.image_url,
        };

        // switch case for different webhook types
        switch (type) {
            case "user.created":
                await User.create(userData);
                console.log(`✅ User created in database: ${userData.email}`);
                break;

            case "user.updated":
                await User.findByIdAndUpdate(data.id, userData);
                console.log(`✅ User updated in database: ${userData.email}`);
                break;

            case "user.deleted":
                await User.findByIdAndDelete(data.id);
                console.log(`✅ User deleted from database: ${data.id}`);
                break;

            default:
                console.log(`⚠️  Unknown webhook type: ${type}`);
                break;

        }
        res.json({ success: true, message: "Webhook processed successfully" });
        

    } catch (error) {
        console.error("Error processing Clerk webhook:", error.message);
        res.status(400).json({ success: false, message: "Invalid webhook" });
    }
}

export default clerWebhook;