import { Component, HostListener, OnDestroy, OnInit} from '@angular/core';
import { BehaviorSubject, Subscription, } from 'rxjs';
import { Quiz } from '../quiz.model';
import {NgForm} from '@angular/forms';
import { User } from 'src/app/users/user.model';
import { AuthService } from 'src/app/shared/auth.service';
import { QuizService } from '../quiz.service';
import { QuizCategory } from '../quiz-category.model';

@Component({
  selector: 'app-quiz-dashboard',
  templateUrl: './quiz-dashboard.component.html',
  styleUrls: ['./quiz-dashboard.component.css']

})
export class QuizDashboardComponent implements OnInit, OnDestroy {

  colors : string[] = ['BurlyWood', 'LightBlue', 'Thistle', 'LightSteelBlue'];
  rndColors : string[] = ['DarkCyan', 'Moccasin', 'BurlyWood', 'LightCoral', 'Plum', 'LightGrey', 'CadetBlue', 'DarkSeaGreen'];
  images : string[] = ['bullseye-gradient.png', 'liquid-cheese.png', 'sun-tornado.png'];

  assignedCategories: Map<string, {color: string, image: string}> = new Map();
  assignedQuizzes: Map<string, string> = new Map();

  hoverColor : string = '';
  filterValues : string[] = [];
  query : string = '';

  quizzes : Quiz[] = [];
  quizCategories : QuizCategory[] = [];
  // quizesInEditing : Quiz[] = [];
  // newQuiz : Quiz = new Quiz();

  user: User = new User();
  authenticated : boolean = false;
  description : boolean = false;

  userSubject : BehaviorSubject<User> | null = null;
  userSubscription : Subscription | null = null;

  quizzesSubject : BehaviorSubject<Quiz[]> | null = null;
  quizzesSubscription : Subscription | null = null;

  quizCategoriesSubject : BehaviorSubject<QuizCategory[]> | null = null;
  quizCategoriesSubscription : Subscription | null = null;

  authSubscription : Subscription | null = null;


  // add : boolean = false;

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

      quizzes.forEach((quiz) => {
        if (!this.assignedQuizzes.has(quiz.id)) {

          const rndColor = this.rndColors[Math.floor(Math.random() * this.rndColors.length)];
          quiz.color = rndColor;
        }
      });

      const rndColor = this.rndColors[Math.floor(Math.random() * this.rndColors.length) - 1];
    });

    this.quizCategoriesSubject = this.quizService.getQuizCategories();
    this.quizCategoriesSubscription = this.quizCategoriesSubject.subscribe(quizCategories => {
      this.quizCategories = quizCategories; 

      quizCategories.forEach((category) => {
        if (!this.assignedCategories.has(category.id)) {

          const color = this.colors[this.assignedCategories.size % this.colors.length];
          const image = this.images[this.assignedCategories.size % this.images.length];

          this.assignedCategories.set(category.id, {color, image});
          category.color = color;
          category.image = image;
        }
      });
    })


    // forkJoin({
    //   quizzes: this.quizService.getQuizzes(),
    //   categories: this.quizService.getQuizCategories(),
    // }).subscribe(({ quizzes, categories }) => {
    //   this.quizzes = quizzes.map((quiz) => ({
    //     ...quiz,
    //     categoryName: categories.find((category) => category.id === quiz.categoryId)?.name,
    //   }));
    // });


  }


  // startEditing(post : Quiz) {
      
  //    console.log("Editing: " + JSON.stringify(post));
  //   this.quizesInEditing.push({...post});

  // }

  // finishEditing(idQuiz: string) {

  //     let post = this.getQuizInEditing(idQuiz) as Quiz;

  //     this.quizesInEditing.splice((this.quizesInEditing.indexOf(post)), 1);
  //     this.quizService.editQuiz(post); 
    
  // }

  // getQuizInEditing(id: string) {
  //   return this.quizesInEditing.find(post => post.id == id);

  // }

  // inEditing(id: string) {
  //   return this.getQuizInEditing(id) ? true : false;

  // }

  // deleteQuiz(id: string) {
    
  //   console.log(id);
  //   this.quizService.deleteQuiz(id);

  // }

  // addQuiz() {

  //   console.log("New post: " + JSON.stringify(this.newQuiz));

  //   this.add = !this.add;
  //   this.quizService.addQuiz(this.newQuiz);
  //   this.newQuiz = new Quiz();
  // }

  // startAdding() {
  //   this.add = !this.add;
  //   this.newQuiz.userId = this.authService.getUser().id as string;
  //   this.newQuiz.username = this.authService.getUser().username as string;
  // }

  // cancelAdding() {
  //   this.add = !this.add;
  //   this.newQuiz = new Quiz();
  // }

  // logout(){
  //   this.authService.logoutUser();
  // }



  
  getCategoryColor(id: string): string {

    const category = this.quizService.getQuizCategory(id);
    return category?.color ? category.color : "silver";
  }

  getCategoryImage(id: string): string {

    const path : string = "../../../assets/";
    const category = this.quizService.getQuizCategory(id);
    return category?.image ? path + category.image : "";
  }

  setHoverStyle(category: QuizCategory): void {
    
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
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }

  }

}
