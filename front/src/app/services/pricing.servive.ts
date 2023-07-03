import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";

import { Router } from "@angular/router";
import { environment } from "src/environments/environment";

@Injectable({ providedIn: "root" })
export class PricingService {
  zone: any;
  constructor(private http: HttpClient, private router: Router) {}

  addVehicle(data: any) {
    return this.http.post(`${environment.URL}/Pricing/VehicleType`, data);
  }



  updateVehicle(id: any) {
    return this.http.get(`${environment.URL}/Pricing/Vehicles/Update?id=${id}`);
  }

  saveVehicle(data: any, id: any) {
    return this.http.post(
      `${environment.URL}/Pricing/Vehicles/Update/save/${id}`,
      data
    );
  }
  getCountry() {
    return this.http.get(`${environment.URL}/Country`);
  }

  addCountry(data: any) {
    return this.http.post(`${environment.URL}/Pricing/Country`, data);
  }
  getAddedCountry() {
    return this.http.get(`${environment.URL}/Pricing/Country`);
  }
  searchItem(query: any, type: any) {
    return this.http.get(
      `${environment.URL}/Pricing/Search/${type}?str=${query}`
    );
  }
  getLocation(place: any) {
    console.log(place);
    return this.http.get(
      `http://maps.googleapis.com/maps/api/geocode/json?address=${place}&key=AIzaSyCjPuEw8IEcDWsL2DlvAk4uOMm_5sOMPIo`
    );
  }

  addZone(data: any) {
    return this.http.post(`${environment.URL}/Pricing/city`, data);
  }

  getZone(page: any, options?: any) {
    if (options?.search) {
      return this.http.get(
        `${environment.URL}/Pricing/Zone?page=${page}&str=${options.search}`
      );
    }
    return this.http.get(`${environment.URL}/Pricing/Zone?page=${page}`);
  }
getallCities(){
  return this.http.get(`${environment.URL}/Pricing/allCities`);

}
  getVehiclesPricing(page: any, options?: any) {
    if (options?.search) {
      return this.http.get(
        `${environment.URL}/Pricing/AllVehiclePricing?page=${page}&str=${options.search}`
      );
    }
    return this.http.get(
      `${environment.URL}/Pricing/AllVehiclePricing?page=${page}`
    );
  }
  getVehiclesType(city: any,distance:any,time:any) {
    return this.http.get(
      `${environment.URL}/Pricing/City/VehiclesType?city=${city}&dist=${distance}&time=${time}`
    );
  }
  getallVehicleTypes() {
    return this.http.get(`${environment.URL}/Pricing/VehiclesTypes`);
  }

  getCities(country: any) {
    return this.http.get(
      `${environment.URL}/Pricing/Cities?country=${country}`
    );
  }

  addVehiclePricing(data: any) {
    return this.http.post(`${environment.URL}/Pricing/VehiclePricing`, data);
  }
  getServicePricing(city: any, vehicle: any) {
    return this.http.get(
      `${environment.URL}/Pricing/VehiclePricing?city=${city}&type=${vehicle}`
    );
  }

  updateCity(id: any) {
    return this.http.get(`${environment.URL}/Pricing/Update/City?id=${id}`);
  }
  updateVehiclePricing(id: any) {
    return this.http.get(
      `${environment.URL}/Pricing/Update/VehiclePricing?id=${id}`
    );
  }
  saveCity(id: any, data: any) {
    return this.http.post(
      `${environment.URL}/Pricing/City/Save?id=${id}`,
      data
    );
  }
  allCallingCodes() {
    return this.http.get(`${environment.URL}/CallingCodes`);
  }

  getcityofpoint(point: any) {
    return this.http.post(`${environment.URL}/findZone`, point);
  }
  saveUpdatedVehiclePricing(id:any,data:any){


    return this.http.post(`${environment.URL}/Pricing/Save/VehiclePricing?id=${id}`, data)

  }
}
