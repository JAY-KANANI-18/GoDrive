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


export class PricingService {
  zone:any
    constructor(private http: HttpClient, private router: Router) { }



//
  addVehicle(data: any) {
    return this.http.post(`http://localhost:3000/Pricing/VehicleType`, data)

  }
  //
  getVelicles() {
    return this.http.get('http://localhost:3000/Pricing/Vehicles')

  }

  deleteItem(id: any, type: any) {
    return this.http.get(`http://localhost:3000/Pricing/${type}/Delete/${id}`)

  }
  deleteCity(id: any) {
    return this.http.get(`http://localhost:3000/Pricing/City/Delete?id=${id}`)

  }
  deleteVehiclePricing(id: any) {
    return this.http.get(`http://localhost:3000/Pricing/VehiclePricing/Delete?id=${id}`)

  }
  //
  updateVehicle(id: any) {
    return this.http.get(`http://localhost:3000/Pricing/Vehicles/Update/${id}`)

  }
  //
  saveVehicle(data: any, id: any) {
    return this.http.post(`http://localhost:3000/Pricing/Vehicles/Update/save/${id}`, data)

  }
//*
  getCountry() {
    return this.http.get(`http://localhost:3000/Country`)

  }
//*

  addCountry(data: any) {
    return this.http.post(`http://localhost:3000/Pricing/Country`, data)

//
  }
  getAddedCountry() {
    return this.http.get(`http://localhost:3000/Pricing/Country`)

//
  }
  searchItem(query: any, type: any) {
    return this.http.get(`http://localhost:3000/Pricing/Search/${type}?str=${query}`)


  }
  getLocation(place: any) {
    console.log(place);
    return this.http.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${place}&key=AIzaSyCjPuEw8IEcDWsL2DlvAk4uOMm_5sOMPIo`,)
  }
//
  addZone(data: any) {
    return this.http.post(`http://localhost:3000/Pricing/city`, data)

  }
  //
  getZone() {
    return this.http.get(`http://localhost:3000/Pricing/Zone`)


  }
//
  getVehiclesPricing() {
    return this.http.get(`http://localhost:3000/Pricing/AllVehiclePricing`)


  }
  getVehiclesType(city:any) {
    return this.http.get(`http://localhost:3000/Pricing/City/VehiclesType?city=${city}`)


  }
  getallVehicleTypes() {
    return this.http.get(`http://localhost:3000/Pricing/VehiclesTypes`)


  }
  //
  getCities(country:any) {
    return this.http.get(`http://localhost:3000/Pricing/Cities?country=${country}`)


  }
//
  addVehiclePricing(data: any) {
    return this.http.post(`http://localhost:3000/Pricing/VehiclePricing`, data)


  }
  getServicePricing(city:any,vehicle:any) {
    return this.http.get(`http://localhost:3000/Pricing/VehiclePricing?city=${city}&type=${vehicle}`)
  }
  //
  getallzone() {
    return this.http.get(`http://localhost:3000/Pricing/allZone`)
  }

  updateCity(id:any){
    return this.http.get(`http://localhost:3000/Pricing/Update/City?id=${id}`)


  }
  updateVehiclePricing(id:any){
    return this.http.get(`http://localhost:3000/Pricing/Update/VehiclePricing?id=${id}`)


  }
  saveCity(id:any ,data:any){
    return this.http.post(`http://localhost:3000/Pricing/City/Save?id=${id}`,data)


  }
  allCallingCodes(){
    return this.http.get(`http://localhost:3000/CallingCodes`)


  }





}
