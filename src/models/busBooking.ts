import mongoose, { Schema, Document } from "mongoose";

export interface IBusBooking extends Document {
    userId: mongoose.Types.ObjectId;
    scheduleId: mongoose.Types.ObjectId;
    seatNumbers: number[];
    status: "BOOKED" | "CANCELLED";
    totalAmount: number;
}

const BusBookingSchema: Schema = new Schema(
    {
        userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        scheduleId: { type: Schema.Types.ObjectId, ref: "BusSchedule", required: true },
        seatNumbers: { type: [Number], required: true },
        status: { type: String, enum: ["BOOKED", "CANCELLED"], default: "BOOKED" },
        totalAmount: { type: Number, required: true }
    },
    { timestamps: true }
);

export default mongoose.model<IBusBooking>("BusBooking", BusBookingSchema);
