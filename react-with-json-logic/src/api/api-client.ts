
const rootUrl = process.env.REACT_APP_API_URL;

export async function getAllQuestionnaires (): Promise<any[]> {
    let response = await fetch(`${rootUrl}/api/index.json`);
    if (response.ok) {
        return await response.json();
    }
    return [];
}