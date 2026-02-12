import mongoose, { Schema, Document } from "mongoose";

export interface IBusVendor extends Document {
    name: string;
    email: string;
    phone: string;
    address: string;
}

const BusVendorSchema: Schema = new Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true },
        phone: { type: String, required: true },
        address: { type: String, required: true }
    },
    { timestamps: true }
);

export default mongoose.model<IBusVendor>("BusVendor", BusVendorSchema);
