import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpHeaders,
  HttpParams,
  HttpEventType
} from '@angular/common/http';
import { map, catchError, tap } from 'rxjs/operators';
import { Subject, throwError } from 'rxjs';
import { Router } from '@angular/router';

// import { Post } from './post.model';

@Injectable({ providedIn: 'root' })



export class PostsService {
  error = new Subject<string>();

  constructor(private http: HttpClient, private router: Router) { }
  logginToken:any = false



  createAndStorePost(data: any) {
    const Data: any = { name: data.name, email: data.email, password: data.password };

    return this.http.post('http://localhost:3000/login', Data)

  }
  logOut() {
    this.logginToken = null
    const token = localStorage.removeItem("newToken")

    this.router.navigate(['./login'])
  }


  login(data: any) {
    const Data: any = { email: data.email, password: data.password };

    // let searchParams = new HttpParams();
    // searchParams = searchParams.append('print', 'pretty');
    // searchParams = searchParams.append('custom', 'key');
    localStorage.setItem(this.logginToken, data.token)
    return this.http.post('http://localhost:3000/users/login', Data)



  }

  isAuthenticated() {
    const promise = new Promise((resolve, reject) => {
      const token = localStorage.getItem("newToken")
      if(!token) this.router.navigate(['/login'])
      console.log("front request auth token", token);
      this.http.get('http://localhost:3000/auth', {
        headers: new HttpHeaders({ 'Authorization': token })
      }).subscribe((data)=>{
        if (data == true) {
          this.logginToken = true
        }

      })


      resolve(this.logginToken)

    })
    return promise
  }


  // authCheck() {
  //   const token = localStorage.getItem("newToken")
  //   console.log("front request auth token", token);


  //   return this.http.get('http://localhost:3000/auth', {
  //     headers: new HttpHeaders({ 'Authorization': token })
  //   })


  // }
  // deletePosts() {
  //   return this.http
  //     .delete('https://ng-complete-guide-c56d3.firebaseio.com/posts.json', {
  //       observe: 'events',
  //       responseType: 'text'
  //     })
  //     .pipe(
  //       tap(event => {
  //         console.log(event);
  //         if (event.type === HttpEventType.Sent) {
  //           // ...
  //         }
  //         if (event.type === HttpEventType.Response) {
  //           console.log(event.body);
  //         }
  //       })
  //     );
  // }
}
