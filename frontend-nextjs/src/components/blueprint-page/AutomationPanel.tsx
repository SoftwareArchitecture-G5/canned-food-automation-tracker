"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious
} from "@/components/ui/pagination";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

interface Automation {
    automation_id: string;
    name: string;
}

interface Props {
    automations: Automation[];
}

export default function AutomationPanel({ automations }: Props) {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const totalPages = Math.ceil(automations.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentAutomations = automations.slice(startIndex, startIndex + itemsPerPage);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    return (
        <Card className="border-r h-full">
            <CardHeader className="pb-2">
                <CardTitle className="text-lg font-semibold">Automation</CardTitle>
                <Badge variant="outline" className="w-fit">
                    {automations.length} items
                </Badge>
            </CardHeader>

            <CardContent className="p-3">
                <ScrollArea className="h-64 pr-3">
                    {currentAutomations.map((item) => (
                        <div
                            key={item.automation_id}
                            draggable
                            onDragStart={(e) => e.dataTransfer.setData("automation", JSON.stringify(item))}
                            className="p-3 border rounded-md mb-2 bg-white hover:bg-gray-50 cursor-pointer transition-colors flex items-center shadow-sm"
                        >
                            <div className="text-sm font-medium">{item.name}</div>
                        </div>
                    ))}
                </ScrollArea>

                {totalPages > 1 && (
                    <Pagination className="mt-4">
                        <PaginationContent>
                            <PaginationItem>
                                <PaginationPrevious
                                    onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                                    className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                                />
                            </PaginationItem>

                            {Array.from({ length: Math.min(totalPages, 3) }).map((_, index) => {
                                // Show current page and surrounding pages
                                let pageToShow = currentPage;
                                if (index === 0 && currentPage > 1) pageToShow = currentPage - 1;
                                if (index === 2 && currentPage < totalPages) pageToShow = currentPage + 1;
                                if (totalPages <= 3) pageToShow = index + 1;

                                // Only show page if it's valid
                                if (pageToShow > 0 && pageToShow <= totalPages) {
                                    return (
                                        <PaginationItem key={pageToShow}>
                                            <PaginationLink
                                                onClick={() => handlePageChange(pageToShow)}
                                                isActive={currentPage === pageToShow}
                                            >
                                                {pageToShow}
                                            </PaginationLink>
                                        </PaginationItem>
                                    );
                                }
                                return null;
                            })}

                            <PaginationItem>
                                <PaginationNext
                                    onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                                    className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                                />
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                )}
            </CardContent>
        </Card>
    );
}