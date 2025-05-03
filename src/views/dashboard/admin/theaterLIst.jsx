import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaEdit, FaTrash } from "react-icons/fa";
import SearchBar from '@/components/searchbar';
import AddTheaterForm from '@/components/addTheaterForm';
import { Switch } from "@/components/ui/switch";
import ConfirmationCard from '@/components/confirmationCard';
//theather list

import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { BookMarked } from 'lucide-react';

import {
    Dialog,
    DialogContent,
    DialogTrigger,
} from "@/components/ui/dialog";

const TheaterList = () => {
    const [theaters, setTheaters] = useState([]);
    const [showConfirm, setShowConfirm] = useState(false);
    const [selectedTheater, setSelectedTheater] = useState(null);

    // Fetch theaters from API
    const fetchTheaters = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                console.error("No token found, user might not be logged in.");
                return;
            }

            const response = await axios.get("http://localhost:1111/api/theater/all", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setTheaters(response.data);
        } catch (error) {
            console.error("Error fetching theaters:", error.response ? error.response.data : error.message);
        }
    };

    useEffect(() => {
        fetchTheaters();
    }, []);

    // Handle delete confirmation
    const confirmDelete = (theater) => {
        setSelectedTheater(theater);
        setShowConfirm(true);
    };

    // Handle theater deletion
    const handleDelete = async () => {
        if (!selectedTheater) return;

        try {
            const response = await axios.delete(`http://localhost:1111/api/theater/delete/${selectedTheater.id}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });

            if (response.status === 200) {
                setShowConfirm(false);
                setSelectedTheater(null);
                fetchTheaters(); // Refresh list
            } else {
                alert("Failed to delete theater.");
            }
        } catch (error) {
            console.error("Error deleting theater:", error);
        }
    };

    // Handle status toggle
    const handleStatusToggle = (id, isActive) => {
        setTheaters((prevTheaters) =>
            prevTheaters.map((t) =>
                t.id === id ? { ...t, status: isActive ? "Active" : "Inactive" } : t
            )
        );
    };

    return (
        <div>
            <div className='pb-10'>
                <div className='mt-8 ml-5'>
                    <h1 className='text-3xl font-semibold'>Theater<span className='text-red-500'>List</span></h1>
                </div>
                <Dialog>
                    <DialogTrigger asChild>
                        <button className="p-3 text-sm pr-4 bg-green-600 text-white rounded-xl hover:bg-green-500 transition-all absolute top-28 right-12 flex items-center gap-2 z-10">
                            <BookMarked size={18} />
                            Add Theater
                        </button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px] mt-10">
                        <AddTheaterForm />
                    </DialogContent>
                </Dialog>
            </div>
            <div className='pt-10 flex justify-center items-center'>
                <SearchBar />
            </div>

            {/* Confirmation Card */}
            {showConfirm && (
                <ConfirmationCard
                    title="Delete Theater"
                    message={`Are you sure you want to delete ${selectedTheater?.name}?`}
                    onConfirm={handleDelete}
                    onCancel={() => setShowConfirm(false)}
                />
            )}

            <div className="pl-10">
                <Table>
                    <TableCaption>A list of your recent theaters.</TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Id</TableHead>
                            <TableHead>Theater Name</TableHead>
                            <TableHead>Location</TableHead>
                            <TableHead>Screens</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {theaters.map((theater) => (
                            <TableRow key={theater.id}>
                                <TableCell className="font-medium">{theater.id}</TableCell>
                                <TableCell>{theater.name}</TableCell>
                                <TableCell>{theater.location}</TableCell>
                                <TableCell>{theater.screens}</TableCell>
                                <TableCell className="flex items-center gap-2">
                                    <Switch
                                        checked={theater?.status === 'Active'}
                                        onCheckedChange={(checked) => handleStatusToggle(theater.id, checked)}
                                    />
                                </TableCell>
                                <TableCell>
                                    <div className="flex space-x-2">
                                        <button className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                                            <FaEdit />
                                        </button>
                                        <button onClick={() => confirmDelete(theater)} className="p-2 bg-red-500 text-white rounded hover:bg-red-600">
                                            <FaTrash />
                                        </button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};

export default TheaterList;
