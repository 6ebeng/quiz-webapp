import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { BehaviorSubject, Observable, Subscription, filter, map } from 'rxjs';
import { QuizCategory } from 'src/app/quiz/quiz-category.model';
import { Quiz } from 'src/app/quiz/quiz.model';
import { QuizService } from 'src/app/quiz/quiz.service';

@Component({
  selector: 'app-admin-categories',
  templateUrl: './admin-categories.component.html',
  styleUrls: ['../admin.css']
})
export class AdminCategoriesComponent implements OnInit, OnDestroy  {

  categories : QuizCategory[] = [];
  categoriesSubscription : Subscription | null = null;

  selectedCategory : QuizCategory | null = null;
  categoryForm! : FormGroup;
  mode : string = '';

  constructor(private quizService: QuizService, private fb : FormBuilder) {}

  ngOnInit() {

    this.categoriesSubscription = this.quizService.getQuizCategories()
    .subscribe(categories => {
      this.categories = categories; 
    });

    this.initForm();

  }

  initForm() {
  
    this.categoryForm = this.fb.group({
      'id' : new FormControl('', null),
      'name' : new FormControl('', null),
      'description': new FormControl('', null)
    });
  }

  updateForm(): void {

    if (this.selectedCategory) {

      this.categoryForm.patchValue({
        'id': this.selectedCategory?.id,
        'name': this.selectedCategory?.name,
        'description': this.selectedCategory?.description
      });

    }
  }

  isCategoryAssigned(id: string): Observable<boolean> {
    return this.quizService.getQuizzes().pipe(
      map(quizzes => quizzes.some(quiz => quiz.categoryId === id))
    );
  }


  getCategoryTooltip(id: string): Observable<string> {
    return this.quizService.getQuizzes().pipe(
      map(quizzes => {
        const matches = quizzes.filter(quiz => quiz.categoryId === id);
        const names = matches.map(quiz => quiz.title).join(', ');
  
        return names ? 'Unable to delete. Remove from ' +  (matches.length > 1 ? 
          'quizzes: ' : 'quiz: ') + names : '';
      }),
    );
  }

  addCategory() {
    this.initForm();
    this.mode = 'add';
  }

  editCategory(category: QuizCategory) {
    this.selectedCategory = {...category};
    this.updateForm();    
    this.mode = 'edit';
  }

  deleteCategory(id: string) {
    this.quizService.deleteCategory(id);
  }

  onCancel() {
    this.mode = '';
    this.selectedCategory = null;
  }

  onSubmit(){

    if (this.mode === 'add') {
      const { id, ...category} = this.categoryForm.value;
      this.quizService.addCategory(category);
    } 
    else if (this.mode === 'edit') {
      this.quizService.editCategory({...this.categoryForm.value});
    }
    this.onCancel();
  }

  ngOnDestroy() {

    if (this.categoriesSubscription) {
      this.categoriesSubscription.unsubscribe();
    }

  }


}
