import React, { useState, useRef, useEffect } from "react";
import { User, Mail, Phone, Calendar, Edit, CheckCircle, Globe, Camera, X, Save, Loader2, MapPin, UserCircle } from "lucide-react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { login } from "@/store/slices/authSlice";
import { toast } from "react-toastify";

const UserProfile = () => {
    const dispatch = useDispatch();
    const [isEditing, setIsEditing] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef(null);
    const [image, setImage] = useState(() => {
        return localStorage.getItem("profileImage") || "/images/dummy-img.jpg";
    });

    const user = useSelector((state) => state.auth.user);

    const [formData, setFormData] = useState({
        firstName: user?.firstName || "",
        lastName: user?.lastName || "",
        email: user?.email || "",
        phoneNo: user?.phoneNo || "",
        dob: user?.dob || "",
        country: user?.country || "",
        bio: user?.bio || ""
    });

    // Sync formData when user data changes
    useEffect(() => {
        if (user) {
            setFormData({
                firstName: user.firstName || "",
                lastName: user.lastName || "",
                email: user.email || "",
                phoneNo: user.phoneNo || "",
                dob: user.dob || "",
                country: user.country || "",
                bio: user.bio || ""
            });
            if (user.image) {
                setImage(user.image);
            }
        }
    }, [user]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleEditClick = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Check if user is logged in with valid ID
        if (!user || !user.id) {
            toast.error("User not found. Please login again.");
            return;
        }

        // Validate file type
        if (!file.type.startsWith('image/')) {
            toast.error("Please select a valid image file");
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            toast.error("Image size should be less than 5MB");
            return;
        }

        // Show preview immediately
        const reader = new FileReader();
        reader.onloadend = () => {
            setImage(reader.result);
        };
        reader.readAsDataURL(file);

        const imageFormData = new FormData();
        imageFormData.append("image", file);
        imageFormData.append("id", user.id.toString());

        try {
            setIsUploading(true);
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/cloudinary/upload`, imageFormData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                    "Content-Type": "multipart/form-data",
                },
            });

            if (response.status === 200 && response.data?.success) {
                const newImage = response.data.imageUrl || response.data.user?.image;
                const updatedUser = response.data.user;
                
                if (updatedUser && newImage) {
                    setImage(newImage);
                    dispatch(login(updatedUser));
                    localStorage.setItem("profileImage", newImage);
                    localStorage.setItem("user", JSON.stringify(updatedUser));
                    toast.success("Profile image updated successfully!");
                } else {
                    toast.error("Failed to update profile image.");
                    setImage(user?.image || "/images/dummy-img.jpg");
                }
            } else {
                toast.error("Failed to upload image.");
                setImage(user?.image || "/images/dummy-img.jpg");
            }
        } catch (error) {
            console.error("Error uploading image:", error);
            toast.error(error.response?.data?.message || "Failed to upload image");
            setImage(user?.image || "/images/dummy-img.jpg");
        } finally {
            setIsUploading(false);
        }
    };

    const handleSubmit = async (id) => {
        try {
            const response = await axios.put(`${import.meta.env.VITE_API_URL}/api/user/update/${id}`, formData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                    "Content-Type": "application/json",
                },
            });
            if (response.status === 200) {
                const updatedUser = response.data.user;
                dispatch(login(updatedUser));
                localStorage.setItem("user", JSON.stringify(updatedUser));
                setIsEditing(false);
                toast.success("Profile updated successfully!");
            }
            else {
                toast.error("Profile update failed!");
            }
        } catch (error) {
            console.error("Error while updating profile:", error);
            const errorMessage = error.response?.data?.message || error.message || "Error while updating profile. Please try again.";
            toast.error(errorMessage);
        }
    };

    const toggleEditMode = () => {
        setIsEditing(!isEditing);

        if (isEditing) {
            setFormData({
                firstName: user?.firstName || "",
                lastName: user?.lastName || "",
                email: user?.email || "",
                phoneNo: user?.phoneNo || "",
                dob: user?.dob || "",
                country: user?.country || "",
                bio: user?.bio || ""
            });
        }
    };

    // Show loading if user data is not yet loaded
    if (!user) {
        return (
            <div className="w-full min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
                    <p className="text-gray-600">Loading profile...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full min-h-screen bg-gray-50 p-4 md:p-6">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                    <div>
                        <h1 className="text-xl md:text-2xl font-bold text-gray-800">Profile Settings</h1>
                        <p className="text-xs text-gray-500 mt-0.5">Manage your account information</p>
                    </div>
                    <button
                        onClick={toggleEditMode}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all shadow-sm hover:shadow-md ${
                            isEditing
                                ? "bg-red-500 text-white hover:bg-red-600"
                                : "bg-blue-600 text-white hover:bg-blue-700"
                        }`}
                    >
                        {isEditing ? (
                            <>
                                <X size={16} />
                                <span className="text-sm">Cancel</span>
                            </>
                        ) : (
                            <>
                                <Edit size={16} />
                                <span className="text-sm">Edit</span>
                            </>
                        )}
                    </button>
                </div>

                {/* Profile Card */}
                <div className="bg-white rounded-xl shadow-md overflow-hidden">
                    {/* Banner Section */}
                    <div className="h-24 bg-gradient-to-r from-red-500 via-red-600 to-red-500 relative">
                        <div className="absolute inset-0 bg-black opacity-10"></div>
                        {/* Profile Image Container */}
                        <div className="absolute -bottom-10 left-4 md:left-6">
                            <div className="relative">
                                <div className="w-20 h-20 rounded-full border-4 border-white bg-white overflow-hidden shadow-lg">
                                    <img
                                        src={user?.image || image}
                                        alt="Profile"
                                        className="w-full h-full object-cover"
                                    />
                                    {isUploading && (
                                        <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
                                            <Loader2 className="w-6 h-6 text-white animate-spin" />
                                        </div>
                                    )}
                                </div>

                                <button
                                    className="absolute bottom-0 right-0 bg-blue-600 text-white p-1.5 rounded-full hover:bg-blue-700 transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                                    onClick={handleEditClick}
                                    disabled={isUploading}
                                    title="Change profile picture"
                                >
                                    <Camera size={12} />
                                </button>

                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleFileChange}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Content Section */}
                    <div className="pt-14 px-4 md:px-6 pb-6">
                        {/* User Name Display */}
                        <div className="mb-6">
                            <h2 className="text-xl font-bold text-gray-800">
                                {user?.firstName} {user?.lastName}
                            </h2>
                            <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1">
                                <Mail size={12} />
                                {user?.email}
                            </p>
                        </div>

                        {/* Form Fields */}
                        <div className="space-y-5">
                            {/* Personal Information Section */}
                            <div>
                                <h3 className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                                    <UserCircle size={16} className="text-blue-600" />
                                    Personal Information
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* First Name */}
                                    <div className="relative">
                                        <label className="block text-xs font-medium text-gray-700 mb-1.5">
                                            First Name
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                name="firstName"
                                                value={isEditing ? formData.firstName : user?.firstName || ""}
                                                onChange={handleInputChange}
                                                disabled={!isEditing}
                                                placeholder="Enter first name"
                                                className={`w-full pl-9 pr-3 py-2 text-sm border rounded-lg transition-all ${
                                                    isEditing
                                                        ? "bg-white border-blue-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-200"
                                                        : "bg-gray-50 border-gray-200 cursor-not-allowed"
                                                } outline-none`}
                                            />
                                            <User className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                                        </div>
                                    </div>

                                    {/* Last Name */}
                                    <div className="relative">
                                        <label className="block text-xs font-medium text-gray-700 mb-1.5">
                                            Last Name
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                name="lastName"
                                                value={isEditing ? formData.lastName : user?.lastName || ""}
                                                onChange={handleInputChange}
                                                disabled={!isEditing}
                                                placeholder="Enter last name"
                                                className={`w-full pl-9 pr-3 py-2 text-sm border rounded-lg transition-all ${
                                                    isEditing
                                                        ? "bg-white border-blue-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-200"
                                                        : "bg-gray-50 border-gray-200 cursor-not-allowed"
                                                } outline-none`}
                                            />
                                            <User className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                                        </div>
                                    </div>

                                    {/* Date of Birth */}
                                    <div className="relative">
                                        <label className="block text-xs font-medium text-gray-700 mb-1.5">
                                            Date of Birth
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="date"
                                                name="dob"
                                                value={isEditing ? formData.dob : user?.dob || ""}
                                                onChange={handleInputChange}
                                                disabled={!isEditing}
                                                className={`w-full pl-9 pr-3 py-2 text-sm border rounded-lg transition-all ${
                                                    isEditing
                                                        ? "bg-white border-blue-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-200"
                                                        : "bg-gray-50 border-gray-200 cursor-not-allowed"
                                                } outline-none`}
                                            />
                                            <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                                        </div>
                                    </div>

                                    {/* Country */}
                                    <div className="relative">
                                        <label className="block text-xs font-medium text-gray-700 mb-1.5">
                                            Country
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                name="country"
                                                value={isEditing ? formData.country : user?.country || ""}
                                                onChange={handleInputChange}
                                                disabled={!isEditing}
                                                placeholder="Enter country"
                                                className={`w-full pl-9 pr-3 py-2 text-sm border rounded-lg transition-all ${
                                                    isEditing
                                                        ? "bg-white border-blue-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-200"
                                                        : "bg-gray-50 border-gray-200 cursor-not-allowed"
                                                } outline-none`}
                                            />
                                            <Globe className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Contact Information Section */}
                            <div>
                                <h3 className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                                    <Mail size={16} className="text-blue-600" />
                                    Contact Information
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* Email */}
                                    <div className="relative">
                                        <label className="block text-xs font-medium text-gray-700 mb-1.5">
                                            Email Address
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="email"
                                                name="email"
                                                value={isEditing ? formData.email : user?.email || ""}
                                                onChange={handleInputChange}
                                                disabled={!isEditing}
                                                placeholder="Enter email"
                                                className={`w-full pl-9 pr-9 py-2 text-sm border rounded-lg transition-all ${
                                                    isEditing
                                                        ? "bg-white border-blue-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-200"
                                                        : "bg-gray-50 border-gray-200 cursor-not-allowed"
                                                } outline-none`}
                                            />
                                            <Mail className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                                            {user?.email && (
                                                <CheckCircle className="absolute right-3 top-2.5 h-4 w-4 text-green-500" />
                                            )}
                                        </div>
                                    </div>

                                    {/* Phone */}
                                    <div className="relative">
                                        <label className="block text-xs font-medium text-gray-700 mb-1.5">
                                            Phone Number
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="tel"
                                                name="phoneNo"
                                                value={isEditing ? formData.phoneNo : user?.phoneNo || ""}
                                                onChange={handleInputChange}
                                                disabled={!isEditing}
                                                placeholder="Enter phone"
                                                className={`w-full pl-9 pr-9 py-2 text-sm border rounded-lg transition-all ${
                                                    isEditing
                                                        ? "bg-white border-blue-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-200"
                                                        : "bg-gray-50 border-gray-200 cursor-not-allowed"
                                                } outline-none`}
                                            />
                                            <Phone className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                                            {user?.phoneNo && (
                                                <CheckCircle className="absolute right-3 top-2.5 h-4 w-4 text-green-500" />
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Bio Section */}
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1.5">
                                    Bio
                                </label>
                                <textarea
                                    name="bio"
                                    value={isEditing ? formData.bio : user?.bio || ""}
                                    onChange={handleInputChange}
                                    disabled={!isEditing}
                                    placeholder="Tell us about yourself..."
                                    className={`w-full px-3 py-2 text-sm border rounded-lg transition-all resize-none ${
                                        isEditing
                                            ? "bg-white border-blue-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-200"
                                            : "bg-gray-50 border-gray-200 cursor-not-allowed"
                                    } outline-none`}
                                    rows="3"
                                />
                            </div>

                            {/* Save Button */}
                            {isEditing && (
                                <div className="flex justify-end pt-2">
                                    <button
                                        onClick={() => handleSubmit(user?.id)}
                                        className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-2 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-sm hover:shadow-md font-medium text-sm"
                                    >
                                        <Save size={16} />
                                        Save Changes
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;