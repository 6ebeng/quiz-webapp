import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { AdminQuizzesComponent } from './admin-quizzes/admin-quizzes.component';
import { AdminUsersComponent } from './admin-users/admin-users.component';
import { AdminQuestionsComponent } from './admin-questions/admin-questions.component';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [
    AdminDashboardComponent,
    AdminQuizzesComponent,
    AdminUsersComponent,
    AdminQuestionsComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    SharedModule
  ]
})
export class AdminModule { }
