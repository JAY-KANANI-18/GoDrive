import { Injectable } from "@angular/core";
import {
  HttpClient,

} from "@angular/common/http";

import { Router } from "@angular/router";
import { environment } from "src/environments/environment";

// import { Post } from './post.model';

@Injectable({ providedIn: "root" })
export class DriversService {
  zone: any;
  constructor(private http: HttpClient, private router: Router) {}

  addDriver(data: any) {
    return this.http.post(`${environment.URL}/Drivers`, data);
  }
  getDrivers(page: any, option?: any) {
    let params = {page}

    if (option?.field) {

      params['field'] = option.field

    } else if (option?.search) {
      console.log("2");
      params['str'] = option.search

    }


    return this.http.get(`${environment.URL}/Drivers`,{params});
  }
  deleteDriver(id: any) {
    return this.http.get(`${environment.URL}/Drivers/Delete/${id}`);
  }
  updateDriver(id: any) {
    return this.http.get(`${environment.URL}/Drivers/Update?id=${id}`);
  }
  SaveDriver(id: any, data: any) {
    return this.http.patch(
      `${environment.URL}/Drivers/Update/Save?id=${id}`,
      data
    );
  }
  approveDriver(id: any, data: any) {
    return this.http.patch(`${environment.URL}/Drivers/Approve?id=${id}`, data);
  }
  getOnlineDrivers(ride:any) {
    return this.http.post(`${environment.URL}/Drivers/Online`,ride);
  }

  getRunningRequest(page:any) {
    return this.http.get(`${environment.URL}/Drivers/RunningRequest?page=${page}`);
  }
}
