import mongoose, { Schema, Document } from "mongoose";

export interface IBusLocation extends Document {
    locationId: number; // Custom ID for easier referencing if needed, or we rely on _id
    city: string;
    state: string;
    address: string;
}

const BusLocationSchema: Schema = new Schema(
    {
        locationId: { type: Number, unique: true }, // Optional: If user wants specific integer IDs
        city: { type: String, required: true },
        state: { type: String, required: true },
        address: { type: String, required: true }
    },
    { timestamps: true }
);

export default mongoose.model<IBusLocation>("BusLocation", BusLocationSchema);
