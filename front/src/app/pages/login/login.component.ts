import { HttpClient } from '@angular/common/http';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { TimerService } from 'src/app/services/auto-logout';
import { PostsService } from 'src/app/services/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  constructor(private http: HttpClient, private router: Router, private loginSErvice: PostsService ,private timerService:TimerService ) { }

  ngOnInit() {
  }
  ngOnDestroy() {
  }
  onLogin(loginForm: any) {

    const Data = {
      email: loginForm.email,
      password: loginForm.password
    }

    this.loginSErvice.login(Data).subscribe((data: any) => {

      this.router.navigate(['./dashboard'])
      this.loginSErvice.logginToken = data.token
     const newToken =  this.loginSErvice.logginToken
      localStorage.setItem("newToken",data.token)

      this.timerService.startTimer();

    })



  }

}
