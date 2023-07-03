import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Router } from "@angular/router";
import { environment } from "src/environments/environment";

// import { Post } from './post.model';

@Injectable({ providedIn: "root" })
export class RidesService {
  zone: any;
  constructor(private http: HttpClient, private router: Router) {}
  addRide(data: any) {
    return this.http.post(`${environment.URL}/addRide`, data);
  }
  getRides(page: any, option?: any) {
    // return this.http.get(`http://localhost:3000/Rides?page=${page}`)

    // if(option?.field){
    //   console.log('1');
    //   return this.http.get(`http://localhost:3000/Rides?page=${page}&field=${option.field}&order=${option.order}`)

    // }else if (option?.search){
    //   console.log('2');
    const params = new HttpParams({ fromObject: option?.search });

    return this.http.get(`${environment.URL}/Rides?page=${page}`, {
      params,
    });

    // }else{
    //   console.log('3');

    //     return this.http.get(`http://localhost:3000/Rides?page=${page}`)
    // }
  }

  getCompletedRides(page: any, option?: any) {
    const params = new HttpParams({ fromObject: option?.search });

    return this.http.get(`${environment.URL}/Rides/Completed?page=${page}`, {
      params,
    });
  }
  getPayment() {
    return this.http.get(`${environment.URL}/Rides/Payment`);
  }
  getMail() {
    return this.http.get(`${environment.URL}/Rides/SendEmail`);
  }
  updateRide(id:any,data:any){

    return this.http.patch(`${environment.URL}/Rides/Update?id=${id}`,data);
  }
}
