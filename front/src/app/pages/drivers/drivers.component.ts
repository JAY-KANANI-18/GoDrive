import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DashService } from 'src/app/services/dashboard.service';
import { DriversService } from 'src/app/services/drivers.service';
import { PricingService } from 'src/app/services/pricing.servive';

@Component({
  selector: 'app-drivers',
  templateUrl: './drivers.component.html',
  styleUrls: ['./drivers.component.scss']
})
export class DriversComponent implements OnInit {
  allDrivers: any
  selectedCountry: any
  countriesArray: any = []
  citiesArray = []
  allCallingCode:any
  @ViewChild('fileInput') fileInput: ElementRef;
  @ViewChild('country') country: ElementRef;
  @ViewChild('city') city: ElementRef;

  constructor(private dashboardService: DashService, private pricingService: PricingService, private driversService: DriversService) { }

  ngOnInit(): void {

    this.getDrivers()

    this.pricingService.getAddedCountry().subscribe((data: any) => {


      this.countriesArray = []
      data.forEach((each) => {
        this.countriesArray.push(each.name)

      })



      console.log(data.countryObj)
      console.log(data.countryArray)
      this.getCallingCodes()
    })
  }


  addDriver(data: any) {

    const file = this.fileInput.nativeElement.value
    const country = this.country.nativeElement.value;
    const city = this.city.nativeElement.value;
    console.log(city);
    console.log(country);

    let formObj = new FormData()

    formObj.append("name", data.name)
    formObj.append("email", data.email)
    formObj.append("mobile", data.mobile)
    formObj.append("country", country)
    formObj.append("city", city)
    formObj.append("file", file)
    formObj.append("approval", 'Pending')

    console.log(formObj);


    this.driversService.addDriver(formObj).subscribe((data: any) => {

      console.log(data);

      this.getDrivers()
    })

  }
  getDrivers() {
    this.driversService.getDrivers().subscribe((data: any) => {
      this.allDrivers = data
      console.log(data);
    })
  }
  getCities(country:any) {

    this.pricingService.getCities(country).subscribe((data: any) => {
      console.log(data);
      this.citiesArray = data



      // data.forEach((each) => {
      //   if (each.country === this.selectedCountry) {

      //     this.citiesArray.push(each.city.name)
      //   }
      // })
      // if (this.citiesArray.length <= 0) {
      //   this.citiesArray.push("City not found")
      // }



    })

  }
  onselect(val: any) {
    this.selectedCountry = val
    this.getCities(this.selectedCountry)

  }
  onDelete(id: any) {
    this.driversService.deleteDriver(id).subscribe({
      next: (data: any) => {
        console.log(data);
        this.getDrivers()
      }, error: (error) => {
        console.log(error);
      }
    })

  }
  onUpdate(id: any) {
    this.driversService.updateDriver(id).subscribe({

      next: (data: any) => {
        let name = document.getElementById('name') as HTMLInputElement
        let email = document.getElementById('email') as HTMLInputElement
        let mobile = document.getElementById('mobile') as HTMLInputElement
        let country = document.getElementById('country') as HTMLInputElement
        let city = document.getElementById('city') as HTMLInputElement


        name.value = data.name
        email.value = data.email
        mobile.value = data.mobile
        country.value = data.country
        city.value = data.city

        console.log(data);

      }, error: (error) => {
        console.log(error);

      }
    })
  }
  onApprove(id: any) {


    let data = {
      approval: "approved"

    }
    this.driversService.approveDriver(id, data).subscribe({
      next: (data: any) => {
        console.log(data);
        this.getDrivers()
      }, error: (error) => {
        console.log(error);
      }
    })
  }
  onDecline(id: any) {
    let data = {
      approval: "declined"

    }
    this.driversService.approveDriver(id, data).subscribe({
      next: (data: any) => {
        console.log(data);
        this.getDrivers()
      }, error: (error) => {
        console.log(error);
      }
    })

  }
  getCallingCodes(){
    this.pricingService.allCallingCodes().subscribe({
      next:(data)=>{
        console.log(data);
        this.allCallingCode = data
      },error:(error)=>{
        console.log(error);
      }
    })
  }

}
