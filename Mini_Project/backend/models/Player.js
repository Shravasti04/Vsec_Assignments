
const mongoose = require("mongoose");

const playerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    age: {
      type: Number,
      required: true,
      min: 1
    },
    role: {
      type: String,
      required: true,
      enum: ["Batsman", "Bowler", "All-rounder", "Wicketkeeper"]
    },
    team: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
      required: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Player", playerSchema);
