import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DashService } from 'src/app/services/dashboard.service';
import { PricingService } from 'src/app/services/pricing.servive';

@Component({
  selector: 'app-vehicle-pricing',
  templateUrl: './vehicle-pricing.component.html',
  styleUrls: ['./vehicle-pricing.component.scss']
})
export class VehiclePricingComponent implements OnInit {
  public vehicleTypesArray = []
  public citiesArray = []
  public countriesArray = []
  public allPricing: any
  public SubmitActivate: any
  public UpdateActivate: any
  public currentPage: any = 1
  public NoOfPages: any = []

  private opselect: any


  constructor( private pricingService: PricingService,private ngbService: NgbModal) { }

  ngOnInit(): void {
    this.getAllPricing(this.currentPage)
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


    this.pricingService.addVehiclePricing(formObj).subscribe(
      {
        next: (data: any) => {
          this.getAllPricing(this.currentPage)


        }, error: (error) => {
          console.log(error);
        }
      })
  }
  onselect(val: any) {
    this.opselect = true
    this.getCities(val)

  }

  getCities(val: any) {

    console.log("country name", val);
    this.pricingService.getCities(val).subscribe((data: any) => {
      this.citiesArray = data
    })
  }
  getCountry() {
    this.pricingService.getAddedCountry().subscribe((data: any) => {
      this.countriesArray = []
      data.forEach((each) => {
        this.countriesArray.push(each)

      })
    })
  }
  getVehicleType() {
    this.pricingService.getallVehicleTypes().subscribe(
      {
        next:(data:any)=>{
          this.vehicleTypesArray = data


        },error:(error)=>{
          console.log(error);
        }
      })

  }

  getAllPricing(page:any) {
    this.pricingService.getVehiclesPricing(page).subscribe({
      next: (data: any) => {
        console.log(data);
        this.allPricing = data.pricings
        this.NoOfPages = new Array(data.pages)
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
        this.getAllPricing(this.currentPage)
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
  openModel(content: any) {

    this.ngbService.open(content,{centered:true});

  }
  onSearch(search:any){
    console.log(search);
    this.pricingService.getVehiclesPricing(1,{search}).subscribe({
      next:(data:any)=>{
        console.log(data);
        this.allPricing = data.pricings
        this.NoOfPages = new Array(data.pages)
        this.currentPage =1
      },error:(error)=>{
        console.log(error);
      }
    })

  }
  onNext(){
    this.currentPage++
    console.log(this.currentPage);
    console.log(this.NoOfPages);

    this.getAllPricing(this.currentPage)



  }
  onPrevious(){
    this.currentPage--
    this.getAllPricing(this.currentPage)


  }
  onPage(page:any){
    this.currentPage = page
    this.getAllPricing(this.currentPage)

  }
}
