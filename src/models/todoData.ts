import mongoose, { Schema, Document } from "mongoose";

export interface ITodo extends Document {
  userId: mongoose.Types.ObjectId;
  todo: string;
  completed: boolean;
  dueDate?: Date;
  priority: "low" | "medium" | "high";
  tags: string[];
}

const TodoSchema = new Schema<ITodo>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "UserData", required: true },
    todo: { type: String, required: true },
    completed: { type: Boolean, default: false },
    dueDate: { type: Date },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
    tags: [{ type: String }],
  },
  { timestamps: true }
);

export const Todo = mongoose.model<ITodo>("Todo", TodoSchema);
