import mongoose from "mongoose";

const connectDB = async ()=>{
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Database Connected Successfully");

        // // One-time migration for Profile collection: rename userId -> user, fix indexes
        // const db = mongoose.connection.db;
        // const profiles = db.collection('profiles');
        // try {
        //     // Rename legacy field if present
        //     await profiles.updateMany({ userId: { $exists: true } }, { $rename: { userId: 'user' } });
        // } catch (e) {
        //     // ignore if nothing to rename
        // }
        // try {
        //     // Drop legacy unique index if present
        //     await profiles.dropIndex('userId_1');
        // } catch (e) {
        //     // ignore if index doesn't exist
        // }
        // try {
        //     // Ensure desired unique index on user
        //     await profiles.createIndex({ user: 1 }, { unique: true, sparse: true });
        // } catch (e) {
        //     console.error('Failed to ensure profiles.user index', e);
        // }
    } catch (error) {
        console.error('Error', error);
        process.exit(1);
    }
}

export default connectDB;