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



export class DashService {
  zone: any
  constructor(private http: HttpClient, private router: Router) { }

  addVehicle(data: any) {
    return this.http.post(`http://localhost:3000/addNewVehicle`, data)

  }



  // createAndStorePost(data: any) {
  //   const Data: any = { name: data.name, email: data.email, password: data.password };

  //   return this.http.post('http://localhost:3000/login', Data)

  // }

  // getVelicles() {
  //   return this.http.get('http://localhost:3000/Vehicles')

  // }

  // deleteItem(id: any, type: any) {
  //   return this.http.get(`http://localhost:3000/${type}/Delete/${id}`)

  // }
  // updateVehicle(id: any) {
  //   return this.http.get(`http://localhost:3000/Vehicles/Update/${id}`)

  // }
  // saveVehicle(data: any, id: any) {
  //   return this.http.post(`http://localhost:3000/Vehicles/Update/save/${id}`, data)

  // }

  // getCountry() {
  //   return this.http.get(`http://localhost:3000/getCountry`)

  // }

  // addCountry(data: any) {
  //   return this.http.post(`http://localhost:3000/addCountry`, data)


  // }
  // getAddedCountry() {
  //   return this.http.get(`http://localhost:3000/getAddedCountry`)


  // }
  // searchItem(query: any, type: any) {
  //   return this.http.get(`http://localhost:3000/Search/${type}?str=${query}`)


  // }
  // getLocation(place: any) {
  //   console.log(place);
  //   return this.http.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${place}&key=AIzaSyC5Y5CasfaYLpy2X02_lftyXwJ4_d37Q0E`,)
  // }

  // addZone(data: any) {
  //   return this.http.post(`http://localhost:3000/addZone`, data)

  // }
  // getZone() {
  //   return this.http.get(`http://localhost:3000/zone`)


  // }

  // getVehiclesType() {
  //   return this.http.get(`http://localhost:3000/VehiclesType`)


  // }
  // getCities() {
  //   return this.http.get(`http://localhost:3000/Cities`)


  // }
  // addVehiclePricing(data: any) {
  //   return this.http.post(`http://localhost:3000/addVehiclePricing`, data)


  // }

  // addUser(data: any) {
  //   return this.http.post(`http://localhost:3000/Users`, data)


  // }
  // deleteUser(id: any) {
  //   return this.http.get(`http://localhost:3000/Users/Delete/${id}`)


  // }
  // updateUser(id: any) {
  //   return this.http.get(`http://localhost:3000/Users/Update/${id}`)


  // }
  // getUsers() {
  //   return this.http.get(`http://localhost:3000/Users`)


  // }

  // addDriver(data: any) {
  //   return this.http.post(`http://localhost:3000/Drivers`, data)


  // }
  // getDrivers() {
  //   return this.http.get(`http://localhost:3000/Drivers`)
  // }


  // getAddedUser(data: any) {
  //   return this.http.post(`http://localhost:3000/User/Data`, data)
  // }
  // getVehiclePricing(lat: any, lng: any) {
  //   return this.http.get(`http://localhost:3000/VehiclePricing?lat=${lat}&lng=${lng}`)
  // }
  // addRide(data: any) {
  //   return this.http.post(`http://localhost:3000/addRide`, data)
  // }
  // getallzone() {
  //   return this.http.get(`http://localhost:3000/allZone`)


  // }
}
