import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { BehaviorSubject, Subscription } from 'rxjs';
import { Question } from 'src/app/quiz/question.model';
import { QuizService } from 'src/app/quiz/quiz.service';

@Component({
  selector: 'app-admin-questions',
  templateUrl: './admin-questions.component.html',
  styleUrls: ['./admin-questions.component.css']
})

export class AdminQuestionsComponent implements OnInit, OnDestroy {

  questions : Question[] = [];
  questionsSubject : BehaviorSubject<Question[]> | null = null;
  questionsSubscription : Subscription | null = null;

  selectedQuestion : Question | null = null;
  questionForm! : FormGroup;
  optionsArray!: FormArray;
  mode : string = '';

  constructor(private quizService: QuizService, private fb : FormBuilder) {}

  ngOnInit() {
    this.questionsSubject = this.quizService.getAllQuestions();
    this.questionsSubscription = this.questionsSubject.subscribe(quizQuestions => {
      this.questions = quizQuestions; 
    });

    this.initForm();

  }

  initForm() {
    this.optionsArray = new FormArray([
      new FormControl(),
      new FormControl(),
      new FormControl()
    ]);

    this.questionForm = this.fb.group({
      'id' : new FormControl('', null),
      'text' : new FormControl('', null),
      'options': this.optionsArray,
      'answer' : new FormControl('', null)
    });
  }

  updateForm(): void {

    if (this.selectedQuestion) {

      this.questionForm.patchValue({
        'id': this.selectedQuestion?.id,
        'text': this.selectedQuestion?.text,
        'answer': this.selectedQuestion?.answer
      });

      this.optionsArray.clear();

      this.selectedQuestion.options.forEach((option) => {
        this.optionsArray.push(new FormControl(option));
      });
    }

  }
  
  addQuestion() {
    this.initForm();
    this.mode = 'add';
  }

  editQuestion(question: Question) {
    
    this.selectedQuestion = {...question};
    this.updateForm();    
    this.mode = 'edit';
  }

  deleteQuestion(id: string) {

    this.quizService.deleteQuestion(id);
  }

  onCancel() {
    this.mode = '';
    this.selectedQuestion = null;
  }

  onSubmit(){

    if (this.mode === 'add') {
      const { id, ...question} = this.questionForm.value;
      question.timestamp = new Date();
      question.quizId = ''; 

      this.quizService.addQuestion(question);
    } 
    else if (this.mode === 'edit') {
      this.quizService.editQuestion({...this.questionForm.value, timestamp: new Date()});
    }
    this.onCancel();
  }

  ngOnDestroy() {

    if (this.questionsSubscription) {
      this.questionsSubscription.unsubscribe();
    }
  }


}
