import { Injectable } from '@angular/core';
import {
  HttpClient

} from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';


@Injectable({ providedIn: 'root' })


export class SettingsService {
  zone:any
    constructor(private http: HttpClient, private router: Router) { }

    setTimeOut(id:any,data:any) {

      console.log(data);
      return this.http.patch(`${environment.URL}/Settings/edit?id=${id}`,data)
    }
    currentSettings(){
      return this.http.get(`${environment.URL}/Settings`)


    }

}
