"use server";
import { auth } from "@clerk/nextjs/server";

export async function fetchAutomationById(id: string) {
  const { getToken } = await auth();
  const token = await getToken({ template: "automation-tracker" });

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_DOMAIN}/automations/${id}`, {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      credentials: "include",
      cache: "no-store",
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("Failed to fetch automation:", res.status, errorText);
      throw new Error("Failed to fetch automation");
    }

    return await res.json();
  } catch (err) {
    console.error("fetchAutomationById error:", err);
    return null;
  }
}

export async function fetchMaintenanceByAutomationId(id: string) {
  const { getToken } = await auth();
  const token = await getToken({ template: "automation-tracker" });

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_DOMAIN}/maintenances/get-all-by-automation-id/${id}`, {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      credentials: "include",
      cache: "no-store",
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("Failed to fetch maintenance records:", res.status, errorText);
      throw new Error("Failed to fetch maintenance records");
    }

    return await res.json();
  } catch (err) {
    console.error("fetchMaintenanceByAutomationId error:", err);
    return [];
  }
}
