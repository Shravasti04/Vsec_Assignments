
const express = require("express");
const Player = require("../models/Player");
const Team = require("../models/Team");

const router = express.Router();

// Get all players, with optional search and filters
router.get("/", async (req, res) => {
  try {
    const filter = {};

    if (req.query.search) {
      filter.name = {
        $regex: req.query.search,
        $options: "i"
      };
    }

    if (req.query.role) filter.role = req.query.role;
    if (req.query.team) filter.team = req.query.team;

    const players = await Player.find(filter)
      .populate("team", "name")
      .sort({ createdAt: -1 });

    res.json(players);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add a player
router.post("/", async (req, res) => {
  try {
    const { name, age, role, team } = req.body;

    const validTeam = await Team.findById(team);
    if (!validTeam) {
      return res.status(400).json({ message: "Select a valid team." });
    }

    const player = await Player.create({ name, age, role, team });
    await player.populate("team", "name");

    res.status(201).json(player);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update a player
router.put("/:id", async (req, res) => {
  try {
    const { name, age, role, team } = req.body;

    const validTeam = await Team.findById(team);
    if (!validTeam) {
      return res.status(400).json({ message: "Select a valid team." });
    }

    const player = await Player.findByIdAndUpdate(
      req.params.id,
      { name, age, role, team },
      { new: true, runValidators: true }
    ).populate("team", "name");

    if (!player) {
      return res.status(404).json({ message: "Player not found" });
    }

    res.json(player);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a player
router.delete("/:id", async (req, res) => {
  try {
    const player = await Player.findByIdAndDelete(req.params.id);

    if (!player) {
      return res.status(404).json({ message: "Player not found" });
    }

    res.json({ message: "Player deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
