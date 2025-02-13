"use client"
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";

export default function MaintenanceTable() {
    const mockData = [
        { maintenance_id: 1, issue_report: "damaged gear", date: "2025-02-13", status: "Fixed", automation: "CNC Machine 1" },
        { maintenance_id: 2, issue_report: "sensor error", date: "2025-02-10", status: "In Progress", automation: "Robot Arm 3" },
        { maintenance_id: 3, issue_report: "power failure", date: "2025-02-08", status: "Pending", automation: "3D Printer 2" },
        { maintenance_id: 4, issue_report: "loose belt", date: "2025-02-05", status: "Fixed", automation: "Conveyor Belt 4" },
        { maintenance_id: 5, issue_report: "coolant leak", date: "2025-02-01", status: "Pending", automation: "CNC Machine 2" },
    ];
    const [search, setSearch] = useState("");

    // Filtered data based on search input
    const filteredData = mockData.filter(
        (item) =>
        item.issue_report.toLowerCase().includes(search.toLowerCase()) ||
        item.automation.toLowerCase().includes(search.toLowerCase())
    );

    return (
    <>
        <div className="font-bold text-2xl mb-5">Maintenance Tracker</div>
        <Input
            placeholder="Search by issue or automation..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full max-w-md mb-5"
        />
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Issue</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Automation</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {filteredData.map((item) => (
                <TableRow key={item.maintenance_id}>
                    <TableCell>{item.maintenance_id}</TableCell>
                    <TableCell>{item.issue_report}</TableCell>
                    <TableCell>{item.date}</TableCell>
                    <TableCell>{item.status}</TableCell>
                    <TableCell>{item.automation}</TableCell>
                </TableRow>
                ))}
            </TableBody>
        </Table>
    </>
    );
}


// "use client";

// import { useState } from "react";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import {
//   Table,
//   TableHeader,
//   TableRow,
//   TableHead,
//   TableBody,
//   TableCell,
// } from "@/components/ui/table";

// const mockData = [
//   { maintenance_id: 1, issue_report: "damaged gear", date: "2025-02-13", status: "Fixed", automation: "CNC Machine 1" },
//   { maintenance_id: 2, issue_report: "sensor error", date: "2025-02-10", status: "In Progress", automation: "Robot Arm 3" },
//   { maintenance_id: 3, issue_report: "power failure", date: "2025-02-08", status: "Pending", automation: "3D Printer 2" },
//   { maintenance_id: 4, issue_report: "loose belt", date: "2025-02-05", status: "Fixed", automation: "Conveyor Belt 4" },
//   { maintenance_id: 5, issue_report: "coolant leak", date: "2025-02-01", status: "Pending", automation: "CNC Machine 2" },
// ];

// export default function MaintenanceTable() {
//   const [search, setSearch] = useState("");
//   const [currentPage, setCurrentPage] = useState(1);
//   const rowsPerPage = 3;

//   // Filtered data based on search input
//   const filteredData = mockData.filter(
//     (item) =>
//       item.issue_report.toLowerCase().includes(search.toLowerCase()) ||
//       item.automation.toLowerCase().includes(search.toLowerCase())
//   );

//   // Paginate the data
//   const startIndex = (currentPage - 1) * rowsPerPage;
//   const paginatedData = filteredData.slice(startIndex, startIndex + rowsPerPage);

//   return (
//     <div className="space-y-4">
//       {/* Search Bar */}
//       <Input
//         placeholder="Search by issue or automation..."
//         value={search}
//         onChange={(e) => setSearch(e.target.value)}
//         className="w-full max-w-md"
//       />

//       {/* Table */}
//       <Table>
//         <TableHeader>
//           <TableRow>
//             <TableHead>ID</TableHead>
//             <TableHead>Issue</TableHead>
//             <TableHead>Date</TableHead>
//             <TableHead>Status</TableHead>
//             <TableHead>Automation</TableHead>
//           </TableRow>
//         </TableHeader>
//         <TableBody>
//           {paginatedData.length > 0 ? (
//             paginatedData.map((item) => (
//               <TableRow key={item.maintenance_id}>
//                 <TableCell>{item.maintenance_id}</TableCell>
//                 <TableCell>{item.issue_report}</TableCell>
//                 <TableCell>{item.date}</TableCell>
//                 <TableCell>{item.status}</TableCell>
//                 <TableCell>{item.automation}</TableCell>
//               </TableRow>
//             ))
//           ) : (
//             <TableRow>
//               <TableCell colSpan={5} className="text-center text-gray-500">
//                 No results found.
//               </TableCell>
//             </TableRow>
//           )}
//         </TableBody>
//       </Table>

//       {/* Pagination */}
//       <div className="flex justify-between items-center">
//         <Button
//           variant="outline"
//           disabled={currentPage === 1}
//           onClick={() => setCurrentPage(currentPage - 1)}
//         >
//           Previous
//         </Button>
//         <span>
//           Page {currentPage} of {Math.ceil(filteredData.length / rowsPerPage)}
//         </span>
//         <Button
//           variant="outline"
//           disabled={startIndex + rowsPerPage >= filteredData.length}
//           onClick={() => setCurrentPage(currentPage + 1)}
//         >
//           Next
//         </Button>
//       </div>
//     </div>
//   );
// }