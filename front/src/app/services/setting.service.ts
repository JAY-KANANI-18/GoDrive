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


export class SettingsService {
  zone:any
    constructor(private http: HttpClient, private router: Router) { }

    setTimeOut(id:any,data:any) {

      console.log(data);
      return this.http.patch(`http://localhost:3000/Settings/edit?id=${id}`,data)
    }
    currentSettings(){
      return this.http.get(`http://localhost:3000/Settings`)


    }

}
