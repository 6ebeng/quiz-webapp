import { Injectable } from '@angular/core';
import { DataService } from '../shared/data.service';
import { BehaviorSubject, Observable, map, switchMap } from 'rxjs';
import { Quiz } from './quiz.model';
import { QuizCategory } from './quiz-category.model';
import { Question } from './question.model';
import { QuizResults } from './quiz-results.model';


@Injectable({
  providedIn: 'root'
})

export class QuizService {

  logoColors : string[] = ['DarkCyan', 'Moccasin', 'BurlyWood', 'LightCoral', 'Plum', 'LightGrey', 'CadetBlue', 'DarkSeaGreen'];
  categoryColors : string[] = ['BurlyWood', 'LightBlue', 'Thistle', 'LightSteelBlue'];
  categoryImages : string[] = ['bullseye-gradient.png', 'liquid-cheese.png', 'sun-tornado.png'];

  categoriesColorMap: Map<string, {color: string, image: string}> = new Map();
  quizzesColorMap: Map<string, string> = new Map();

  private quizzes : Quiz[] = [];
  quizzesSubject : BehaviorSubject<Quiz[]> = new BehaviorSubject<Quiz[]>([]);
  private quizCategories : QuizCategory[] = [];
  quizCategoriesSubject : BehaviorSubject<QuizCategory[]> = new BehaviorSubject<QuizCategory[]>([]);
  private quizQuestions : Question[] = [];
  quizQuestionsSubject : BehaviorSubject<Question[]> = new BehaviorSubject<Question[]>([]);
  private quizResults : QuizResults[] = [];
  quizResultsSubject : BehaviorSubject<QuizResults[]> = new BehaviorSubject<QuizResults[]>([]);

  constructor(private dataService : DataService) {
 
    this.dataService.getQuizCategories().subscribe({
      next: (quizCategories) => {
        // console.log("Categories:" + quizCategories);

        if (quizCategories) {
          this.quizCategories = quizCategories;
  
          quizCategories.forEach((category) => {
            if (!this.categoriesColorMap.has(category.id)) {
    
              const color = this.categoryColors[this.categoriesColorMap.size % this.categoryColors.length];
              const image = this.categoryImages[this.categoriesColorMap.size % this.categoryImages.length];
    
              this.categoriesColorMap.set(category.id, {color, image});
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

      // add categories
      this.quizCategoriesSubject.asObservable().pipe(
        switchMap(() => this.dataService.getQuizzes())
      ).subscribe({
        next: (quizzes) => {
          // console.log("Quizzes:" +quizzes);
      
          if (quizzes) {
            this.quizzes = quizzes;

            quizzes.forEach((quiz) => {

              const category = this.quizCategories.find(cat => cat.id === quiz.categoryId);
              quiz.categoryName = category?.name;

              if (!this.quizzesColorMap.has(quiz.id)) {

                const color = this.logoColors[Math.floor(Math.random() * this.logoColors.length)];
                quiz.color = color;
              }
            });
      
            this.quizzesSubject.next([...this.quizzes]);
          }
        },
        error: (error) => {
          console.error(error);
        }
      });

      this.dataService.getAllQuestions().subscribe({
        next: (quizQuestions) => {
          // console.log("Quiz questions:" + quizQuestions);
  
          if (quizQuestions) {
            this.quizQuestions = quizQuestions;  
            this.quizQuestionsSubject.next([...this.quizQuestions]);
          }
        },
        error: (error) => {
          console.error(error);
        }});
   }

   // quizees

  getQuizzes() {
    return this.quizzesSubject;
  }

  getQuiz(id: string): Observable<Quiz | null> {

    return this.quizzesSubject.asObservable()
    .pipe(
      map(quiz => quiz.find(quiz => quiz.id === id) || null));
  }

  addQuiz(quiz: Quiz) {

    console.log(quiz);

    this.dataService.addQuiz(quiz).subscribe((res => {

      console.log(res);
      this.quizzes.push({ ...quiz, id: (res as { name: string }).name });
      this.quizzesSubject.next([...this.quizzes]);
    }));
  }

  editQuiz(quiz: Quiz) {
    
    this.dataService.editQuiz(quiz).subscribe({
      next: (res) => {
        console.log(res);
        this.quizzes[this.quizzes.findIndex(q => q.id == quiz.id)] = quiz;
        this.quizzesSubject.next([...this.quizzes]);
      },
      error: (error) => {
        console.log(error);
      }});
   }

  deleteQuiz(id: string) {

    this.dataService.deleteQuiz(id).subscribe({
      next: (res) => {
        this.quizzes.splice(this.quizzes.findIndex(q => q.id == id), 1);
        this.quizzesSubject.next([...this.quizzes]);
      },
      error: (error) => {
        console.log(error);
      }});
  };

  // categories

  getQuizCategories() {
    return this.quizCategoriesSubject;
  }

  getQuizCategory(id: string): Observable<QuizCategory | null> {

    return this.quizCategoriesSubject.asObservable()
    .pipe(
      map(quizCategory => quizCategory.find(quizCategory => quizCategory.id === id) || null));

  }

  addCategory(category: QuizCategory) {

    console.log(category);

    this.dataService.addCategory(category).subscribe((res => {

      console.log(res);
      this.quizCategories.push({ ...category, id: (res as { name: string }).name });
      this.quizCategoriesSubject.next([...this.quizCategories]);
    }));
  }

  editCategory(category: QuizCategory) {
    
    this.dataService.editCategory(category).subscribe({
      next: (res) => {
        console.log(res);
        this.quizCategories[this.quizCategories.findIndex(c => c.id == category.id)] = category;
        this.quizCategoriesSubject.next([...this.quizCategories]);
      },
      error: (error) => {
        console.log(error);
      }});
   }

  deleteCategory(id: string) {

    this.dataService.deleteCategory(id).subscribe({
      next: (res) => {
        this.quizCategories.splice(this.quizCategories.findIndex(c => c.id == id), 1);
        this.quizCategoriesSubject.next([...this.quizCategories]);
      },
      error: (error) => {
        console.log(error);
      }});
    };


  // questions

  getAllQuestions() {
    return this.quizQuestionsSubject;
  }

  getQuizQuestions(id: string): Observable<Question[] | null> {

    return this.dataService.getQuizQuestions(id);
  }

  addQuestion(question: Question) {

    console.log(question);

    this.dataService.addQuestion(question).subscribe((res => {

      console.log(res);
      this.quizQuestions.push({ ...question, id: (res as { name: string }).name });
      this.quizQuestionsSubject.next([...this.quizQuestions]);
    }));
  }

  editQuestion(question: Question) {
    
    this.dataService.editQuestion(question).subscribe({
      next: (res) => {
        console.log(res);
        this.quizQuestions[this.quizQuestions.findIndex(q => q.id == question.id)] = question;
        this.quizQuestionsSubject.next([...this.quizQuestions]);
      },
      error: (error) => {
        console.log(error);
      }});
   }

  deleteQuestion(id: string) {

    this.dataService.deleteQuestion(id).subscribe({
      next: (res) => {
        this.quizQuestions.splice(this.quizQuestions.findIndex(q => q.id == id), 1);
        this.quizQuestionsSubject.next([...this.quizQuestions]);
      },
      error: (error) => {
        console.log(error);
      }});
  };

  addQuizResults(quizResults: QuizResults) {

    console.log(quizResults);

    this.dataService.addQuizResults(quizResults).subscribe({

      next: (response) => {

        if (response) {
          this.quizResults.push({ ...quizResults, id: (response as { name: string }).name });
          this.quizResultsSubject.next([...this.quizResults]);
        }
      },
      error: (error) => {
        console.error(error);
      }});

  };
  

}
