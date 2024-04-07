export async function generateImageFromPhrase(prompt:string,token:string) {
    // Encode title and description to be URL-safe
    const queryParams = new URLSearchParams({ prompt }).toString();
    const apiUrl = `${import.meta.env.VITE_APP_API_URL}/createImage?${queryParams}`;
    console.log(apiUrl)
    try {
        const response = await fetch(apiUrl,{
            headers: {
                'Authorization': `Bearer ${token}`,  
                'Content-Type': 'application/json'  
            },
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data;  
    } catch (error) {
        console.error("Error fetching content:", error);
        throw error;  
    }
}
