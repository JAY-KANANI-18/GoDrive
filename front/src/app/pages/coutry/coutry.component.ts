import { Component, OnInit, SimpleChanges } from '@angular/core';
import { DashService } from 'src/app/services/dashboard.service';
import { PostsService } from 'src/app/services/login.service';
import { PricingService } from 'src/app/services/pricing.servive';

@Component({
  selector: 'app-coutry',
  templateUrl: './coutry.component.html',
  styleUrls: ['./coutry.component.scss']
})
export class CoutryComponent implements OnInit {
  title = "country"
  countriesArray = []
  // countryDetails:any
  CountryName: any
  currentCountry: any
  timezone: any
  selectedCountry: any = ''
  tako: any
  countryObj: any
  addedCountry: any = []
  Flag: any
  nullData: any



  constructor(private dashService: DashService ,private pricingService:PricingService) { }

  ngOnInit(): void {
    this.pricingService.getCountry().subscribe((data: any) => {



      this.countriesArray = data.allCountries
      this.countryObj = data.countriesObject
      console.log(data.countryData);

      this.getAddedCountry()



    })

  }
  ngOnChanges(changes: SimpleChanges): void {


  };





  getAddedCountry() {
    this.pricingService.getAddedCountry().subscribe((data: any) => {
      this.addedCountry = data
      let newarray = []
      data.forEach(element => {
        newarray.push(element.name)

      });
            this.countriesArray =  this.countriesArray.filter((element) => !newarray.includes(element))







    })

  }

  onSelect() {
    this.nullData = false
    let selects = this.selectedCountry

    if (Object.keys(this.countryObj).includes(selects)) {
      const country = this.countryObj[selects];

      if (!country.name || !country.currency || !country.flag || !country.callingcode || !country.timezone || !country.countrycode) {
        this.nullData = true
        this.selectedCountry=''
        return

      }

      // for (let prop in country) {
      //   if (country[prop] === null || country[prop] === undefined) {
      //     this.nullData = true
      //     console.log('null che');
      //     return ;
      //   }
      // }
      this.selectedCountry = country


    }

  }

  onAdd(formData: any) {





    this.pricingService.addCountry(formData).subscribe((data) => {
      console.log(data);
      this.getAddedCountry()



    })
  }



  onDelete(id: any) {

    let type = "Country"
    this.pricingService.deleteItem(id, type).subscribe((data) => {
      console.log(data);
      this.getAddedCountry()

    })

  }

  searchCountry(FormData: any) {

    let query = FormData.search
    let type = "Country"


    this.pricingService.searchItem(query, type).subscribe((data) => {
      console.log(data);
      this.addedCountry = data
    })


  }
  onReset(){
    this.getAddedCountry()
  }

}
