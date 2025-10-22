import { Schema, model, models } from "mongoose";

const TaskSchema = new Schema(
  {
    userId: { type: String, index: true, required: true },
    title: { type: String, required: true },
    description: { type: String },
    completed: { type: Boolean, default: false },
    priority: { type: String, enum: ["low", "medium", "high"], default: "medium", index: true },
    dueDate: { type: Date, index: true },
    tags: { type: [String], default: [], index: true }
  },
  { timestamps: true }
);

export const TaskModel = models.Task || model("Task", TaskSchema);
