declare var jsonLogic : any;


abstract class Question implements IQuestion {
	id: string
	abstract type: IQuestionType
	question: string
	answers: IQuestionAnswer[]
	guard: JSONLogicExpression

	abstract ask() : IQuestionAnswer;

	public checkGuard(state: IQuestionnaire) : boolean {
		return jsonLogic.apply(this.guard, state.variables);
	}
}



class Questionnaire implements IQuestionnaire {
	meta: IQuestionnaireMeta;
	questions: Question[];
	variables: {
		[varId: string]: IVariable<any>;
	}
	answeredQuestions: string[] = [];

	public nextQuestion() {
		// start always from first question, because the guard might evaluate to true
		// if later questions were answered.
		for(const question of this.questions) {
			// skip if question was answered previously
			if(this.answeredQuestions.indexOf(question.id) > -1) {
				continue;
			}

			// ask only if should be asked
			const guardCheck = question.checkGuard(this);
			if(!guardCheck) {
				continue;
			}

			return question;
		}
		return null;
	}


	public setAnswer(questionId: string, answer: IQuestionAnswer) {
		// update non-computable variable
		this.variables[questionId].value = answer.value;
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
						(variable as IComputedVariable<any>).expression, 
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