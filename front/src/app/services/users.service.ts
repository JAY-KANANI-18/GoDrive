import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { environment } from "src/environments/environment";


@Injectable({ providedIn: "root" })
export class UsersService {
  public stripe_public_key:any
  public Max_stops:any
  constructor(private http: HttpClient, private router: Router) {

  }


getSettings(){
     this.http.get(`${environment.URL}/Settings`).subscribe({
      next:(data:any)=>{
        data = data.setting
        this.stripe_public_key = data.stripe_public_key
        this.Max_stops = data.MaxStopsForRide
        return data.stripe_public_key


      },error:(error)=>{
        console.log(error);
      }
    })




}
  addUser(data: any) {
    return this.http.post(`${environment.URL}/Users`, data);
  }
  SaveUser(id: any, data: any) {
    return this.http.post(
      `${environment.URL}/Users/Update/Save?id=${id}`,
      data
    );
  }
  deleteUser(id: any) {
    return this.http.get(`${environment.URL}/Users/Delete/${id}`);
  }
  updateUser(id: any) {
    return this.http.get(`${environment.URL}/Users/Update?id=${id}`);
  }
  getUsers(page: any, option?: any) {

let params = {page}

    if (option?.field) {

      params['field'] = option.field

    } else if (option?.search) {
      console.log("2");
      params['str'] = option.search

    }
      return this.http.get(`${environment.URL}/Users`,{params});

  }

  getAddedUser(data: any) {
    return this.http.post(`${environment.URL}/User/Data`, data);
  }
  // searchUser(data:any){
  //   return this.http.get(`http://localhost:3000/Users/Search?search=${data}`)

  // }
  addCard(id: any, token: any) {
    return this.http.post(`${environment.URL}/User/Card?id=${id}`, token);
  }
  getCards(id: any) {
    return this.http.get(`${environment.URL}/Users/Cards?id=${id}`);
  }
  getPayment(card: any, amount: any, userid: any) {
    return this.http.get(
      `${environment.URL}/Users/Payment?card=${card}&amount=${amount}&userid=${userid}`
    );
  }
  setDefaultCard(user: any, card: any) {
    return this.http.get(
      `${environment.URL}/Users/Cards/default?card=${card}&user=${user}`
    );
  }
  deleteCard(card: any) {
    return this.http.get(`${environment.URL}/Users/Cards/delete?card=${card}`);
  }
}
