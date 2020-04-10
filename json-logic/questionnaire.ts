// This file showcases a basic reference implementation.

import { IQuestion, QuestionType, IQuestionnaire, IQuestionnaireMeta, IVariable } from "./schema"
import { LogicConstant, LogicExpression, jsonLogic } from "./logic";

declare var jsonLogic: jsonLogic;

abstract class Question implements IQuestion {
	id: string;
	type: QuestionType;
	text: string;
	enableWhen?: LogicExpression;

	abstract ask() : LogicConstant;

	public check(state: IQuestionnaire) : boolean {
		if(this.enableWhen) {
			return jsonLogic.apply(this.enableWhen, state.variables) as any as boolean; // Fix me
		}
		else {
			return true;
		}
	}
}



class Questionnaire implements IQuestionnaire {
	meta: IQuestionnaireMeta;
	questions: Question[];
	variables: IVariable[];
	answeredQuestions: string[] = [];
	resultCategories: [];

	public nextQuestion() {
		// start always from first question, because the guard might evaluate to true
		// if later questions were answered.
		for(const question of this.questions) {
			// skip if question was answered previously
			if(this.answeredQuestions.indexOf(question.id) > -1) {
				continue;
			}

			// ask only if should be asked
			const guardCheck = question.check(this);
			if(!guardCheck) {
				continue;
			}

			return question;
		}
		return null;
	}


	public setAnswer(questionId: string, answer: LogicConstant) {
		// TODO: use this.variables as map and access data by question id
		// update non-computable variable
		const v = this.variables.filter(va => va.id == questionId)[0];
		v.value = answer;
		// update all computable variables
		this.updateComputableVariables();
	}


	public updateComputableVariables() {
		for(const variableId of Object.keys(this.variables)) {
			const variable = this.variables[variableId];
			// only update computable ones
			if(variable.type == 'computed') {
				try {
					variable.value = jsonLogic.apply(
						(variable as IVariable).value, 
						this.variables
					);
				}
				catch {
					variable.value = variable.default; 
				}
			}
		}
	}
}



function main() {

	const questionnaire = new Questionnaire();

	while(true) {
		// get question
		const question = questionnaire.nextQuestion();
		// stop if all questions were answered
		if(question == null) {
			break;
		}
		// get answer from user and set answer
		const answer = question.ask();
		questionnaire.setAnswer(question.id, answer);
	}

}