import { Injectable } from '@angular/core';
import { DataService } from '../shared/data.service';
import { BehaviorSubject, Observable, map, switchMap } from 'rxjs';
import { Quiz } from './quiz.model';
import { QuizCategory } from './quiz-category.model';
import { Question } from './question.model';


@Injectable({
  providedIn: 'root'
})

export class QuizService {

  colors : string[] = ['BurlyWood', 'LightBlue', 'Thistle', 'LightSteelBlue'];
  rndColors : string[] = ['DarkCyan', 'Moccasin', 'BurlyWood', 'LightCoral', 'Plum', 'LightGrey', 'CadetBlue', 'DarkSeaGreen'];
  images : string[] = ['bullseye-gradient.png', 'liquid-cheese.png', 'sun-tornado.png'];

  assignedCategories: Map<string, {color: string, image: string}> = new Map();
  assignedQuizzes: Map<string, string> = new Map();

  private quizzes : Quiz[] = [];
  private quizCategories : QuizCategory[] = [];

  quizzesSubject : BehaviorSubject<Quiz[]> = new BehaviorSubject<Quiz[]>([]);
  quizCategoriesSubject : BehaviorSubject<QuizCategory[]> = new BehaviorSubject<QuizCategory[]>([]);

  constructor(private dataService : DataService) {
 
    this.dataService.getQuizCategories().subscribe({
      next: (quizCategories) => {
        console.log(quizCategories);

        if (quizCategories) {
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

          this.quizCategoriesSubject.next([...this.quizCategories]);
        }
      },
      error: (error) => {
        console.error(error);
      }});


      this.quizCategoriesSubject.asObservable().pipe(
        switchMap(() => this.dataService.getQuizzes())
      ).subscribe({
        next: (quizzes) => {
          console.log(quizzes);
      
          if (quizzes) {
            this.quizzes = quizzes;

            quizzes.forEach((quiz) => {

              const category = this.quizCategories.find(cat => cat.id === quiz.categoryId);
                quiz.categoryName = category?.name;

                if (!this.assignedQuizzes.has(quiz.id)) {
                  const rndColor = this.rndColors[Math.floor(Math.random() * this.rndColors.length)];
                  quiz.color = rndColor;
                }
            });
      
            this.quizzesSubject.next([...this.quizzes]);
          }
        },
        error: (error) => {
          console.error(error);
        }
      });

   }

  getQuizzes() {
    return this.quizzesSubject;
  }

  getQuizCategories() {
    return this.quizCategoriesSubject;
  }

  getQuiz(id: string): Observable<Quiz | null> {

    return this.quizzesSubject.asObservable()
    .pipe(
      map(quiz => quiz.find(quiz => quiz.id === id) || null));
  }

  getQuizCategory(id: string): Observable<QuizCategory | null> {

    return this.quizCategoriesSubject.asObservable()
    .pipe(
      map(quizCategory => quizCategory.find(quizCategory => quizCategory.id === id) || null));

  }

  getQuizQuestions(id: string): Observable<Question[] | null> {

    return this.dataService.getQuizQuestions(id);
  }

}
