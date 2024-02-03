export class QuizResults {

    id? : string = '';
    userId : string = '';
    quizId : string = '';
    score: number = 0;
    totalQuestions: number = 0;
    questionsAnsered: number = 0;
    timestamp: Date = new Date();

}