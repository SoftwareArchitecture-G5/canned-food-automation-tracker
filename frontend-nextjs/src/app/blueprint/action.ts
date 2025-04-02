export async function fetchBlueprintData() {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_DOMAIN}/blueprint`, {
        method: 'GET',
        headers: {"Content-Type": "application/json"},
    });
    const data = await response.json();
    return data;
}

export const saveBlueprint = async (blueprintName: string, nodes: any[], edges: any[]) => {
    if (!blueprintName) {
        throw new Error("Please enter a blueprint name!");
    }

    const blueprintData = { name: blueprintName, nodes, edges };

    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_DOMAIN}/blueprint/save`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(blueprintData),
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }

        return "Blueprint saved!";
    } catch (error) {
        throw new Error(`Failed to save blueprint: ${error}`);
    }
};

export const saveExistingBlueprint = async (selectedBlueprintId: string, nodes: any[], edges: any[]) => {
    if (!selectedBlueprintId) {
        throw new Error("No blueprint selected!");
    }

    const blueprintData = { nodes, edges };

    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_DOMAIN}/blueprint/${selectedBlueprintId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(blueprintData),
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }

        return "Existing blueprint saved!";
    } catch (error) {
        throw new Error(`Failed to save blueprint: ${error}`);
    }
};

export const deleteBlueprint = async (selectedBlueprintId: string) => {
    if (!selectedBlueprintId) {
        throw new Error("No blueprint selected to delete!");
    }

    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_DOMAIN}/blueprint/${selectedBlueprintId}`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }

        return "Blueprint deleted successfully!";
    } catch (error) {
        throw new Error(`Failed to delete blueprint: ${error}`);
    }
};
