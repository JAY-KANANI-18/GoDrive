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


export class DriversService {
  zone:any
    constructor(private http: HttpClient, private router: Router) { }


  addDriver(data: any) {
    return this.http.post(`http://localhost:3000/Drivers`, data)


  }
  getDrivers() {
    return this.http.get(`http://localhost:3000/Drivers`)
  }
  deleteDriver(id: any) {
    return this.http.get(`http://localhost:3000/Drivers/Delete/${id}`)


  }
  updateDriver(id: any) {
    return this.http.get(`http://localhost:3000/Drivers/Update/${id}`)


  }
  approveDriver(id:any,data:any){
    return this.http.patch(`http://localhost:3000/Drivers/Approve?id=${id}`,data)


  }
  getOnlineDrivers(){
    return this.http.get(`http://localhost:3000/Drivers/Online`)



  }
  driversCurrentRide(){
    return this.http.get(`http://localhost:3000/Drivers/CurrentRide`)


  }


}
