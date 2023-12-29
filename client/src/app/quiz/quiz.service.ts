import { Injectable } from '@angular/core';
import { DataService } from '../shared/data.service';
import { BehaviorSubject } from 'rxjs';
import { Quiz } from './quiz.model';
import { QuizCategory } from './quiz-category.model';

@Injectable({
  providedIn: 'root'
})
export class QuizService {

  private quizzes : Quiz[] = [];
  private quizCategories : QuizCategory[] = [];

  quizzesSubject : BehaviorSubject<Quiz[]> = new BehaviorSubject<Quiz[]>([]);
  quizCategoriesSubject : BehaviorSubject<QuizCategory[]> = new BehaviorSubject<QuizCategory[]>([]);

  constructor(private dataService : DataService) {

    this.dataService.getQuizzesWithCategories().subscribe({
      next: (quizzes) => {
        console.log(quizzes);

        if (quizzes) {
          this.quizzes = quizzes;
          this.quizzesSubject.next([...this.quizzes]);
        }
      },
      error: (error) => {
        console.error(error);
      }});
    
    // this.dataService.getQuizzes().subscribe({
    //   next: (quizzes) => {
    //     console.log(quizzes);

    //     if (quizzes) {
    //       this.quizzes = quizzes;
    //       this.quizzesSubject.next([...this.quizzes]);
    //     }
    //   },
    //   error: (error) => {
    //     console.error(error);
    //   }});

    this.dataService.getQuizCategories().subscribe({
      next: (quizCategories) => {
        console.log(quizCategories);

        if (quizCategories) {
          this.quizCategories = quizCategories;
          this.quizCategoriesSubject.next([...this.quizCategories]);
        }
      },
      error: (error) => {
        console.error(error);
      }});

   }

  getQuizzes() {
    return this.quizzesSubject;
  }

  getQuizCategories() {
    return this.quizCategoriesSubject;
  }

  getQuiz(id: string) {
    return this.quizzes.find(quiz => quiz.id == id);
  }

  getQuizCategory(id: string) {
    return this.quizCategories.find(quizCategory => quizCategory.id == id);
  }


  // addQuiz(post: Quiz) {

  //   console.log(post);

  //   this.dataService.addQuiz(post).subscribe({
  //     next: (key) => {
  //     console.log(key);
  //     this.quizzes.push({ ...post, id: (key as { name: string }).name });
  //     this.quizzesSubject.next([...this.quizzes]);
  //     },
  //     error: (error) => {
  //       console.error(error);
  //     }});
  
  // }

  // editQuiz(post: Quiz) {
    
  //   this.dataService.editQuiz(post).subscribe({
  //     next: (res) => {
  //       console.log(res);
  //       this.quizzes[this.quizzes.findIndex(p => p.id == post.id)] = post;
  //       this.quizzesSubject.next([...this.quizzes]);
  //     },
  //     error: (error) => {
  //       console.error(error);
  //     }});
  //  }

  // deleteQuiz(id: string) {

  //   this.dataService.deleteQuiz(id).subscribe({
  //     next: (res) => {
  //       console.log(res);
  //       this.quizzes.splice(this.quizzes.findIndex(post => post.id == id), 1);
  //       this.quizzesSubject.next([...this.quizzes]);
  //     },
  //     error: (error) => {
  //       console.error(error);
  //     }});
  //   };
}
