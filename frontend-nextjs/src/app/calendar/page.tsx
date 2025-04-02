"use client";

import { useEffect, useRef, useState } from "react";
import { Calendar } from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import { Maintenance } from "@/type/maintenance";
import {fetchMaintenances} from "@/app/calendar/action";


export default function MaintenanceCalendar() {
    const [maintenanceData, setMaintenanceData] = useState<Maintenance[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const calendarRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const loadData = async () => {
            try {
                setIsLoading(true);
                const data = await fetchMaintenances();
                setMaintenanceData(data);
                setError(null);
            } catch (error) {
                console.error("Failed to fetch maintenance data:", error);
                setError("Failed to load maintenance data. Please try again later.");
            } finally {
                setIsLoading(false);
            }
        };

        loadData();
    }, []);

    useEffect(() => {
        if (calendarRef.current && maintenanceData.length > 0) {
            const events = maintenanceData.map((maintenance) => ({
                title: maintenance.automation?.name || "No Automation Name",
                start: maintenance.date,
                id: maintenance.maintenance_id,
            }));

            const calendar = new Calendar(calendarRef.current, {
                plugins: [dayGridPlugin],
                initialView: "dayGridMonth",
                events: events,
            });

            calendar.render();
        }
    }, [maintenanceData]);

    if (isLoading) {
        return <div className="flex justify-center p-8">Loading maintenance calendar...</div>;
    }

    if (error) {
        return <div className="text-red-500 p-4">{error}</div>;
    }

    return <div ref={calendarRef} className="min-h-[500px]" />;
}