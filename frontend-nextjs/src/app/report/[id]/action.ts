export async function fetchAutomationById(id: string) {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_DOMAIN}/automations/${id}`, {
        credentials: "include",
      });
  
      if (!res.ok) throw new Error("Failed to fetch automation");
      return await res.json();
    } catch (err) {
      console.error("fetchAutomationById error:", err);
      return null;
    }
  }
  
  export async function fetchMaintenanceByAutomationId(id: string) {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_DOMAIN}/maintenances/get-all-by-automation-id/${id}`, {
        credentials: "include",
      });
  
      if (!res.ok) throw new Error("Failed to fetch maintenance records");
      return await res.json();
    } catch (err) {
      console.error("fetchMaintenanceByAutomationId error:", err);
      return [];
    }
  }
  