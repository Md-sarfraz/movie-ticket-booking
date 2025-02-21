import React from 'react'

import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Theater } from 'lucide-react';

const theaters = [
    { id: 1, name: "PVR Cinemas", location: "Mumbai", totalScreens: 5 },
    { id: 2, name: "INOX Multiplex", location: "Delhi", totalScreens: 4 },
    { id: 3, name: "Cinepolis", location: "Bangalore", totalScreens: 6 },
];

const TheaterList = () => {
    return (
        <div>
            <Table>
                <TableCaption>A list of your recent invoices.</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead className="">#</TableHead>
                        <TableHead>Theater Name</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead className="">Screens</TableHead>
                        <TableHead className="">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                {
                    theaters.map((theater, index) => (
                        <TableBody>
                            <TableRow key={theater.id}>
                                <TableCell className="font-medium">{index + 1}</TableCell>
                                <TableCell>{theater.name}</TableCell>
                                <TableCell>{theater.location}</TableCell>
                                <TableCell className="">{theater.totalScreens}</TableCell>
                                <TableCell className="">

                                    <button className="mr-2 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">
                                        Edit
                                    </button>
                                    <button className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600">
                                        Delete
                                    </button>
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    ))
                }

            </Table>

        </div>
    )
}

export default TheaterList
