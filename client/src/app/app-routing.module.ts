import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthenticationGuard } from './auth.guard';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { WelcomePageComponent } from './welcome-page/welcome-page.component';

const routes : Routes = [
  {path:'quiz', loadChildren:  () => import('./quiz/quiz.module').then(m => m.QuizModule), data: {preload: true}},
  {path:'leaderboard', loadChildren:  () => import('./leaderboard/leaderboard.module').then(m => m.LeaderboardModule)},
  {path:'user', loadChildren:  () => import('./users/users.module').then(m => m.UsersModule), canActivate:[AuthenticationGuard] },
  {path:'admin', loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule), canActivate:[AuthenticationGuard]},
  {path:'auth', loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)},
  {path: '', pathMatch: 'full', component: WelcomePageComponent},
  {path: '**', pathMatch: 'full', component: PageNotFoundComponent }
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
