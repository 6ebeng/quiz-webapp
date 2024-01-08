import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { AdminQuizzesComponent } from './admin-quizzes/admin-quizzes.component';
import { AdminUsersComponent } from './admin-users/admin-users.component';
import { AdminQuestionsComponent } from './admin-questions/admin-questions.component';

// const routes: Routes = [
//   {path: '', component: AdminDashboardComponent},
//   {path: 'quizzes', component: AdminQuizzesComponent},
//   {path: 'users', component: AdminUsersComponent}
// ];


const routes: Routes = [
  {
    path: '', component: AdminDashboardComponent,
    children: [
      { path: 'quizzes', component: AdminQuizzesComponent },
      { path: 'questions', component: AdminQuestionsComponent },
      { path: 'questions', component: AdminQuestionsComponent },
      { path: 'users', component: AdminUsersComponent },

      { path: '**', redirectTo: '', pathMatch: 'full' }
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
