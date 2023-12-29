import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, forkJoin, map, throwError } from 'rxjs';
import { User } from '../users/user.model';
import { Quiz } from '../quiz/quiz.model';
import { QuizCategory } from '../quiz/quiz-category.model';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private http: HttpClient) {}

  baseURL = 'https://quiz-b1177-default-rtdb.europe-west1.firebasedatabase.app';

  private handleError(error: any) {
    console.error('Error: ', error);
    return throwError(() => new Error ("An error occurred while performing HttpClient request."));
  }

  getUsers(): Observable<User[]> {
    return this.http.get(this.baseURL + '/user.json')
      .pipe(
        map(users => {         
          return Object.entries(users).map(([key, value]) => ({...value, id: key}));
        }),
        catchError(this.handleError)
      );
  }

  getUser(username: string, password: string): Observable<User | undefined> {
    return this.getUsers().pipe(
      map(users => users.find(user => user.username === username && user.password === password)),
      catchError(this.handleError)
    );
  }

  isRegistered(username: string): Observable<boolean> {
    return this.getUsers().pipe(
      map(users => {
          return users.find(user => user.username === username) ? true : false;
        }),
      catchError(this.handleError)
    );
  }

  getQuizzesWithCategories(): Observable<Quiz[]> {
    return forkJoin([
      this.getQuizzes(),
      this.getQuizCategories()
    ]).pipe(
      map(([quizzes, categories]) => {
  
        return quizzes.map(quiz => {

          const category = categories.find(cat => cat.id === quiz.categoryId);
          console.log(category);
          
          return { ...quiz, categoryName: category?.name } as Quiz;
        });
      })
    );
  }

  getQuizzes(): Observable<Quiz[]> {
    
    return this.http.get(this.baseURL + '/quiz.json')
    .pipe(
      map(quizzes => {
        return Object.entries(quizzes).map(([key, value]) => ({...value, id: key}));
      }),
      catchError(this.handleError)
    );
  }

  // getQuiz(id: string): Observable<Quiz | undefined> {
  //   return this.getQuizzes().pipe(
  //     map(quizzes => {
  //       return quizzes.find(quiz => quiz.id === id);
  //     }),
  //     catchError(this.handleError)
  //   );
  // }

  getQuizCategories(): Observable<QuizCategory[]> {
    return this.http.get(this.baseURL + '/category.json')
    .pipe(
      map(categories => {
        return Object.entries(categories).map(([key, value]) => ({...value, id: key}));
      }),
      catchError(this.handleError)
    );
  }

  addUser(user: User) {
    return this.http.post(this.baseURL + '/user.json', user);
  }

  editUser(user: User) {
    const { id, ...dbUser } = user;
    return this.http.patch(this.baseURL + `/user/${user.id}/` + '.json', dbUser);  }

  addQuiz(quiz: Quiz) {
    return this.http.post(this.baseURL + '/quiz.json', quiz);
  }

  editQuiz(quiz: Quiz) {
    return this.http.patch(this.baseURL + `/quiz/${quiz.id}/` + '.json', quiz);
  }

  deleteQuiz(id: string) {
    return this.http.delete(this.baseURL + `/quiz/${id}.json`);

  }

}
