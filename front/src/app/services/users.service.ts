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
    SaveUser(id:any,data: any) {
      return this.http.post(`http://localhost:3000/Users/Update/Save?id=${id}`, data)


    }
    deleteUser(id: any) {
      return this.http.get(`http://localhost:3000/Users/Delete/${id}`)


    }
    updateUser(id: any) {
      return this.http.get(`http://localhost:3000/Users/Update?id=${id}`)


    }
    getUsers(page:any,option?:any) {

      if(option?.field){
        console.log('1');
        return this.http.get(`http://localhost:3000/Users?page=${page}&field=${option.field}&order=${option.order}`)

      }else if (option?.search){
        console.log('2');
        return this.http.get(`http://localhost:3000/Users?page=${page}&str=${option.search}`)

      }else{
        console.log('3');

          return this.http.get(`http://localhost:3000/Users?page=${page}`)
      }


    }

  getAddedUser(data: any) {
    return this.http.post(`http://localhost:3000/User/Data`,data)
  }
  // searchUser(data:any){
  //   return this.http.get(`http://localhost:3000/Users/Search?search=${data}`)


  // }
  addCard(id:any,token:any){
    return this.http.post(`http://localhost:3000/User/Card?id=${id}`,token)


  }
  getCards(id:any){
    return this.http.get(`http://localhost:3000/Users/Cards?id=${id}`)

  }
  getPayment(card:any,amount:any,userid:any){
    return this.http.get(`http://localhost:3000/Users/Payment?card=${card}&amount=${amount}&userid=${userid}`)


  }
  setDefaultCard(user:any,card:any){
    return this.http.get(`http://localhost:3000/Users/Cards/default?card=${card}&user=${user}`)


  }
  deleteCard(card:any){
    return this.http.get(`http://localhost:3000/Users/Cards/delete?card=${card}`)


  }

}
