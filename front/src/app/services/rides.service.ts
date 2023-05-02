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


export class RidesService {
  zone: any
  constructor(private http: HttpClient, private router: Router) { }
  addRide(data: any) {
    return this.http.post(`http://localhost:3000/addRide`, data)
  }
  getRides() {
    return this.http.get(`http://localhost:3000/Rides`)
  }
  RideStatus(id:any,data:any){
    return this.http.patch(`http://localhost:3000/Rides/Status?id=${id}`,data)


  }
  getCompletedRides(){
    return this.http.get(`http://localhost:3000/Rides/Completed`)


  }
}
