const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    author: { type: String, required: true },
    genre: String,
    location: { type: String, required: true },
    contact: { type: String, required: true },
    status: {
      type: String,
      default: "available",
      enum: ["available", "requested", "unavailable", "exchanged"],
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    requestedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    available: {
      type: Boolean,
      default: true,
    },
    requests: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Request",
      },
    ],
    currentRequest: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Request",
      default: null,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

bookSchema.virtual("activeRequest", {
  ref: "Request",
  localField: "currentRequest",
  foreignField: "_id",
  justOne: true,
});

bookSchema.pre("save", function (next) {
  if (this.isModified("status")) {
    this.available = this.status === "available";
  }
  next();
});

module.exports = mongoose.model("Book", bookSchema);
