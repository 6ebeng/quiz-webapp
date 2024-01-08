import { Component, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { Question } from 'src/app/quiz/question.model';
import { QuizCategory } from 'src/app/quiz/quiz-category.model';
import { Quiz } from 'src/app/quiz/quiz.model';
import { QuizService } from 'src/app/quiz/quiz.service';
import { AuthService } from 'src/app/shared/auth.service';
import { User } from 'src/app/users/user.model';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit, OnDestroy {

  authenticated : boolean = false;

  user: User = new User();
  userSubject : BehaviorSubject<User> | null = null;
  userSubscription : Subscription | null = null;

  quizzes : Quiz[] = [];
  quizzesSubject : BehaviorSubject<Quiz[]> | null = null;
  quizzesSubscription : Subscription | null = null;

  quizCategories : QuizCategory[] = [];
  quizCategoriesSubject : BehaviorSubject<QuizCategory[]> | null = null;
  quizCategoriesSubscription : Subscription | null = null;

  quizQuestions : Question[] = [];
  quizQuestionsSubject : BehaviorSubject<Question[]> | null = null;
  quizQuestionsSubscription : Subscription | null = null;

  authSubscription : Subscription | null = null;

  constructor(private authService: AuthService, private quizService: QuizService) {}

  ngOnInit() {

    this.authSubscription = this.authService.authStatus.subscribe(authenticated => {
      this.authenticated = authenticated;
    });

    this.authenticated = this.authService.isAuthenticated();

    this.userSubject = this.authService.getUser();
    this.userSubscription = this.userSubject.subscribe(user => {
      this.user = user;
    });

    this.quizzesSubject = this.quizService.getQuizzes();
    this.quizzesSubscription = this.quizzesSubject.subscribe(quizzes => {
      this.quizzes = quizzes;
    });

    this.quizCategoriesSubject = this.quizService.getQuizCategories();
    this.quizCategoriesSubscription = this.quizCategoriesSubject.subscribe(quizCategories => {
      this.quizCategories = quizCategories; 
    });

    this.quizQuestionsSubject = this.quizService.getAllQuestions();
    this.quizQuestionsSubscription = this.quizQuestionsSubject.subscribe(quizQuestions => {
      this.quizQuestions = quizQuestions; 
    });

  }


  ngOnDestroy() {

    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
    if (this.quizzesSubscription) {
      this.quizzesSubscription.unsubscribe();
    }
    if (this.quizCategoriesSubscription) {
      this.quizCategoriesSubscription.unsubscribe();
    }
    if (this.quizQuestionsSubscription) {
      this.quizQuestionsSubscription.unsubscribe();
    }

    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }

  }


}
