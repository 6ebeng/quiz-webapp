import { Component } from '@angular/core';
import { Subscription, combineLatest, forkJoin, skip, switchMap, take } from 'rxjs';
import { QuizResults } from 'src/app/quiz/quiz-results.model';
import { QuizService } from 'src/app/quiz/quiz.service';
import { AuthService } from 'src/app/shared/auth.service';
import { UserService } from 'src/app/shared/user.service';
import { User } from 'src/app/users/user.model';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.css']
})
export class LeaderboardComponent {

  user: User = new User();
  userSubscription : Subscription | null = null;

  users: User[] = [];
  usersSubscription : Subscription | null = null;

  quizResults : QuizResults[] = [];
  quizResultsSubscription : Subscription | null = null;

  imgDir : string = environment.API_URL + '/uploads/';
  defaultImg : string = '../../../assets/avatar.png';

  constructor(private authService: AuthService, private userService: UserService, private quizService: QuizService){}

  ngOnInit(): void {

    this.userSubscription = this.authService.getUser().subscribe(user => {
      this.user = user;
    });

    combineLatest([
      this.userService.getUsers(),
      this.quizService.getQuizResults()
    ]).subscribe({
      next: ([users, quizResults]) => {
        this.users = users;
        this.quizResults = quizResults;
    
        users.forEach(user => {
          const userQuizResults = quizResults.filter(result => result.userId === user.id);
          let totalQuizzes = 0;
          let totalScore = 0;
          let totalQuestions = 0;
    
          userQuizResults.forEach(result => {
            totalQuizzes++;
            totalScore += result.score;
            totalQuestions += result.totalQuestions;
          });
    
          const averageScore = totalQuizzes > 0 ? (totalScore / totalQuestions) * 100 : 0;

          user.quizzes = totalQuizzes;
          user.questions = totalQuestions;
          user.score = totalScore;
          user.averageScore = parseFloat((averageScore).toFixed(2));
        });
    
      },
      error: (error) => {
        console.error(error);
      }
    });


    // forkJoin({
    //   users: this.userService.getUsers().asObservable().pipe(take(1)),
    //   quizResults: this.quizService.getQuizResults().asObservable().pipe(take(1)),
    // }).subscribe({
    //   next: ({ users, quizResults }) => {

        
    // console.log("test");

    //     this.users = users;
    //     this.quizResults = quizResults;

    //     users.forEach(user => {
    //       const userQuizResults = quizResults.filter(result => result.userId === user.id);
    //       let totalQuizzes = 0;
    //       let totalScore = 0;
    //       let totalQuestions = 0;
    
    //       userQuizResults.forEach(result => {
    //         totalQuizzes++;
    //         totalScore += result.score;
    //         totalQuestions += result.totalQuestions;
    //       });
    
    //       const averageScore = totalQuizzes > 0 ? (totalScore / totalQuestions) * 100 : 0;
    
    //       user.quizzes = totalQuizzes;
    //       user.questions = totalQuestions;
    //       user.score = totalScore;
    //       user.averageScore = averageScore;
    //     });
    //   },
    //   error: (error) => {
    //     console.error('Error fetching users or quiz results:', error);
    //   }
    // });
  }

  ngOnDestroy() {

    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }

    if (this.usersSubscription) {
      this.usersSubscription.unsubscribe();
    }

    if (this.quizResultsSubscription) {
      this.quizResultsSubscription.unsubscribe();
    }
 
  }

}
