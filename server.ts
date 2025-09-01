import express from "express";
import sqlite3 from "sqlite3";
import { open } from "sqlite";
import path from "path";

const app = express();
app.use(express.json());

// Database setup
let db: any;

async function initializeDatabase() {
  db = await open({
    filename: path.join(__dirname, 'prisma', 'dev.db'),
    driver: sqlite3.Database
  });
}

app.post("/echo", (req, res) => {
  console.log("Echo endpoint hit!", req.body);
  res.json(req.body);
});

// POST endpoint for creating or updating user profiles
app.post("/api/users/profile", async (req, res) => {
  try {
    const {
      userId,
      profileJson,
      firstName,
      lastNameInitial,
      pronouns,
      genderIdentity,
      orientation,
      miniInventories,
      fourPrompts,
      homeCity,
      matchRadius,
      typicalNights
    } = req.body;

    // Validate required fields
    const requiredFields = {
      userId: "User ID",
      firstName: "First name", 
      lastNameInitial: "Last name initial",
      pronouns: "Pronouns",
      genderIdentity: "Gender identity",
      orientation: "Orientation", 
      homeCity: "Home city",
      matchRadius: "Match radius",
      typicalNights: "Typical nights"
    };

    const missingFields = [];
    for (const [field, displayName] of Object.entries(requiredFields)) {
      if (req.body[field] === undefined || req.body[field] === null || req.body[field] === "") {
        missingFields.push(displayName);
      }
    }

    if (missingFields.length > 0) {
      return res.status(400).json({
        error: "Missing required fields",
        missingFields: missingFields
      });
    }

    // Additional validation for matchRadius to ensure it's a number
    if (isNaN(matchRadius) || matchRadius <= 0) {
      return res.status(400).json({
        error: "Match radius must be a positive number"
      });
    }

    // Check if all required fields are filled to determine isProfileComplete
    const isProfileComplete = [
      firstName,
      lastNameInitial, 
      pronouns,
      genderIdentity,
      orientation,
      homeCity,
      matchRadius,
      typicalNights
    ].every(field => field !== undefined && field !== null && field !== "");

    // Check if user exists
    const userExists = await db.get('SELECT id FROM User WHERE id = ?', [parseInt(userId)]);
    if (!userExists) {
      return res.status(400).json({
        error: "Invalid user ID - user does not exist"
      });
    }

    // Check if profile already exists
    const existingProfile = await db.get('SELECT id FROM Profile WHERE userId = ?', [parseInt(userId)]);
    
    let profile;
    if (existingProfile) {
      // Update existing profile
      await db.run(`
        UPDATE Profile SET 
          profileJson = ?, firstName = ?, lastNameInitial = ?, pronouns = ?, 
          genderIdentity = ?, orientation = ?, miniInventories = ?, fourPrompts = ?, 
          homeCity = ?, matchRadius = ?, typicalNights = ?, isProfileComplete = ?
        WHERE userId = ?
      `, [
        profileJson || null, firstName, lastNameInitial, pronouns,
        genderIdentity, orientation, miniInventories || null, fourPrompts || null,
        homeCity, parseInt(matchRadius), typicalNights, isProfileComplete,
        parseInt(userId)
      ]);
      
      profile = await db.get('SELECT * FROM Profile WHERE userId = ?', [parseInt(userId)]);
    } else {
      // Create new profile
      const result = await db.run(`
        INSERT INTO Profile (
          userId, profileJson, firstName, lastNameInitial, pronouns, 
          genderIdentity, orientation, miniInventories, fourPrompts, 
          homeCity, matchRadius, typicalNights, isProfileComplete
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        parseInt(userId), profileJson || null, firstName, lastNameInitial, pronouns,
        genderIdentity, orientation, miniInventories || null, fourPrompts || null,
        homeCity, parseInt(matchRadius), typicalNights, isProfileComplete
      ]);
      
      profile = await db.get('SELECT * FROM Profile WHERE id = ?', [result.lastID]);
    }

    res.status(200).json({
      success: true,
      message: "Profile saved successfully",
      profile: profile
    });

  } catch (error) {
    console.error("Error saving profile:", error);
    res.status(500).json({
      error: "Internal server error",
      details: error.message
    });
  }
});

const PORT = process.env.PORT || 4000;

initializeDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`Backend server running on port ${PORT}`);
  });
}).catch(error => {
  console.error("Failed to initialize database:", error);
});