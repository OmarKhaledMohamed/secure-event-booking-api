import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      minlength: [2, "Title must be at least 2 characters"],
      maxlength: [100, "Title cannot exceed 100 characters"],
    },

    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
    },

    date: {
      type: Date,
      required: [true, "Date is required"],
    },

    location: {
      type: String,
      required: [true, "Location is required"],
      trim: true,
    },

    totalSeats: {
      type: Number,
      required: [true, "Total seats is required"],
      min: [1, "Total seats must be at least 1"],
    },

    availableSeats: {
      type: Number,
      required: true,
      min: 0,
    },

    organizer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);
eventSchema.index({ date: 1 });

const Event = mongoose.model("Event", eventSchema);

export default Event;
