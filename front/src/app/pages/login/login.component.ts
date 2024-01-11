import { HttpClient } from "@angular/common/http";
import { Component, OnInit, OnDestroy } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { PostsService } from "src/app/services/login.service";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})
export class LoginComponent implements OnInit {
  constructor(
    private http: HttpClient,
    private router: Router,
    private loginSErvice: PostsService
,
private toster: ToastrService,
) {}

  public Errmsg: any;
  public LoginForm: FormGroup;
  ngOnInit() {
    this.LoginForm = new FormGroup({
      email: new FormControl(null, [Validators.required,Validators.email]),
      password: new FormControl(null, [Validators.required]),
    });

  }
  onLogin() {
    this.LoginForm.markAllAsTouched();

    if (this.LoginForm.invalid) {
      return;
    }
    let loginForm = this.LoginForm.value;

    const Data = {
      email: loginForm.email,
      password: loginForm.password,
    };

    this.loginSErvice.login(Data).subscribe({
      next: (data: any) => {
        this.toster.success(data.msg)
        this.router.navigate(["./dashboard"]);
        this.loginSErvice.logginToken = data.token;
        const newToken = this.loginSErvice.logginToken;
        localStorage.setItem("newToken", data.token);
        localStorage.setItem("User", data.user._id);
        localStorage.setItem("UserObj", JSON.stringify(data.user));
        this.loginSErvice.userData = data.user._id
      },
      error: (error) => {
        console.log(error);
        localStorage.setItem("newToken", '');
        localStorage.setItem("User", '');
        this.loginSErvice.userData = ''
        if (error.status == 401) {
          this.toster.error(error.error.message)
          // this.Errmsg = error.error;
        }
      },
    });

  }
}
