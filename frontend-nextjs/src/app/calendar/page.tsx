"use client";

import { useEffect, useRef, useState } from "react";
import { Calendar } from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";

interface Maintenance {
  maintenance_id: string;
  issue_report: string;
  date: string; // Ensure this is a string in YYYY-MM-DD format
}

import { Maintenance } from "@/type/calendar";


export default function MaintenanceCalendar() {
    const [maintenanceData, setMaintenanceData] = useState<Maintenance[]>([]);
    const calendarRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            console.log("Fetching from:", process.env.NEXT_PUBLIC_BACKEND_DOMAIN);
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_DOMAIN}/maintenances`, {
                    headers: { "Content-Type": "application/json" },
                    method: "GET",
                    credentials: "include",
                });
                if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
                const data: Maintenance[] = await response.json();
                setMaintenanceData(data);
            } catch (error) {
                console.error("Fetch error:", error);
            }
        };
    
        fetchData();
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

    return <div ref={calendarRef} />;
}
