const UserProfile = require("../model/UserProfile");
const fs = require("fs");
const path = require("path");


// ================= CREATE PROFILE =================
exports.createUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    // check already exists
    const existingProfile = await UserProfile.findOne({ userId });
    if (existingProfile) {
      return res.status(400).json({ message: "Profile already exists" });
    }

    const profileData = {
      userId,
      ...req.body,
    };

    // image upload
    if (req.file) {
      profileData.profileImage = `/Img/${req.file.filename}`;
    }

    const profile = await UserProfile.create(profileData);

    res.status(201).json({
      message: "User profile created successfully",
      profile,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create profile",
      error: error.message,
    });
  }
};


// ================= GET PROFILE =================
exports.getUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const profile = await UserProfile.findOne({ userId })
      .populate("userId", "name email");

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    res.status(200).json({
      message: "Profile fetched successfully",
      profile,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch profile",
      error: error.message,
    });
  }
};


// ================= UPDATE PROFILE =================
exports.updateUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const existingProfile = await UserProfile.findOne({ userId });

    if (!existingProfile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    const updateData = { ...req.body };

    // ===== new image upload =====
    if (req.file) {
      // delete old image if exists
      if (existingProfile.profileImage) {
        const oldImagePath = path.join(
          __dirname,
          "..",
          existingProfile.profileImage
        );

        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }

      updateData.profileImage = `/Img/${req.file.filename}`;
    }

    const profile = await UserProfile.findOneAndUpdate(
      { userId },
      updateData,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      message: "Profile updated successfully",
      profile,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update profile",
      error: error.message,
    });
  }
};


// ================= DELETE PROFILE =================
exports.deleteUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const profile = await UserProfile.findOne({ userId });

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    // delete image from server
    if (profile.profileImage) {
      const imagePath = path.join(__dirname, "..", profile.profileImage);

      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await UserProfile.findOneAndDelete({ userId });

    res.status(200).json({
      message: "Profile deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete profile",
      error: error.message,
    });
  }
};
