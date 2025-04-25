import mongoose, { Document, Schema } from "mongoose";

export enum TodoStatus {
  PENDING = "pending",
  IN_PROGRESS = "in-progress",
  COMPLETED = "completed",
}

export interface ITodo extends Document {
  title: string;
  description: string;
  status: TodoStatus;
  dueDate: Date;
  owner: mongoose.Types.ObjectId;
}

const TodoSchema = new Schema<ITodo>(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [100, "Title cannot be more than 100 characters"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, "Description cannot be more than 500 characters"],
    },
    status: {
      type: String,
      enum: Object.values(TodoStatus),
      default: TodoStatus.PENDING,
    },
    dueDate: {
      type: Date,
      required: [true, "Due date is required"],
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User reference is required"],
    },
  },
  { timestamps: true }
);

// Add index for faster queries
TodoSchema.index({ owner: 1, status: 1 });

const Todo = mongoose.model<ITodo>("Todo", TodoSchema);

export default Todo;
