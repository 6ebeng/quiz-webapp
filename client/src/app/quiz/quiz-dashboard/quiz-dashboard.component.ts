import { Component, HostListener, OnDestroy, OnInit} from '@angular/core';
import { BehaviorSubject, Observable, Subscription, map } from 'rxjs';
import { Quiz } from '../quiz.model';
import { User } from 'src/app/users/user.model';
import { AuthService } from 'src/app/shared/auth.service';
import { QuizService } from '../quiz.service';
import { QuizCategory } from '../quiz-category.model';
import { Question } from '../question.model';

@Component({
  selector: 'app-quiz-dashboard',
  templateUrl: './quiz-dashboard.component.html',
  styleUrls: ['./quiz-dashboard.component.css']

})
export class QuizDashboardComponent implements OnInit, OnDestroy {

  hoverColor : string = '';
  filterValues : string[] = [];
  query : string = '';

  authenticated : boolean = false;
  description : boolean = false;

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

  getQuestionsCount(id: string) {

    let count = 0;

    this.quizQuestions.forEach(question => { 
      if (question.quizId === id) {
        count++;
      }
    })
    return count;
  }

  getCategoryColor(id: string): Observable<string> {
    return this.quizService.getQuizCategory(id)
      .pipe(
        map(category => category?.color ? category.color : "silver")
      )
  }



  getCategoryImage(id: string): Observable<string> {
    return this.quizService.getQuizCategory(id)
      .pipe(
        map(category => {
          const path : string = "../../../assets/";
          return category?.image ? path + category.image : "";
        })
      )
  }



  setStyle(category: QuizCategory): void {
    
    if (category.color) {
      this.hoverColor = category.color;
    }
  }
  
  resetStyle(category: QuizCategory): void {

    if (!category.selected) {
      this.hoverColor = '';
    }
  }

  setFilterValues(category : QuizCategory) {
    
    const i = this.filterValues.indexOf(category.id);

    if (i == -1) {
      category.selected = true;
      this.filterValues.push(category.id);
    }
    else {
      category.selected = false;
      this.filterValues.splice(i, 1);
    }
    
    this.filterValues = [...this.filterValues];
  }

  showDescription(quiz: Quiz) {
    if (!quiz.showOverlay) {

      quiz.showDescription = true;

      setTimeout(() => {
        quiz.showDescription = false;
      }, 3000);
    
    }
  }

  hideDescription(quiz: Quiz) {

    if (quiz.showDescription) {
      quiz.showDescription = false;
    }
  }

  toggleOverlay(quiz: Quiz) {
    if (!this.authenticated) {
      quiz.showOverlay = !quiz.showOverlay;
    }
    quiz.showDescription = false;
  }

  @HostListener('mouseleave', ['$event'])
  hideOverlay(event: MouseEvent) {
    this.quizzes.forEach(quiz => {
      if (quiz.showOverlay) {
        quiz.showOverlay = false;
      }
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
