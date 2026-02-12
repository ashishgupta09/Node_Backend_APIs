import mongoose, { Schema, Document } from "mongoose";

export interface IBusSchedule extends Document {
    busName: string;
    vendorId: mongoose.Types.ObjectId;
    sourceLocation: mongoose.Types.ObjectId;
    destinationLocation: mongoose.Types.ObjectId;
    departureTime: Date;
    arrivalTime: Date;
    price: number;
    scheduleDate: Date;
}

const BusScheduleSchema: Schema = new Schema(
    {
        busName: { type: String, required: true },
        vendorId: { type: Schema.Types.ObjectId, ref: "BusVendor", required: true },
        sourceLocation: { type: Schema.Types.ObjectId, ref: "BusLocation", required: true },
        destinationLocation: { type: Schema.Types.ObjectId, ref: "BusLocation", required: true },
        departureTime: { type: Date, required: true },
        arrivalTime: { type: Date, required: true },
        price: { type: Number, required: true },
        scheduleDate: { type: Date, required: true }
    },
    { timestamps: true }
);

export default mongoose.model<IBusSchedule>("BusSchedule", BusScheduleSchema);
