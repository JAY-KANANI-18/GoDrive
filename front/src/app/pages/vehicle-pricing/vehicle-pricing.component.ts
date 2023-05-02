import { Component, OnInit } from '@angular/core';
import { DashService } from 'src/app/services/dashboard.service';
import { PricingService } from 'src/app/services/pricing.servive';

@Component({
  selector: 'app-vehicle-pricing',
  templateUrl: './vehicle-pricing.component.html',
  styleUrls: ['./vehicle-pricing.component.scss']
})
export class VehiclePricingComponent implements OnInit {
  vehicleTypesArray = []
  citiesArray = []
  countriesArray = []
  allPricing: any
  opselect: any



  selectedCountry: any = "select country"
  selectedCity: any
  selectedVehicleType: any
  SubmitActivate: any
  UpdateActivate: any
  constructor(private dashboardService: DashService, private pricingService: PricingService) { }

  ngOnInit(): void {
    this.getAllPricing()
    // this.getCities()
    this.getCountry()
    this.getVehicleType()
  }

  onAdd(data: any) {


    let city = document.getElementById('city') as HTMLInputElement
    let country = document.getElementById('country') as HTMLInputElement
    let vehicle = document.getElementById('vehicle') as HTMLInputElement
    console.log(vehicle.value);

    console.log(data);
    let formObj = {
      country: country.value,
      city: city.value,
      vehicle: vehicle.value,
      driverprofit: data.driverprofit,
      minfare: data.minfare,
      distanceforbaseprice: data.distanceforbaseprice,
      baseprice: data.baseprice,
      priceperunitdistance: data.priceperunitdistance,
      priceperunittime: data.priceperunittime,
      maxspace: data.maxspace,

    }
    console.log(formObj);


    this.pricingService.addVehiclePricing(formObj).subscribe((data) => {
      this.getAllPricing()
    })




  }
  onselect(val: any) {
    this.opselect = true
    this.selectedCountry = val
    this.getCities()

  }

  getCities() {
    // this.dashboardService.getCities().subscribe((data: any) => {
    //   this.citiesArray = data
    // })
    console.log("country name", this.selectedCountry);
    this.pricingService.getCities(this.selectedCountry).subscribe((data: any) => {
      this.citiesArray = data



      // data.forEach((each:any) => {
      //   if (each.country === this.selectedCountry) {

      //     this.citiesArray.push(each.city.name)
      //     console.log(each.city.name);

      //   }




      // })



    })
  }
  getCountry() {
    this.pricingService.getAddedCountry().subscribe((data: any) => {
      this.countriesArray = []
      data.forEach((each) => {
        this.countriesArray.push(each.name)

      })
    })



  }
  getVehicleType() {
    this.pricingService.getallVehicleTypes().subscribe((data: any) => {


      this.vehicleTypesArray = []
      data.forEach((each) => {
        this.vehicleTypesArray.push(each.name)

      })
    })
  }

  getAllPricing() {
    this.pricingService.getVehiclesPricing().subscribe({
      next: (data: any) => {
        this.allPricing = data
        console.log(data);
          ;
      }, error: (error) => {
        console.log(error);
      }
    })
  }
  onDelete(id: any) {
    this.pricingService.deleteVehiclePricing(id).subscribe({
      next: (data: any) => {
        console.log(data);
        this.getAllPricing()
      }, error: (error) => {
        console.log(error);
      }
    })


  }
  onUpdate(id: any) {
    this.pricingService.updateVehiclePricing(id).subscribe({
      next: (data: any) => {


        let city = document.getElementById('city') as HTMLInputElement
        let country = document.getElementById('country') as HTMLInputElement
        let vehicle = document.getElementById('vehicle') as HTMLInputElement

        let driverprofit = document.getElementById('driverprofit') as HTMLInputElement
        let distanceforbaseprice = document.getElementById('distanceforbaseprice') as HTMLInputElement
        let baseprice = document.getElementById('baseprice') as HTMLInputElement

        let minfare = document.getElementById('minfare') as HTMLInputElement
        let priceperunitdistance = document.getElementById('priceperunitdistance') as HTMLInputElement
        let priceperunittime = document.getElementById('priceperunittime') as HTMLInputElement
        let maxspace = document.getElementById('maxspace') as HTMLInputElement




        city.value = data.city
        country.value = data.country
        vehicle.value = data.vehicle
        driverprofit.value = data.city
        distanceforbaseprice.value = data.distanceforbaseprice
        baseprice.value = data.baseprice
        minfare.value = data.minfare
        priceperunitdistance.value = data.priceperunitdistance
        priceperunittime.value = data.priceperunittime
        maxspace.value = data.maxspace


      }, error: (error) => {
        console.log(error);
      }
    })

  }

}
