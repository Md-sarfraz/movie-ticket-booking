import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { myAxios } from '../../../services/helper';
import { FaEdit, FaTrash } from "react-icons/fa";
import SearchBar from '@/components/searchbar';
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
import { Plus } from 'lucide-react';

const TheaterList = () => {
    const navigate = useNavigate();
    const [theaters, setTheaters] = useState([]);
    const [showConfirm, setShowConfirm] = useState(false);
    const [selectedTheater, setSelectedTheater] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const theatersPerPage = 10;

    // Fetch theaters from API
    const fetchTheaters = async () => {
        try {
            const response = await myAxios.get("/theater/all");
            setTheaters(response.data.data); // Extract theaters from ApiResponse wrapper
        } catch (error) {
            console.error("Error fetching theaters:", error.response ? error.response.data : error.message);
        }
    };

    useEffect(() => {
        fetchTheaters();
    }, []);

    // Filter theaters based on search term
    const filteredTheaters = theaters.filter(theater =>
        theater.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        theater.location?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Pagination calculations
    const indexOfLastTheater = currentPage * theatersPerPage;
    const indexOfFirstTheater = indexOfLastTheater - theatersPerPage;
    const currentTheaters = filteredTheaters.slice(indexOfFirstTheater, indexOfLastTheater);
    const totalPages = Math.ceil(filteredTheaters.length / theatersPerPage);

    // Handle page change
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    // Handle delete confirmation
    const confirmDelete = (theater) => {
        setSelectedTheater(theater);
        setShowConfirm(true);
    };

    // Handle theater deletion
    const handleDelete = async () => {
        if (!selectedTheater) return;

        try {
            const response = await myAxios.delete(`/theater/delete/${selectedTheater.id}`);

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
        <div className='w-full min-h-screen bg-gray-50 p-3 md:p-6'>
            {/* Header Section */}
            <div className='bg-white rounded-xl shadow-sm p-4 md:p-6 mb-6'>
                <div className='flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6'>
                    <div>
                        <h1 className='text-2xl md:text-3xl font-bold text-gray-800'>
                            Theater<span className='text-red-500'>List</span>
                        </h1>
                        <p className='text-sm text-gray-500 mt-1'>
                            Manage and view all theaters ({filteredTheaters.length} {filteredTheaters.length === 1 ? 'theater' : 'theaters'})
                        </p>
                    </div>
                    <button 
                        onClick={() => navigate('/adminDashboard/addTheater')}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all flex items-center gap-2 shadow-md hover:shadow-lg w-fit"
                    >
                        <Plus size={18} />
                        Add New Theater
                    </button>
                </div>

                {/* Search Bar */}
                <div className='w-full'>
                    <SearchBar 
                        placeholder="Search by theater name or location..."
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setCurrentPage(1);
                        }}
                    />
                </div>
            </div>

            {/* Confirmation Card */}
            {showConfirm && (
                <ConfirmationCard
                    title="Delete Theater"
                    message={`Are you sure you want to delete "${selectedTheater?.name}"?`}
                    onConfirm={handleDelete}
                    onCancel={() => setShowConfirm(false)}
                />
            )}

            {/* Theater Table Section */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <Table>
                    <TableCaption className="py-4 text-sm text-gray-500">
                        Showing {indexOfFirstTheater + 1} - {Math.min(indexOfLastTheater, filteredTheaters.length)} of {filteredTheaters.length} theaters
                    </TableCaption>
                    <TableHeader>
                        <TableRow className="bg-gray-50">
                            <TableHead className="font-semibold text-gray-700">ID</TableHead>
                            <TableHead className="font-semibold text-gray-700">Theater Name</TableHead>
                            <TableHead className="font-semibold text-gray-700">Location</TableHead>
                            <TableHead className="font-semibold text-gray-700">Screens</TableHead>
                            <TableHead className="font-semibold text-gray-700">Status</TableHead>
                            <TableHead className="font-semibold text-gray-700">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {currentTheaters.length > 0 ? (
                            currentTheaters.map((theater) => (
                            <TableRow key={theater.id} className="hover:bg-gray-50 transition-colors">
                                <TableCell className="font-medium text-gray-900">{theater.id}</TableCell>
                                <TableCell className="font-medium text-gray-800">{theater.name}</TableCell>
                                <TableCell className="text-gray-600">{theater.location}</TableCell>
                                <TableCell className="text-gray-600">{theater.screens}</TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <Switch
                                            checked={theater?.status === 'Active'}
                                            onCheckedChange={(checked) => handleStatusToggle(theater.id, checked)}
                                        />
                                        <span className={`text-sm font-medium ${theater?.status === 'Active' ? 'text-green-600' : 'text-gray-400'}`}>
                                            {theater?.status === 'Active' ? 'Active' : 'Inactive'}
                                        </span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex space-x-2">
                                        <button 
                                            className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors shadow-sm hover:shadow-md"
                                            title="Edit Theater"
                                        >
                                            <FaEdit />
                                        </button>
                                        <button 
                                            onClick={() => confirmDelete(theater)} 
                                            className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors shadow-sm hover:shadow-md"
                                            title="Delete Theater"
                                        >
                                            <FaTrash />
                                        </button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-12">
                                    <Plus size={48} className="mx-auto text-gray-300 mb-3" />
                                    <p className="text-gray-500 text-lg font-medium">
                                        {theaters.length === 0 ? 'No theaters available' : 'No theaters found matching your search'}
                                    </p>
                                    <p className="text-gray-400 text-sm mt-1">
                                        {theaters.length === 0 ? 'Add your first theater to get started' : 'Try adjusting your search criteria'}
                                    </p>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination Section */}
            {filteredTheaters.length > theatersPerPage && (
                <div className="bg-white rounded-xl shadow-sm p-6 mt-6">
                    <div className="flex items-center justify-center gap-2">
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-gray-100 transition-all font-medium"
                        >
                            Previous
                        </button>
                        
                        <div className="flex gap-2">
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                <button
                                    key={page}
                                    onClick={() => handlePageChange(page)}
                                    className={`w-11 h-11 rounded-lg transition-all font-medium ${
                                        currentPage === page
                                            ? 'bg-red-500 text-white shadow-md'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                                >
                                    {page}
                                </button>
                            ))}
                        </div>
                        
                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-gray-100 transition-all font-medium"
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TheaterList;
