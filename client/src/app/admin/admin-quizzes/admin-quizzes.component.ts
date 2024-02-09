import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable, Subscription, combineLatest, forkJoin, map, switchMap, take } from 'rxjs';
import { AssignedQuestion } from 'src/app/quiz/assigned-question.model';
import { Question } from 'src/app/quiz/question.model';
import { QuizCategory } from 'src/app/quiz/quiz-category.model';
import { Quiz } from 'src/app/quiz/quiz.model';
import { QuizService } from 'src/app/quiz/quiz.service';
import { ValidatorService } from 'src/app/shared/validator.service';

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

  assignedQuestions : AssignedQuestion[] = [];
  assignedQuestionsSubscription : Subscription | null = null;

  selectedQuiz : Quiz | null = null;
  quizForm! : FormGroup;
  questionsArray!: FormArray;

  mode : string = '';

  constructor(private fb : FormBuilder, private quizService: QuizService, private validatorService: ValidatorService) {}
 
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

    this.assignedQuestionsSubscription = this.quizService.getAssignedQuestions()
    .subscribe(assignedQuestions => {
      this.assignedQuestions = assignedQuestions; 
    });

    this.initForm();
  }

  initForm() {

    if (this.mode == 'add') {
      this.questionsArray = new FormArray([
        new FormControl('', Validators.required),
        new FormControl('', Validators.required),
        new FormControl('', Validators.required)
      ]);
    }
    else {
      this.questionsArray = this.fb.array([]);
    }

    this.quizForm = this.fb.group({
      'id' : new FormControl('', null),
      'title' : new FormControl('', Validators.required),
      'description' : new FormControl('', Validators.required),
      'category': new FormControl('', Validators.required),
      'timelimit' : new FormControl('', Validators.required),
      'questions': this.questionsArray
    });

    // this.quizForm.valueChanges.subscribe(values => {
    //   // Iterate over the form controls
    //   Object.keys(this.quizForm.controls).forEach(controlName => {
    //     const control = this.quizForm.get(controlName);
    //     if (control && !control.value) { // Check if control exists and its value is blank
    //       control.setValue(''); // Set the value to blank
    //     }
    //   });
    // });


  }

  updateForm(): void {

    this.questionsArray.clear();

    const asquestionIds = this.assignedQuestions
    .filter(asquestion => asquestion.quizId === this.selectedQuiz?.id)
    .map(asquestion => asquestion.questionId);

    const quizQuestions = this.quizQuestions.filter(question => asquestionIds.includes(question.id));

    quizQuestions
      .forEach(question =>
        this.questionsArray.push(new FormControl( question.text, Validators.required))
      );

    this.quizForm.patchValue({
      'id': this.selectedQuiz?.id,
      'title': this.selectedQuiz?.title,
      'description': this.selectedQuiz?.description,
      'category': this.selectedQuiz?.categoryName,
      'timelimit': this.selectedQuiz?.timelimit,
    });

  }

  getArrayControls() {
    return (<FormArray>this.quizForm.get('questions')).controls;
  }

  getErrorMessages(control: AbstractControl, patterns?: string[] | null, prefix?: string): string[] {
    return this.validatorService.generateErrorMsgs(control, patterns, prefix);
  }


  addQuestion() {
    this.questionsArray.push(new FormControl('', Validators.required));
  }

  removeQuestion(index: number) {
    this.questionsArray.removeAt(index);
  }

  addQuiz() {
    this.mode = 'add';
    this.initForm();
  }

  editQuiz(quiz: Quiz) {

    this.selectedQuiz = {...quiz};
    this.updateForm();
    this.mode = 'edit';
  }

  deleteQuiz(id: string) {

    this.quizService.deleteQuiz(id);
    this.assignedQuestions.forEach((asquestion: AssignedQuestion) => {

      if (asquestion.quizId == id) {
        this.quizService.deleteAssignedQuestion(asquestion.id);
      }
    });
  }

  onCancel() {
    this.mode = '';
    this.selectedQuiz = null;
  }

  onSubmit(){

    console.log(this.quizForm.value);

    const {category, questions, ...quiz} = this.quizForm.value;
    const selCategory = this.quizCategories.find(c => c.name === category);
    quiz.categoryId = selCategory ? selCategory.id : '';
    quiz.timestamp = new Date();

    const questionsIds = questions.map((question: string) => {
      const foundQuestion = this.quizQuestions.find(q => q.text === question);
      return foundQuestion ? foundQuestion.id : '';
    });

    if (this.mode === 'add') {

      const {id, ...quizMod} = quiz;

      this.quizService.addQuiz(quizMod);

      this.quizService.quizzesSubject.pipe(take(1)).subscribe(quizzes => {
        const addedQuiz = quizzes.reduce((prevTs, curTs) => {
          return prevTs > curTs ? prevTs : curTs;
        });

        if (addedQuiz) {
          questionsIds.forEach((questionId: string) => {
            this.quizService.addAssignedQuestion({ quizId: addedQuiz.id, questionId: questionId } as AssignedQuestion);
          });
        }
      });
      
      // this.quizService.addQuiz(quizMod).subscribe(newId => {
      //   const addedQuiz: Quiz = { id: newId, ...quizMod };
      
      //   questionsIds.forEach((questionId: string) => {
      //     this.quizService.addAssignedQuestion({ quizId: addedQuiz.id, questionId: questionId } as AssignedQuestion);
      //   });
      // });

    } 
    else if (this.mode === 'edit') {
      
      this.quizService.editQuiz(quiz);

      const asQuestions = this.assignedQuestions.filter(asQuestion => asQuestion.quizId === quiz.id);
      asQuestions.forEach(asQuestion => {

        if (!questionsIds.some((id : string) => id === asQuestion.questionId))
          this.quizService.deleteAssignedQuestion(asQuestion.id);
        }
      );

      questionsIds.forEach((questionId: string) => {
        const assignedQuestion = this.assignedQuestions.find(asQuestion => asQuestion.quizId === quiz.id && asQuestion.questionId === questionId);
      
        if (assignedQuestion) {
          assignedQuestion.questionId = questionId;
          this.quizService.editAssignedQuestion(assignedQuestion);
        }
        else  {
          this.quizService.addAssignedQuestion({ quizId: quiz.id, questionId: questionId } as AssignedQuestion);
        }
      });
  
    }
    this.onCancel();
  }

  getQuestionsCount(id: string): Observable<number> {
    return this.quizService.assignedQuestionsSubject.pipe(
      map(questions => (questions ? questions.filter(question => question.quizId === id).length : 0))
    );
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
    if (this.assignedQuestionsSubscription) {
      this.assignedQuestionsSubscription.unsubscribe();
    }
  }

}
