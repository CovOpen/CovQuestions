import { Questionnaire } from "covquestions-js/models/Questionnaire.generated";

const rootUrl = process.env.REACT_APP_API_URL || '';

export async function getAllQuestionnaires (): Promise<any[]> {
    let url = rootUrl + '/api/index';
    if (process.env.NODE_ENV !== 'production') {
        url += ".json";
    }
    let response = await fetch(url);
    if (response.ok) {
        return await response.json();
    }
    return [];
}

export async function getQuestionnaire (path: string): Promise<Questionnaire | undefined> {
    let response = await fetch(`${rootUrl}${path}`);
    if (response.ok) {
        let result:Questionnaire = await response.json();
        return result;
    }
    return undefined;
}
