import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { QuizService } from '../quiz.service';
import { Quiz } from '../quiz.model';

@Component({
  selector: 'app-quiz-detail',
  templateUrl: './quiz-detail.component.html',
  styleUrls: ['./quiz-detail.component.css']
})
export class QuizDetailComponent implements OnInit {

  id: string = '';
  quiz?: Quiz;

  constructor(private activatedRoute: ActivatedRoute, private quizService: QuizService) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((data) => {
      this.id = data['quizid'];
    });

    this.quiz = this.quizService.getQuiz(this.id);
  }

}
