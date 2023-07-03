import { Injectable } from "@angular/core";
import {
  HttpClient,
  HttpHeaders,

} from "@angular/common/http";
import { Subject } from "rxjs";
import { Router } from "@angular/router";
import { AES } from "crypto-js";
import { CookieService } from "ngx-cookie-service";
import * as CryptoJS from "crypto-js";
import { ToastrService } from "ngx-toastr";
import { environment } from "src/environments/environment";

// import { Post } from './post.model';

@Injectable({ providedIn: "root" })
export class PostsService {
  private encryptionKey = "user123";

  error = new Subject<string>();

  constructor(
    private http: HttpClient,
    private router: Router,
    private cookieService: CookieService,
    private toster: ToastrService
  ) {}
  logginToken: any = false;

  createAndStorePost(data: any) {
    const Data: any = {
      name: data.name,
      email: data.email,
      password: data.password,
    };
    console.log(data);

    return this.http.post(`${environment.URL}/login`, Data);
  }

  logOut() {
    this.logginToken = null;

    const token = localStorage.getItem("newToken");
    const user = localStorage.getItem("User");

    const dtoken = localStorage.removeItem("newToken");
    const duser = localStorage.removeItem("User");

    this.router.navigate(["./login"]);
    console.log(dtoken);
     this.http.post(`${environment.URL}/users/logout`, {token,user}).subscribe({
      next:(data:any)=>{
        console.log(data);
        this.toster.success(data.msg)
      },error:(error)=>{
        console.log(error);
        this.toster.error(error.error.msg)
      }
     });

  }

  login(data: any) {
    const Data: any = { email: data.email, password: data.password };

    console.log(data);
    return this.http.post(`${environment.URL}/users/login`, Data);
  }
  autoLogout() {
    let encryptedData = this.cookieService.get("myEncryptedData");
    if (encryptedData) {
      const decryptedData = AES.decrypt(
        encryptedData,
        this.encryptionKey
      ).toString(CryptoJS.enc.Utf8);

      if ((new Date().getTime() - +decryptedData) / 1000 > 10 * 60 ) {
        console.log("time to log out");

        this.logOut();
      }
    }
    const data = new Date().getTime().toString();
    encryptedData = AES.encrypt(data, this.encryptionKey).toString();
    this.cookieService.set("myEncryptedData", encryptedData);
  }

  isAuthenticated() {
    const promise = new Promise((resolve, reject) => {
      const token = localStorage.getItem("newToken");
      if (!token) this.router.navigate(["/login"]);
      console.log("front request auth token", token);
      this.http
        .get(`${environment.URL}/auth`, {
          headers: new HttpHeaders({ Authorization: token }),
        })
        .subscribe({
          next: (data: any) => {
            if (data == true) {
              this.logginToken = true;
            }
          },
          error: (error) => {
            console.log(error);
            this.logOut();
          },
        });

      //   (data)=>{

      // })

      resolve(this.logginToken);
    });
    return promise;
  }


}
