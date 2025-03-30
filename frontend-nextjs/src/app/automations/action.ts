"use server";

import { Automation, AutomationStatus } from "@/type/automation";

export async function getAutomations(): Promise<Automation[]> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_DOMAIN}/automations`,
    {
      headers: { "Content-Type": "application/json" },
      method: "GET",
      credentials: "include",
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch automations");
  }

  const data: Automation[] = await response.json();
  return data;
}

export async function deleteAutomation(id: string): Promise<boolean> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_DOMAIN}/automations/${id}`,
      {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      }
    );

    if (!response.ok) {
      throw new Error("Failed to delete automation");
    }

    return true;
  } catch (error) {
    console.error("Error deleting automation:", error);
    return false;
  }
}

export async function createAutomation(payload: {
  name: string;
  description: string;
}): Promise<Automation | null> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_DOMAIN}/automations`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(payload),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Create Automation failed:", errorText);
      return null;
    }

    const newAutomation: Automation = await response.json();
    return newAutomation;
  } catch (error) {
    console.error("Error creating automation:", error);
    return null;
  }
}

export async function updateAutomation(
    id: string,
    payload: { name: string; description: string; status: AutomationStatus }
  ): Promise<Automation | null> {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_DOMAIN}/automations/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(payload),
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Update Automation failed:", errorText);
        return null;
      }
  
      const updated: Automation = await response.json();
      return updated;
    } catch (error) {
      console.error("Error updating automation:", error);
      return null;
    }
  }