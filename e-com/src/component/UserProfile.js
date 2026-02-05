import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

function UserProfile() {
  const [profile, setProfile] = useState({
    phone: "",
    gender: "",
    birthday: "",
    age: "",
    address1: "",
    address2: "",
    city: "",
    state: "",
    pincode: "",
  });

  const [imagePreview, setImagePreview] = useState(
    "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
  );
  const [imageFile, setImageFile] = useState(null);
  const [profileExists, setProfileExists] = useState(false);

  /* ======================
     AGE CALCULATION  
     ====================== */
  const calculateAge = (dob) => {
    const birthDate = new Date(dob);
    const today = new Date();

    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age;
  };

  /* ======================
     FETCH USER PROFILE (GET ONLY)
     ====================== */
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    fetch("https://ecommerce-app-1-igf3.onrender.com/user-profile", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data?.profile) {
          setProfileExists(true);

          setProfile({
            phone: data.profile.phone || "",
            gender: data.profile.gender || "",
            birthday: data.profile.birthday
              ? data.profile.birthday.split("T")[0]
              : "",
            age: data.profile.age || "",
            address1: data.profile.address1 || "",
            address2: data.profile.address2 || "",
            city: data.profile.city || "",
            state: data.profile.state || "",
            pincode: data.profile.pincode || ""
          });

          if (data.profile.profileImage) {
            setImagePreview(
              `https://ecommerce-app-1-igf3.onrender.com${data.profile.profileImage}`,
            );
          }
        }
      })
      .catch(console.log);
  }, []);

  /* ======================
     HANDLE INPUT CHANGE
     ====================== */
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "birthday") {
      setProfile({
        ...profile,
        birthday: value,
        age: calculateAge(value),
      });
    } else {
      setProfile({ ...profile, [name]: value });
    }
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  /* ======================
     SAVE PROFILE (POST / PUT)
     ====================== */
  const saveProfile = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Login required");
      return;
    }

    const formData = new FormData();
    Object.keys(profile).forEach((key) => formData.append(key, profile[key]));

    if (imageFile) {
      formData.append("image", imageFile);
    }

    const url = profileExists
      ? "https://ecommerce-app-1-igf3.onrender.com/update-user-profile"
      : "https://ecommerce-app-1-igf3.onrender.com/add-user-profile";

    const method = profileExists ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const data = await res.json();

    if (res.ok) {
      toast.success(data.message || "Profile saved successfully");
      setProfileExists(true);
    } else {
      alert(data.message || "Operation failed");
    }
  };

  return (
    <div className="py-10 px-4">
      <div className="max-w-5xl mx-auto bg-white rounded-xl shadow p-6">
        <h2 className="text-2xl font-bold mb-6">My Profile</h2>

        <div className="grid md:grid-cols-3 gap-8">
          {/* PROFILE IMAGE */}
          <div className="flex flex-col items-center">
            <label className="relative cursor-pointer group">
              <img
                src={imagePreview}
                alt="profile"
                className="w-36 h-36 rounded-full object-cover border-4 border-gray-200"
              />
              <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                <span className="text-white text-sm font-semibold">
                  Change Photo
                </span>
              </div>
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={handleImage}
              />
            </label>
            <p className="text-xs text-gray-500 mt-2">Click image to upload</p>
          </div>

          {/* PROFILE FORM */}
          <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Phone Number
              </label>
              <input
                placeholder="Enter phone number"
                name="phone"
                value={profile.phone}
                onChange={handleChange}
                className="w-full border p-2 rounded focus:ring-2 focus:ring-green-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Gender</label>
              <select
                name="gender"
                value={profile.gender}
                onChange={handleChange}
                className="w-full border p-2 rounded focus:ring-2 focus:ring-green-500 outline-none"
              >
                <option value="">Select Gender</option>
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Date of Birth
              </label>
              <input
                type="date"
                name="birthday"
                value={profile.birthday}
                onChange={handleChange}
                className="w-full border p-2 rounded focus:ring-2 focus:ring-green-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Age</label>
              <input
                name="age"
                value={profile.age}
                readOnly
                className="w-full border p-2 rounded bg-gray-100"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">
                Address Line 1
              </label>
              <input
                placeholder="House number & street name"
                name="address1"
                value={profile.address1}
                onChange={handleChange}
                className="w-full border p-2 rounded focus:ring-2 focus:ring-green-500 outline-none"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">
                Address Line 2
              </label>
              <input
                placeholder="Apartment, suite, etc."
                name="address2"
                value={profile.address2}
                onChange={handleChange}
                className="w-full border p-2 rounded focus:ring-2 focus:ring-green-500 outline-none"
              />
            </div>
            {/* City + State + Pincode in one line */}
            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">City</label>
                <input
                  placeholder="Enter City"
                  name="city"
                  value={profile.city}
                  onChange={handleChange}
                  className="w-full border p-2 rounded focus:ring-2 focus:ring-green-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">State</label>
                <input
                  placeholder="Enter State"
                  name="state"
                  value={profile.state}
                  onChange={handleChange}
                  className="w-full border p-2 rounded focus:ring-2 focus:ring-green-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Pincode
                </label>
                <input
                  placeholder="Enter 6-digit pincode"
                  name="pincode"
                  value={profile.pincode}
                  onChange={handleChange}
                  className="w-full border p-2 rounded focus:ring-2 focus:ring-green-500 outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 text-right">
          <button
            onClick={saveProfile}
            className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold"
          >
            {profileExists ? "Update Profile" : "Save Profile"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default UserProfile;
