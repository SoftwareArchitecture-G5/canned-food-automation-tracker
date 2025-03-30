export async function fetchBlueprintData() {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_DOMAIN}/blueprint`, {
        method: 'GET',
        headers: {"Content-Type": "application/json"},
    });
    const data = await response.json();
    return data;
}