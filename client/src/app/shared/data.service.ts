import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, throwError } from 'rxjs';
import { User } from '../users/user.model';
import { Quiz } from '../quiz/quiz.model';
import { QuizCategory } from '../quiz/quiz-category.model';
import { Question } from '../quiz/question.model';
import { QuizResults } from '../quiz/quiz-results.model';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private http: HttpClient) {}

  private baseURL = 'https://quiz-b1177-default-rtdb.europe-west1.firebasedatabase.app';

  private handleError(error: any) {
    console.error('Error: ', error);
    return throwError(() => new Error ("An error occurred while performing HttpClient request."));
  }

  // users

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

  isRegisteredUsername(username: string): Observable<boolean> {
    return this.getUsers().pipe(
      map(users => {
          return users.find(user => user.username === username) ? true : false;
        }),
      catchError(this.handleError)
    );
  }

  addUser(user: User) {
    return this.http.post(this.baseURL + '/user.json', user);
  }

  editUser(user: User) {
    const { id, ...modUser } = user;
    return this.http.patch(this.baseURL + `/user/${user.id}/` + '.json', modUser);  
  }


  // quizzes

  getQuizzes(): Observable<Quiz[]> {
    return this.http.get(this.baseURL + '/quiz.json')
    .pipe(
      map(quizzes => {
        return Object.entries(quizzes).map(([key, value]) => ({...value, id: key}));
      }),
      catchError(this.handleError)
    );
  }

  addQuiz(quiz: Quiz) {
    return this.http.post(this.baseURL + '/quiz.json', quiz);
  }

  editQuiz(quiz: Quiz) {
    return this.http.patch(this.baseURL + `/quiz/${quiz.id}/` + '.json', quiz);
  }

  deleteQuiz(id: string) {
    return this.http.delete(this.baseURL + `/quiz/${id}.json`);

  }
  // questions

  getQuizQuestions(id: string): Observable<Question[]> {
    return this.http.get(this.baseURL + '/question.json')
      .pipe(
        map(questions => {
          const mappedQuestions: Question[] = Object.entries(questions).map(([key, value]) => ({ ...value, id: key }));
   
          return mappedQuestions.filter(question => { return question.quizId === id});
        }),
        catchError(this.handleError)
      );
  }

  getAllQuestions(): Observable<Question[]> {
    return this.http.get(this.baseURL + '/question.json')
    .pipe(
      map(question => {
        return Object.entries(question).map(([key, value]) => ({...value, id: key}));
      }),
      catchError(this.handleError)
    );
  }

  addQuestion(question: Question) {
    return this.http.post(this.baseURL + '/question.json', question);
  }

  editQuestion(question: Question) {
    const { id, ...modQuestion } = question;
    return this.http.patch(this.baseURL + `/question/${question.id}/` + '.json', modQuestion);  
  }

  deleteQuestion(id: String) {
    return this.http.delete(this.baseURL + `/question/${id}.json`);
  }

  // categories
  
  getQuizCategories(): Observable<QuizCategory[]> {
    return this.http.get(this.baseURL + '/category.json')
    .pipe(
      map(categories => {
        return Object.entries(categories).map(([key, value]) => ({...value, id: key}));
      }),
      catchError(this.handleError)
    );
  }

  addCategory(category: QuizCategory) {
    return this.http.post(this.baseURL + '/category.json', category);
  }

  editCategory(category: QuizCategory) {
    const { id, ...modCategory } = category;
    return this.http.patch(this.baseURL + `/category/${category.id}/` + '.json', modCategory);  
  }

  deleteCategory(id: String) {
    return this.http.delete(this.baseURL + `/category/${id}.json`);
  }


  // results
  addQuizResults(quizResults: QuizResults) {
    const { id, ...results } = quizResults;
    return this.http.post(this.baseURL + '/quiz-results.json', results);
  }



}
