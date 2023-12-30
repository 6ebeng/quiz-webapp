import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { QuizService } from '../quiz.service';
import { Quiz } from '../quiz.model';
import { BehaviorSubject, Observable, Subscription, of } from 'rxjs';
import { Question } from '../question.model';
import { User } from 'src/app/users/user.model';
import { AuthService } from 'src/app/shared/auth.service';
import { UserQuiz } from '../user-quiz.model';

@Component({
  selector: 'app-quiz-detail',
  templateUrl: './quiz-detail.component.html',
  styleUrls: ['./quiz-detail.component.css']
})
export class QuizDetailComponent implements OnInit, OnDestroy {

  id: string = '';

  quiz: Quiz = new Quiz();
  quizSubscription: Subscription | null = null;

  questionIndex : number = 0;
  quizQuestions : Question[] = [];
  questionsSubscription: Subscription | null = null;

  user: User = new User();
  userSubject : BehaviorSubject<User> | null = null;
  userSubscription : Subscription | null = null;

  timeLeft: number = 0; 
  timer: any;
  quizCompleted : boolean = false;
  quizStats: UserQuiz = new UserQuiz();

  constructor(private activatedRoute: ActivatedRoute, private quizService: QuizService, private authService: AuthService) {}

  ngOnInit() {

    this.activatedRoute.params.subscribe((data) => {
      this.id = data['quizid'];
    });

    // this.quizService.getQuiz(this.id)
    //   .subscribe(
    //     quiz => { this.quiz = quiz;

    //     const storedTimeLeft = sessionStorage.getItem('timeLeft');
       
    //     if (storedTimeLeft) {
    //       this.timeLeft = parseInt(storedTimeLeft);
    //     }
    //     else {
    //       this.timeLeft = this.quiz?.timelimit! * 60
    //     }
            
    //     this.startTimer();
    // });

  
    this.quizSubscription = this.quizService.getQuiz(this.id).subscribe({
      next: (quiz) => {

        if (quiz) {
          this.quiz = quiz;
        }
        const timeLeftStorage = sessionStorage.getItem('timeLeft');
    
        if (timeLeftStorage) {
          this.timeLeft = parseInt(timeLeftStorage);
        } else if (this.quiz) {
            this.timeLeft = this.quiz.timelimit * 60;
        }
    
      },
      error: (error) => {
        console.log(error);
      }});

      this.questionsSubscription = this.quizService.getQuizQuestions(this.id).subscribe({
        next: (questions) => {
  
          if (questions) {
            this.quizQuestions = questions;
          }
          console.log(this.quizQuestions);
            
          this.startTimer();
        },
        error: (error) => {
          console.log(error);
        }});


      this.userSubject = this.authService.getUser();
      this.userSubscription = this.userSubject.subscribe(user => {
        this.user = user;
      });

    // this.questionsSubscription = this.quizService.getQuizQuestions(this.id).subscribe({
    //   next: (questions) => {

    //     this.quizQuestions = questions;
    //     console.log(this.quizQuestions);
          
    //     this.startTimer();
    //   },
    //   error: (error) => {
    //     console.log(error);
    //   }});
  
  }

  startTimer() {

    this.timer = setInterval(() => {
      if (this.timeLeft > 0) {
        this.timeLeft--;
        sessionStorage.setItem('timeLeft', this.timeLeft.toString());
      } else {
        // this.quizCompleted = true;
        sessionStorage.removeItem("timeLeft");
        clearInterval(this.timer);
      }
    }, 1000); 
  }

  formatTime(seconds: number): string {
    const minutes: number = Math.floor(seconds / 60);
    const remainingSeconds: number = seconds % 60;
    return `${this.padNumber(minutes)}:${this.padNumber(remainingSeconds)}`;
  }
  
  padNumber(value: number): string {
    return value < 10 ? `0${value}` : `${value}`;
  }

  @HostListener('window:beforeunload', ['$event'])
  unloadHandler(event: Event): void {
    sessionStorage.setItem('timeLeft', this.timeLeft.toString());
  }

  onNextQuestion(quizStats: UserQuiz){
    if (this.questionIndex < this.quizQuestions.length - 1) {
      this.questionIndex++;
    }
    else {
      this.quizCompleted = true;
      this.quizStats = quizStats;
    }
  }

  onQuitEvent(quizStats: UserQuiz){
    this.quizCompleted = true;
    this.quizStats = quizStats;
  
  }
  
  ngOnDestroy() {

    if (this.quizSubscription) {
      this.quizSubscription.unsubscribe();
    }

    if (this.questionsSubscription) {
      this.questionsSubscription.unsubscribe();
    }

    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }

    clearInterval(this.timer);
    sessionStorage.removeItem('timeLeft');
  }

}
