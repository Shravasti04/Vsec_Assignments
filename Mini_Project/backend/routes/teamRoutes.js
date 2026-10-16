
const express = require("express");
const Team = require("../models/Team");
const Player = require("../models/Player");

const router = express.Router();

// Get all teams
router.get("/", async (req, res) => {
  try {
    const teams = await Team.find().sort({ createdAt: -1 });
    res.json(teams);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add a team
router.post("/", async (req, res) => {
  try {
    const team = await Team.create({
      name: req.body.name,
      coachName: req.body.coachName
    });
    res.status(201).json(team);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update a team
router.put("/:id", async (req, res) => {
  try {
    const team = await Team.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        coachName: req.body.coachName
      },
      { new: true, runValidators: true }
    );

    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }

    res.json(team);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a team if it has no players
router.delete("/:id", async (req, res) => {
  try {
    const playerCount = await Player.countDocuments({
      team: req.params.id
    });

    if (playerCount > 0) {
      return res.status(400).json({
        message: "Delete or reassign this team's players first."
      });
    }

    const team = await Team.findByIdAndDelete(req.params.id);

    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }

    res.json({ message: "Team deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
