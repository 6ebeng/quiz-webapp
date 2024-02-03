import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Question } from '../question.model';
import { QuizResults } from '../quiz-results.model';

@Component({
  selector: 'app-quiz-question',
  templateUrl: './quiz-question.component.html',
  styleUrls: ['./quiz-question.component.css']
})
export class QuizQuestionComponent {

  @Input() question : Question | undefined;
  @Output() answerEvent : EventEmitter<string> = new EventEmitter<string>();

  selectedAnswer: string | undefined;

  onAnswerChange(answer: string) {

    this.selectedAnswer = answer;
  }

  onAnswer() {

    if (this.selectedAnswer) {
  
      this.answerEvent.emit(this.selectedAnswer);
  
    }
  }

}
