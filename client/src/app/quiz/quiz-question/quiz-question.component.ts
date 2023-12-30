import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { Question } from '../question.model';
import { UserQuiz } from '../user-quiz.model';

@Component({
  selector: 'app-quiz-question',
  templateUrl: './quiz-question.component.html',
  styleUrls: ['./quiz-question.component.css']
})
export class QuizQuestionComponent implements OnChanges {

  @Input() questionIndex : number | undefined;
  @Input() question : Question | undefined;

  @Input() userId : string | undefined;
  @Input() quizId : string | undefined;

  @Input() questionsLength : number | undefined;
  @Input() quizCompleted : boolean | undefined;

  @Output() nextQuestionEvent : EventEmitter<UserQuiz> = new EventEmitter<UserQuiz>();
  @Output() quitEvent : EventEmitter<UserQuiz> = new EventEmitter<UserQuiz>();

  selectedAnswer: string | undefined;
  quizStats: UserQuiz = new UserQuiz();

  ngOnChanges(changes: SimpleChanges): void {

    if (this.quizStats) {

      if ('userId' in changes) {
          this.quizStats.userId = this.userId!;
      }
      if ('quizId' in changes) {
        this.quizStats.quizId = this.quizId!;
      }
    }
  }

  onAnswerChange(answer: string) {

    this.selectedAnswer = answer;
  }

  onConfirmed() {

    if (this.selectedAnswer) {

      if (this.quizStats) {

        this.quizStats.totalQuestions++;

        if (this.selectedAnswer === this.question?.answer)  {
          this.quizStats.score++;
  
        }
        console.log(this.quizStats);
        
        this.nextQuestionEvent.emit(this.quizStats);
      }
    }
  }

  onQuit() {
    this.quitEvent.emit(this.quizStats);
  }

}
