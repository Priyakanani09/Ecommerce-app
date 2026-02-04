const UserProfile = require("../model/UserProfile");

exports.createUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const existingProfile = await UserProfile.findOne({ userId});

    if (existingProfile) {
      return res.status(400).json({ message: "Profile already exists" });
    }

    const profileData = {
      userId,
      ...req.body,
    };

    if (req.file) {
      profileData.profileImage = `/Img/${req.file.filename}`;
    }

    const profile = await UserProfile.create(profileData);

    res.status(201).json({ message: "User profile created successfully", profile });
  } 
  catch (error) {
    res.status(500).json({ message: "Failed to create profile", error: error.message,
    });
  }
};
exports.getUserProfile = async (req ,res) => {
  try{
    const userId = req.user.id;

    const profile = await UserProfile.findOne({userId}).populate("userId","name email");

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    res.status(200).json({message : "profile fetch successfully" , profile});
  }
  catch (error) {
    res.status(500).json({ message: "Failed to fetch profile", error: error.message,});
  }
};
exports.updateUserProfile = async (req,res) => {
  try {
    const userId = req.user.id;

    const updateData = { ...req.body };

    if (req.file) {
      updateData.profileImage = `/Img/${req.file.filename}`;
    }

    const profile = await UserProfile.findOneAndUpdate(
      { userId },
      updateData,
      { new: true, runValidators: true }
    );

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    res.status(200).json({message : "Profile updated successfully" , profile});
  }
  catch (error) {
    res.status(500).json({message: "Failed to update profile",error: error.message,});
  }
};
exports.deleteUserProfile = async (req,res) => {
  try {
    const { name } = req.params;

    const profile = await UserProfile.findOneAndDelete({name : name});

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    res.status(200).json({message : "Profile deleted successfully" , profile});
  }
  catch (error) {
    res.status(500).json({message: "Failed to deleted profile",error: error.message,});
  }
};