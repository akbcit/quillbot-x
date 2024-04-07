export async function expandIdeaService(text: string, title: string, description: string, token: string) {
    //Encode text, title, description to be URL-safe
    const queryParams = new URLSearchParams({ text, title, description }).toString();
    const apiUrl = `${import.meta.env.VITE_APP_API_URL}/createTextContent?${queryParams}`;
    try {
        const response = await fetch(apiUrl, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data.response;
    } catch (error) {
        console.error("Error fetching content:", error);
        throw error;
    }
}
