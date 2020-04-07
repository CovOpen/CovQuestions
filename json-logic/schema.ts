type JSONLogicExpression = any;

interface IVariable<T> {
	id: string;
	name: string;
	default: T;
	value: T;
	type: 'question' | 'computed';
}

interface IComputedVariable<T> extends IVariable<T> {
	// TODO: the computed variables can not depend on each other!
	type: 'computed';
	expression: JSONLogicExpression;
}




/*


	Questions
	---
	There are three question types: Select (single), Multi (multiple) and number
	Each question comes with a set of QuestionGuards. They refer to previous questions and only if all guards
	evaluate to true, the question is considered (logical and). The Guard values is compared to the value of the chosen answer.
	Each answer holds a set of ScoreModification objects. The chosen answers modify the scores with this.

*/

enum IQuestionType {
	SELECT = 1,
	MULTISELECT = 2,
	NUMBER = 4
}


interface IQuestionAnswer {
	id: string,
	answer: string,
	value: number;
}

interface IQuestion {
	id: string
	type: IQuestionType,
	question: string,
	answers: IQuestionAnswer[],
	defaultAnswer?: string;  // use as default in JSONLogicExpression
	guard: JSONLogicExpression
}



/*


	Questionnaires


*/

interface IQuestionnaireMeta {
	name: string,
	version: string,
	author: string,
	languages: string[]
}

interface IQuestionnaire {
	meta: IQuestionnaireMeta
	questions: IQuestion[];
	variables: {
		[varId: string]: IVariable<any>;
	}
}