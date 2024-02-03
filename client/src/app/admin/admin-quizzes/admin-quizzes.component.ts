import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Observable, Subscription, combineLatest, forkJoin, map } from 'rxjs';
import { Question } from 'src/app/quiz/question.model';
import { QuizCategory } from 'src/app/quiz/quiz-category.model';
import { Quiz } from 'src/app/quiz/quiz.model';
import { QuizService } from 'src/app/quiz/quiz.service';

@Component({
  selector: 'app-admin-quizzes',
  templateUrl: './admin-quizzes.component.html',
  styleUrls: ['./admin-quizzes.component.css']
})
export class AdminQuizzesComponent implements OnInit, OnDestroy {

  quizzes : Quiz[] = [];
  quizzesSubscription : Subscription | null = null;

  quizCategories : QuizCategory[] = [];
  quizCategoriesSubscription : Subscription | null = null;

  quizQuestions : Question[] = [];
  quizQuestionsSubscription : Subscription | null = null;

  selectedQuiz : Quiz | null = null;
  quizForm! : FormGroup;
  questionsArray!: FormArray;
  categoriesArray!: FormArray;
  mode : string = '';

  constructor(private quizService: QuizService, private fb : FormBuilder) {}
 
  ngOnInit() {

    this.quizzesSubscription = this.quizService.getQuizzes()
    .subscribe(quizzes => {
      this.quizzes = quizzes;
    });

    this.quizCategoriesSubscription = this.quizService.getQuizCategories()
    .subscribe(quizCategories => {
      this.quizCategories = quizCategories; 
    });

    this.quizQuestionsSubscription = this.quizService.getAllQuestions()
    .subscribe(quizQuestions => {
      this.quizQuestions = quizQuestions; 
    });

    this.initForm();
  }


  initForm() {
    this.categoriesArray = this.fb.array([]);
    this.questionsArray = this.fb.array([]);

    this.quizForm = this.fb.group({
      'id' : new FormControl('', null),
      'title' : new FormControl('', null),
      'description' : new FormControl('', null),
      'categories': this.categoriesArray,
      'timelimit' : new FormControl('', null),
      'questions': this.questionsArray
    });
  }

  updateForm(): void {

    // if (this.selectedQuiz) {

      this.categoriesArray.clear();
      this.questionsArray.clear();

      this.quizCategories.forEach(category =>
        this.categoriesArray.push(this.fb.control(category.name))
      );
  
      this.quizQuestions
        .filter(question => question.quizId === this.selectedQuiz?.id)
        .forEach(question =>
          this.questionsArray.push(this.fb.control(question.text))
        );

      this.quizForm.patchValue({
        'id': this.selectedQuiz?.id,
        'title': this.selectedQuiz?.title,
        'description': this.selectedQuiz?.description,
        'timelimit': this.selectedQuiz?.timelimit,
      });
    // }
  }

  addQuiz() {
    this.updateForm();
    this.mode = 'add';
  }

  editQuiz(quiz: Quiz) {

    this.selectedQuiz = {...quiz};
    this.updateForm();
 
    this.mode = 'edit';
  }

  deleteQuiz(id: string) {
    this.quizService.deleteQuiz(id);
  }

  onCancel() {
    this.mode = '';
    this.selectedQuiz = null;
  }

  onSubmit(){
    if (this.mode === 'add') {
      const { id, ...quiz} = this.quizForm.value;
      quiz.timestamp = new Date();
      // question.quizId = ''; 

      this.quizService.addQuiz(quiz);
    } 
    else if (this.mode === 'edit') {
      this.quizService.editQuiz({...this.quizForm.value, timestamp: new Date()});
    }
    this.onCancel();
  }

    // async!!
    getQuestionsCount(id: string) {

      let count = 0;
  
      this.quizQuestions.forEach(question => { 
        if (question.quizId === id) {
          count++;
        }
      })
      return count;
    }
  
    getCategoryImage(id: string): Observable<string> {
  
      return this.quizService.getQuizCategory(id)
        .pipe(
          map(category => {
            const path : string = "../../../assets/";
            return category?.image ? path + "light-" + category.image : "";
          })
        )
    }
  
  


  ngOnDestroy() {

    if (this.quizzesSubscription) {
      this.quizzesSubscription.unsubscribe();
    }
    if (this.quizCategoriesSubscription) {
      this.quizCategoriesSubscription.unsubscribe();
    }
    if (this.quizQuestionsSubscription) {
      this.quizQuestionsSubscription.unsubscribe();
    }

  }

}
