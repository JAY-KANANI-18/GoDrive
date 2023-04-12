import { Injectable } from '@angular/core';
import { BehaviorSubject, fromEvent, Observable, timer } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { PostsService } from './login.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class TimerService {
  private resetTimer$ = new BehaviorSubject(null);
  resetTimerObservable$: Observable<any> = this.resetTimer$.asObservable();

  constructor(private postsService:PostsService,private router:Router ) {}
  timer = 0

  startTimer(): any {
    this.timer=0
   const jay = setInterval(()=>{
      this.timer++

      console.log(this.timer);
      fromEvent(document, 'mousemove').subscribe(() => this.timer = 0);
      fromEvent(document, 'click').subscribe(() => this.timer = 0);
      fromEvent(document, 'keypress').subscribe(() => this.timer = 0);
      fromEvent(document, 'dblclick').subscribe(() => this.timer = 0);
      fromEvent(document, 'mouseenter').subscribe(() => this.timer = 0);
      fromEvent(document, 'mouseleave').subscribe(() => this.timer = 0);
      fromEvent(document, 'keydown').subscribe(() => this.timer = 0);
      fromEvent(document, 'scroll').subscribe(() => this.timer = 0);
      fromEvent(document, 'touchstart').subscribe(() => this.timer = 0);
      fromEvent(document, 'touchend').subscribe(() => this.timer = 0);
      fromEvent(document, 'touchmove').subscribe(() => this.timer = 0);
      fromEvent(document, 'resize').subscribe(() => this.timer = 0);
      if(this.timer >= 1000){
        this.postsService.logginToken = null
        this.router.navigate(['./login'])
        clearInterval(jay)
        return
      }



    },1000)
    return
    // Reset timer on user interaction
  }



}
