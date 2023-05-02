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


export class UsersService {
  zone:any
    constructor(private http: HttpClient, private router: Router) { }


    addUser(data: any) {
      return this.http.post(`http://localhost:3000/Users`, data)


    }
    deleteUser(id: any) {
      return this.http.get(`http://localhost:3000/Users/Delete/${id}`)


    }
    updateUser(id: any) {
      return this.http.get(`http://localhost:3000/Users/Update/${id}`)


    }
    getUsers() {
      return this.http.get(`http://localhost:3000/Users`)


    }

  getAddedUser(data: any) {
    return this.http.post(`http://localhost:3000/User/Data`, data)
  }

}
