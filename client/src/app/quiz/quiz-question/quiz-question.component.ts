import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Question } from '../question.model';
import { QuizResults } from '../quiz-results.model';
import { QuizService } from '../quiz.service';
import { DataService } from 'src/app/shared/data.service';
import { OpenAiResult } from '../openai-result.model';

@Component({
  selector: 'app-quiz-question',
  templateUrl: './quiz-question.component.html',
  styleUrls: ['./quiz-question.component.css']
})
export class QuizQuestionComponent {

  @Input() question : Question | undefined;
  @Output() answerEvent : EventEmitter<string> = new EventEmitter<string>();
  @Input() questionsLength : number | undefined;
  @Input() questionIndex : number | undefined;

  selectedAnswer: string | undefined;

  waiting: boolean = false;
  hint : string = '';

  constructor(private quizService: QuizService, private dataService: DataService){}

  onAnswerChange(answer: string) {

    this.selectedAnswer = answer;
  }

  onAnswer() {

    if (this.selectedAnswer) {
  
      this.answerEvent.emit(this.selectedAnswer);
  
    }
  }

  generateHint() {

    this.waiting = !this.waiting;

    this.dataService.generateHint({question: this.question?.text!})
    .subscribe({
      next: (res:{status: string, result?: OpenAiResult }) => {
        console.log("Generated: ", res);

        if (res.status === 'OK' && res.result) {

          this.hint = res.result.hint!;
          this.waiting = !this.waiting;
          console.log(this.hint);
          
        }
    },
      error: (error) => {
        console.log(error);
    }});

  }

}
