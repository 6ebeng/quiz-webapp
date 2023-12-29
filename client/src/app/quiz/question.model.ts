export class Question {

    id : string = '';
    questionText: string = '';
    possibleAnswer : string[] = [];
    correctAnswer : string[] = [];
    lastChanged: Date = new Date();
    quizId: string = '';
}
  