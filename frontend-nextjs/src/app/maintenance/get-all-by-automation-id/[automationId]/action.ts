export const fetchMaintenanceData = async (automationId: string | null, page: number = 1, limit: number = 10) => {
    if (!automationId) return [];

    const params = new URLSearchParams();
    params.append('page', String(page));
    params.append('limit', String(limit));

    const url = `${process.env.NEXT_PUBLIC_BACKEND_DOMAIN}/maintenances/get-all-by-automation-id/${automationId}?${params.toString()}`;
    try {
        const response = await fetch(url, {
            headers: { "Content-Type": "application/json" },
            method: "GET",
            credentials: "include",
        });
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error("Fetch error:", error);
        return [];
    }
};

export const fetchPaginationMetaData = async (automationId: string | null, page: number, limit: number) => {
    // page + 1 for checking next page, limit + 1 for checking next next page
    const data = await fetchMaintenanceData(automationId, page + 1, limit + 1);
    return {
        hasNextPage: data.length > 0,
        hasNextNextPage: data.length > limit
    };
};