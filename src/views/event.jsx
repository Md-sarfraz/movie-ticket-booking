import React, { useState, useEffect } from 'react';
import Banner from '../components/banner';
import { Calendar, Search, Filter, MapPin } from 'lucide-react';
import EventSlider from '@/components/eventSlider';
import PaginationDesign from '@/components/paginationDesign';
import { useNavigate } from 'react-router-dom';
import { getAllEvents } from '@/services/event-service';

const Event = () => {
    const [events, setEvents] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedLocation, setSelectedLocation] = useState('All Locations');
    
    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 9; // Show 9 events per page (3x3 grid)

    const fetchEvents = async () => {
        try {
            const data = await getAllEvents();
            setEvents(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Error fetching events:", error);
        }
    };

    useEffect(() => {
        fetchEvents();
    }, []);
    
    const navigate = useNavigate();
    const handleClick = (event) => {
        navigate(`/eventDetails/${event.id}`, {
            state: {
                data: event
            }
        })
    }

    // Categories for filtering
    const categories = ["All", "Music", "Sports", "Theater", "Comedy", "Food", "Arts"];
    const [selectedCategory, setSelectedCategory] = useState("All");

    const availableLocations = [
        'All Locations',
        ...Array.from(new Set(events.map((event) => event.location).filter(Boolean))),
    ];

    const filteredEvents = events.filter((event) => {
        const categoryMatch =
            selectedCategory === 'All' ||
            (event.category || '').toLowerCase() === selectedCategory.toLowerCase();

        const locationMatch =
            selectedLocation === 'All Locations' ||
            (event.location || '') === selectedLocation;

        const query = searchQuery.trim().toLowerCase();
        const textMatch =
            !query ||
            [event.title, event.category, event.location, event.description]
                .filter(Boolean)
                .some((value) => value.toLowerCase().includes(query));

        return categoryMatch && locationMatch && textMatch;
    });

    // Pagination logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentEvents = filteredEvents.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredEvents.length / itemsPerPage);

    const handlePageChange = (page) => {
        setCurrentPage(page);
        // Scroll to events section
        window.scrollTo({ top: 600, behavior: 'smooth' });
    };



    // Featured events (a subset of filtered events)
    const featuredEvents = filteredEvents.slice(0, 6);

    return (
        <div className="w-full min-h-screen bg-gray-50">
            {/* Banner Component */}
            <Banner
                heading="Events"
                paragraph="Welcome to our Events Page – your go-to platform for discovering, booking, and enjoying the best upcoming events near you!"
                compactMobile
            />

            {/* Simplified Search and Filter Section */}
            <div className="border-b border-gray-200 bg-white shadow-sm">
                <div className="max-w-6xl mx-auto py-4 px-3 sm:px-4">
                    {/* Simple Search Bar Row */}
                    <div className="flex flex-col md:flex-row gap-3 md:gap-4 items-stretch md:items-center">
                        {/* Search Bar */}
                        <div className="relative flex-grow w-full">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="text"
                                placeholder="Search for events, artists, venues..."
                                value={searchQuery}
                                onChange={(e) => {
                                    setSearchQuery(e.target.value);
                                    setCurrentPage(1);
                                }}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                        </div>

                        {/* Location Dropdown */}
                        <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2 w-full md:w-auto md:min-w-36">
                            <MapPin size={16} className="text-gray-500 mr-2" />
                            <select
                                className="bg-transparent focus:outline-none text-gray-700 w-full"
                                value={selectedLocation}
                                onChange={(e) => {
                                    setSelectedLocation(e.target.value);
                                    setCurrentPage(1);
                                }}
                            >
                                {availableLocations.map((location) => (
                                    <option key={location} value={location}>{location}</option>
                                ))}
                            </select>
                        </div>

                        {/* Date Dropdown */}
                        <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2 w-full md:w-auto md:min-w-36">
                            <Calendar size={16} className="text-gray-500 mr-2" />
                            <select className="bg-transparent focus:outline-none text-gray-700 w-full">
                                <option>Any Date</option>
                                <option>Today</option>
                                <option>This Weekend</option>
                                <option>This Week</option>
                            </select>
                        </div>

                        {/* Search Button */}
                        <button className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors w-full md:w-auto">
                            Search
                        </button>
                    </div>
                </div>
            </div>

            {/* Category Pills - Simple Row */}
            <div className="bg-white border-b border-gray-200 sticky top-16 z-10">
                <div className="max-w-6xl mx-auto px-3 sm:px-4 py-3 overflow-x-auto whitespace-nowrap flex gap-2">
                    {categories.map(category => (
                        <button
                            key={category}
                            className={`px-4 py-1 rounded-full text-sm font-medium whitespace-nowrap ${selectedCategory === category
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                            onClick={() => setSelectedCategory(category)}
                        >
                            {category}
                        </button>
                    ))}
                </div>
            </div>

            {/* Content Container */}
            <div className="max-w-6xl mx-auto py-6 sm:py-8 px-3 sm:px-4">
                {/* Featured Events Section */}
                <section className="mb-10 sm:mb-12">
                    <div className="flex justify-between items-center mb-5 sm:mb-6 gap-3">
                        <h2 className="text-xl sm:text-2xl font-semibold">Featured Events</h2>
                        <button className="text-blue-600 hover:underline text-sm font-medium shrink-0">View All</button>
                    </div>
                    <EventSlider items={featuredEvents} />
                </section>

                {/* All Events Section */}
                <section className="mb-12">
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-5 sm:mb-6 gap-3">
                        <h2 className="text-xl sm:text-2xl font-semibold">All Events</h2>
                        <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg border border-gray-200 w-full sm:w-auto">
                            <Filter size={16} className="text-gray-500" />
                            <select className="bg-transparent focus:outline-none text-gray-700 text-sm w-full sm:w-auto">
                                <option>Sort By: Date</option>
                                <option>Sort By: Price (Low to High)</option>
                                <option>Sort By: Price (High to Low)</option>
                                <option>Sort By: Popularity</option>
                            </select>
                        </div>
                    </div>

                    {/* Events Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                        {Array.isArray(currentEvents) && currentEvents.length > 0 ? (
                            currentEvents.map((event) => (
                                <div
                                    key={event.id}
                                    className="bg-white rounded-lg shadow-md overflow-hidden transition-transform sm:hover:scale-[1.02] h-full flex flex-col"
                                >
                                    <img
                                        src={event.imageUrl}
                                        alt={event.title}
                                        className="w-full h-44 sm:h-48 object-cover"
                                    />
                                    <div className="p-4 flex flex-col h-full">
                                        <span className="inline-block px-2 py-1 text-xs font-semibold bg-blue-100 text-blue-800 rounded-full mb-2">
                                            {event.category}
                                        </span>
                                        <h3 className="text-lg font-semibold mb-1">{event.title}</h3>
                                        <div className="flex items-center text-gray-500 text-sm mb-1">
                                            <Calendar size={14} className="mr-1" />
                                            {event.date}
                                        </div>
                                        <div className="flex items-center text-gray-500 text-sm mb-3">
                                            <MapPin size={14} className="mr-1" />
                                            {event.location}
                                        </div>
                                        <div className="flex justify-between items-center mt-auto gap-2">
                                            <span className="font-medium text-gray-900">
                                                {event.price}
                                            </span>
                                            <button className="px-4 py-1.5 bg-red-600 text-white rounded-full text-sm font-medium hover:bg-red-700 transition-colors shrink-0"
                                            onClick={() => handleClick(event)}
                                            >
                                                Book Now
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-600 col-span-full">No events found for the selected filters.</p>
                        )}
                    </div>
                </section>

                {/* Pagination - only show if there are events and multiple pages */}
                {filteredEvents.length > 0 && totalPages > 1 && (
                    <PaginationDesign 
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                    />
                )}
            </div>
        </div>
    );
};

export default Event;