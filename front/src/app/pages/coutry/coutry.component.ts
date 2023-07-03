import { Component, OnInit, SimpleChanges } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ToastrService } from "ngx-toastr";
import { PricingService } from "src/app/services/pricing.servive";

@Component({
  selector: "app-coutry",
  templateUrl: "./coutry.component.html",
  styleUrls: ["./coutry.component.scss"],
})
export class CoutryComponent implements OnInit {
  public addCountryForm: FormGroup;
  public selectedCountry: any = "";
  public addedCountry = [];
  public allAddedCountries = [];
  public countriesArray = [];
  public title = "country";
  public nullData: any;

  private countryObj: any;

  constructor(
    private pricingService: PricingService,
    private toster: ToastrService,
    private ngbService: NgbModal
  ) {
    this.addCountryForm = new FormGroup({
      flag: new FormControl(null, [Validators.required]),
      name: new FormControl(null, [Validators.required]),
      timezone: new FormControl(null, [Validators.required]),
      currency: new FormControl(null, [Validators.required]),
      countrycode: new FormControl(null, [Validators.required]),
      callingcode: new FormControl(null, [Validators.required]),
    });
  }

  ngOnInit(): void {
    this.getAllCountries();
    this.getAddedCountry();
  }
  onSearch(val: any) {
    console.log(this.allAddedCountries);
    this.addedCountry = this.allAddedCountries.filter((country: any) =>
      country.name.toLowerCase().includes(val.toLowerCase())
    );
  }
  getAddedCountry() {
    this.pricingService.getAddedCountry().subscribe({
      next: (data: any) => {
        console.log(data);
        this.toster.success(data.msg)
        this.allAddedCountries = data.country;
        this.addedCountry = this.allAddedCountries;
        let newarray = [];
        data.country.forEach((element) => {
          newarray.push(element.name);
        });
        this.countriesArray = this.countriesArray.filter(
          (element) => !newarray.includes(element)
        );
      },
      error: (error) => {
        console.log(error);
        this.toster.error(error.error.msg);
      },
    });
  }
  openModel(content: any) {
    this.selectedCountry = null
    this.ngbService.open(content);
  }

  onSelect(value: any) {
    this.nullData = false;
    let selects = value;

    if (Object.keys(this.countryObj).includes(selects)) {
      const country = this.countryObj[selects];

      if (
        !country.name ||
        !country.currency ||
        !country.flag ||
        !country.callingcode ||
        !country.timezone ||
        !country.countrycode
      ) {
        this.nullData = true;
        this.selectedCountry = null;
        return;
      }

      this.selectedCountry = country;
      this.addCountryForm.get("name").setValue(this.selectedCountry.name);
      this.addCountryForm.get("flag").setValue(this.selectedCountry.flag);
      this.addCountryForm
        .get("timezone")
        .setValue(this.selectedCountry.timezone);
      this.addCountryForm
        .get("currency")
        .setValue(this.selectedCountry.currency);
      this.addCountryForm
        .get("callingcode")
        .setValue(this.selectedCountry.callingcode);
      this.addCountryForm
        .get("countrycode")
        .setValue(this.selectedCountry.countrycode);
    }
  }

  onAddCountry() {
    this.pricingService.addCountry(this.addCountryForm.value).subscribe({
      next: (data: any) => {
        this.getAddedCountry();
        this.toster.success(data.msg);
        this.addCountryForm.reset();
        this.selectedCountry = null;
      },
      error: (error) => {
        this.toster.error(error.error.msg);
      },
    });
  }

  searchCountry(FormData: any) {
    this.pricingService.searchItem(FormData.search, "Country").subscribe({
      next: (data: any) => {
        this.addedCountry = data;
      },
      error: (error) => {
        this.toster.error("Something went wrong!");
      },
    });
  }

  onResetSearch() {
    this.getAddedCountry();
  }

  getAllCountries() {
    this.pricingService.getCountry().subscribe({
      next: (data: any) => {
        this.toster.success(data.msg)
        this.countriesArray = data.allCountries;
        this.countryObj = data.countriesObject;
      },
      error: (error) => {
        this.toster.error(error.error.msg);
      },
    });
  }
}
