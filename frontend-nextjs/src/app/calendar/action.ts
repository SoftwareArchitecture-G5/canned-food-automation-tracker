"use server"


import {Maintenance} from "@/type/maintenance";
import {auth} from "@clerk/nextjs/server";

export async function fetchMaintenances(): Promise<Maintenance[]> {
    const {getToken} = await auth();
    const token = await getToken({template: "automation-tracker"})
    const url = `${process.env.NEXT_PUBLIC_BACKEND_DOMAIN}/maintenances`;

    const response = await fetch(url, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        credentials: "include",
    });

    if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return response.json();
}