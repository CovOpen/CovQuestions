/*


	Scores
	---
	Scores are used to evaluate a questionnaire. Each question can modify each score.
	The way questions influences scores is defined by a ScoreInfluence object.
	With isFixed, a Score can be set to a specific value and will not be altered by following questions.
	minValue and maxValue limit the range of possible values of a question.


*/

interface Score {
	id: string,
	name: string,
	value: number,
	isFixed: boolean,
	minValue?: number,
	maxValue?: number
}

interface ScoreInfluence {
	scoreId: string,
	influenceType: 'add' | 'multiply' | 'setFixed'
	value: number
}



/*


	Questions
	---
	There are three question types: Select (single), Multi (multiple) and number
	Each question comes with a set of QuestionGuards. They refer to previous questions and only if all guards
	evaluate to true, the question is considered (logical and). The Guard values is compared to the value of the chosen answer.
	Each answer holds a set of ScoreInfluence objects. The chosen answers modify the scores with this.

*/

enum QuestionType {
	SELECT = 1,
	MULTISELECT = 2,
	NUMBER = 4
}

interface QuestionGuard {
	questionId: string,
	operator: '==' | '!=' | '<' | '>',
	value: number
}

interface QuestionAnswer {
	id: string,
	answer: string,
	scoreInfluence: ScoreInfluence[],
	value: number
}

interface Question {
	id: string
	type: QuestionType,
	question: string,
	answers: QuestionAnswer[],
	guards: QuestionGuard[]
}



/*


	Questionnaires


*/

interface QuestionnaireMeta {
	name: string,
	version: string,
	author: string,
	languages: string[]
}

interface Questionnaire {
	meta: QuestionnaireMeta
	questions: Question[],
	scores: Score[]
}
