import { User, Mail, Phone, Calendar, Edit, CheckCircle } from "lucide-react";
import { useRef } from "react";
import { useState } from "react";
import axios from "axios";
import { AiOutlineCamera } from "react-icons/ai";

const UserProfile = () => {
    const fileInputRef = useRef(null);
    const [image, setImage] = useState(() => {
        return localStorage.getItem("profileImage") || "/images/user-dummy.png";
    });
    const user = JSON.parse(localStorage.getItem("user"));
    console.log("user:", user)
    const handleEditClick = () => {
        fileInputRef.current.click(); // Trigger file input click
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("image", file);
        formData.append("id", user.id);

        try {
            const response = await axios.post("http://localhost:1111/cloudinary/upload", formData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });

            if (response.status === 200) {
                const newImage = response.data.user.image;
                setImage(newImage); // Update state
                localStorage.setItem("profileImage", newImage); // Store in localStorage
            } else {
                alert("Failed to upload image.");
            }
        } catch (error) {
            console.error("Error uploading image:", error);
            alert("Something went wrong. Please try again.");
        }
    };


    return (
        <div className="mx-auto p-6">
            <h2 className="text-2xl font-semibold mb-4">Account Information</h2>
            <div className="bg-gray-100 p-6 rounded-lg">

                <div className="flex items-center mb-6 relative">
                    {/* Profile Image Container */}
                    <div className="w-24 h-24 rounded-full border-4 border-gray-300 overflow-hidden flex items-center justify-center">
                        <img
                            src={image}
                            alt="Profile"
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <button
                        className="absolute bottom-3 left-[70px]  bg-gray-700 text-white p-2 rounded-full shadow-lg hover:bg-gray-800 transition"
                        onClick={handleEditClick}
                    >
                        <AiOutlineCamera className="h-4 w-4" />
                    </button>

                    <input
                        type="file"
                        ref={fileInputRef}
                        accept="image/*"
                        className="hidden"
                        onChange={handleFileChange}
                    />
                </div>


                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm text-gray-600">First Name</label>
                        <div className="relative">
                            <input
                                type="text"
                                className="w-full p-2 border rounded-lg"
                            />
                            <User className="absolute right-3 top-3 h-4 w-4 text-gray-500" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm text-gray-600">Last Name</label>
                        <div className="relative">
                            <input
                                type="text"
                                className="w-full p-2 border rounded-lg"
                            />
                            <Edit className="absolute right-3 top-3 h-4 w-4 text-gray-500 cursor-pointer" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm text-gray-600">Email</label>
                        <div className="relative">
                            <input
                                type="email"
                                className="w-full p-2 border rounded-lg"
                            />
                            <Mail className="absolute right-3 top-3 h-4 w-4 text-gray-500" />
                            <CheckCircle className="absolute right-8 top-3 h-4 w-4 text-green-500" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm text-gray-600">Phone Number</label>
                        <div className="relative">
                            <input
                                type="text"
                                className="w-full p-2 border rounded-lg"
                            />
                            <Phone className="absolute right-3 top-3 h-4 w-4 text-gray-500" />
                            <CheckCircle className="absolute right-8 top-3 h-4 w-4 text-green-500" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm text-gray-600">Date of Birth</label>
                        <div className="relative">
                            <input
                                type="text"
                                className="w-full p-2 border rounded-lg"
                            />
                            <Calendar className="absolute right-3 top-3 h-4 w-4 text-gray-500" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm text-gray-600">Country</label>
                        <input
                            type="text"
                            className="w-full p-2 border rounded-lg"
                        />
                    </div>
                </div>

                <div className="mt-4">
                    <label className="block text-sm text-gray-600 flex items-center justify-between">
                        Bio
                        <Edit className="h-4 w-4 text-gray-500 cursor-pointer" />
                    </label>
                    <textarea
                        className="w-full p-2 border rounded-lg"
                        rows="3"
                    />
                </div>
            </div>
        </div>
    );
};

export default UserProfile;
