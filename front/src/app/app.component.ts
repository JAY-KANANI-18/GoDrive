import { Component, SimpleChanges } from '@angular/core';
import { TimerService } from './services/auto-logout';
import { PostsService } from './services/login.service';
import { Router } from '@angular/router';
import { AngularFireMessaging } from '@angular/fire/compat/messaging';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'argon-dashboard-angular';
  constructor(private timerService:TimerService,private postsService:PostsService,private router:Router,private messaging: AngularFireMessaging){
    this.messaging.requestPermission.subscribe({
      next:(data:any)=>{
        console.log('permission granted!');
      },error:(error)=>{
        console.log('permission denied');
      }
    })

  }
  ngOnInit(): void {
    // this.timerService.startTimer();

//     this.postsService.authCheck().subscribe((data:boolean)=>{
// if(data==true){
//   this.router.navigate(["/dashboard"])

// }
// this.router.navigate(["/login"])
//    })



  }
  ngOnChanges(changes: SimpleChanges): void {
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.

  }

}
