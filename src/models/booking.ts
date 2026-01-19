import mongoose, { Schema, Document } from "mongoose";

export interface IBooking extends Document {
    passengerName: string;
    from: string;
    to: string;
    travelDate: Date;
    seatNumber: number;
    price: number;
}

const BookingSchema: Schema = new Schema(
    {
        passengerName: { type: String, required: true },
        from: { type: String, required: true },
        to: { type: String, required: true },
        travelDate: { type: Date, required: true },
        seatNumber: { type: Number, required: true },
        price: { type: Number, required: true }
    },
    { timestamps: true }
);

export default mongoose.model<IBooking>("Booking", BookingSchema);
