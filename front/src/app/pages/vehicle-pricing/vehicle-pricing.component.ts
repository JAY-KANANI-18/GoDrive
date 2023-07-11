import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ToastrService } from "ngx-toastr";
import { PricingService } from "src/app/services/pricing.servive";

@Component({
  selector: "app-vehicle-pricing",
  templateUrl: "./vehicle-pricing.component.html",
  styleUrls: ["./vehicle-pricing.component.scss"],
})
export class VehiclePricingComponent implements OnInit {
  public vehicleTypesArray = [];
  public citiesArray = [];
  public countriesArray = [];
  public allPricing: any;
  public SubmitActivate: any;
  public currentPage: any = 1;
  public NoOfPages: any = [];
  public PricingForm: FormGroup;
  public UpdateForm: FormGroup;
  public updateid: any

  private opselect: any;

  constructor(
    private pricingService: PricingService,
    private ngbService: NgbModal,
    private toster: ToastrService,

  ) { }

  ngOnInit(): void {
    this.getAllPricing(this.currentPage);
    this.getCountryandCities();
    this.getVehicleType();
  }

  createPricingForm() {
    this.PricingForm = new FormGroup({
      minfare: new FormControl(null, [Validators.required]),
      maxspace: new FormControl(null, [Validators.required]),
      baseprice: new FormControl(null, [Validators.required]),
      driverprofit: new FormControl(null, [Validators.required]),
      priceperunittime: new FormControl(null, [Validators.required]),
      distanceforbaseprice: new FormControl(null, [Validators.required]),
      priceperunitdistance: new FormControl(null, [Validators.required]),
      city: new FormControl(this.citiesArray[0]?._id, [Validators.required]),
      country: new FormControl(this.countriesArray[0]._id, [Validators.required]),
      vehicle: new FormControl(this.vehicleTypesArray[0]._id, [Validators.required]),
    });
  }
  createUpdateForm() {
    this.UpdateForm = new FormGroup({
      uminfare: new FormControl(null, [Validators.required]),
      umaxspace: new FormControl(null, [Validators.required]),
      ubaseprice: new FormControl(null, [Validators.required]),
      udriverprofit: new FormControl(null, [Validators.required]),
      upriceperunittime: new FormControl(null, [Validators.required]),
      udistanceforbaseprice: new FormControl(null, [Validators.required]),
      upriceperunitdistance: new FormControl(null, [Validators.required]),
      ucity: new FormControl([''], [Validators.required]),
      ucountry: new FormControl(this.countriesArray[0]._id, [Validators.required]),
      uvehicle: new FormControl(this.vehicleTypesArray[0]._id, [Validators.required]),
    });
  }

  onAdd(modal: any) {
    console.log('add pricing');

    let data = this.PricingForm.value
    console.log(data);


    this.PricingForm.markAllAsTouched();
    if (this.PricingForm.invalid) {
      console.log('invalid form');
      this.toster.error('Form is Invalid')

      return

    }



    const formObj = new FormData();

    formObj.append("country", data.country),
      formObj.append("city", data.city),
      formObj.append("vehicle", data.vehicle),
      formObj.append("minfare", data.minfare),
      formObj.append("driverprofit", data.driverprofit),
      formObj.append("distanceforbaseprice", data.distanceforbaseprice);
    formObj.append("baseprice", data.baseprice),
      formObj.append("priceperunitdistance", data.priceperunitdistance),
      formObj.append("priceperunittime", data.priceperunittime),
      formObj.append("maxspace", data.maxspace);



    this.pricingService.addVehiclePricing(formObj).subscribe({
      next: (data: any) => {
        this.toster.success(data.msg)
        this.getAllPricing(this.currentPage);
        modal.dismiss('Click')
        this.PricingForm.reset()

      },
      error: (error) => {
        this.toster.error(error.error.msg)
      },
    });
  }

  onselect(val: any) {
    this.opselect = true;
    this.getCities(val);
  }

  getCities(val: any) {
    this.pricingService.getCities(val).subscribe({
      next: (res: any) => {
        let data = res.city
        // this.toster.success(res.msg)

        this.citiesArray = data;

        if (data.length === 0) {
          this.PricingForm.patchValue({
            city: null
          })


          this.toster.error('Select Another Country', "City Not Found ")
        } else {


          this.PricingForm.patchValue({
            city: data[0]?._id
          })

        }

      }, error: (error) => {
        this.toster.error(error.error.msg)

          console.log(error);
        }
      })




  }
  getCountryandCities() {
    this.pricingService.getallCities().subscribe((data: any) => {
      console.log(data);
      // this.toster.success(data.msg)

      this.countriesArray = []
      data.data.forEach((element: any) => {
        let val = element.country
        const existingObject = this.countriesArray.find((item) => item['_id'] === val['_id']);
        if (!existingObject) {
          this.countriesArray.push(val);
        }

      });
      if (this.countriesArray.length == 0) {
        this.toster.error("Add City in Country", 'City Not Found')
      }

    }, (error) => {
      console.log(error);
      this.toster.error(error.error.msg)
    });
  }
  getVehicleType() {
    this.pricingService.getallVehicleTypes().subscribe({
      next: (data: any) => {





        this.vehicleTypesArray = data.vehicle;
        if (this.vehicleTypesArray.length == 0) {
          this.toster.error('Vehicles Not Found')
        } else {
          // this.toster.success(data.msg)

        }
      },
      error: (error) => {
        this.toster.error(error.error.msg)

        console.log(error);
      },
    });
  }

  getAllPricing(page: any) {
    this.pricingService.getVehiclesPricing(page).subscribe({
      next: (data: any) => {
        // this.toster.success(data.msg)
        this.allPricing = data.pricings;
        this.NoOfPages = new Array(data.pages);
      },
      error: (error) => {
        this.toster.error(error.error.msg)
        console.log(error);
      },
    });
  }

  onUpdate(id: any, content: any) {
    this.openModel(content)
    this.createUpdateForm()

    this.pricingService.updateVehiclePricing(id).subscribe({
      next: (res: any) => {
        // this.toster.success(res.msg)

       let data = res.pricing
        this.updateid = data._id
        // this.onselect(data.country)
        console.log(data);

        this.UpdateForm.patchValue({

          ucountry: data.country.name,
          ucity: data.city.city,
          uvehicle: data.vehicle.name,
          udriverprofit: data.driverprofit,
          uminfare: data.minfare,
          udistanceforbaseprice: data.distanceforbaseprice,
          ubaseprice: data.baseprice,
          upriceperunitdistance: data.priceperunitdistance,
          upriceperunittime: data.priceperunittime,
          umaxspace: data.maxspace,

        })

      },
      error: (error) => {
        this.toster.error(error.errro.msg)
        console.log(error);
      },
    });
  }
  openModel(content: any) {

    if (this.countriesArray.length == 0) {
      this.toster.error("Add City in Country", 'City Not Found')
      return
    }
    this.citiesArray = []
    this.createPricingForm()
    this.onselect(this.countriesArray[0]._id)

    this.ngbService.open(content, { centered: true });
  }
  onSearch(search: any) {
    console.log(search);
    this.pricingService.getVehiclesPricing(1, { search }).subscribe({
      next: (data: any) => {
        console.log(data);
        // this.toster.success(data.msg)
        this.allPricing = data.pricings;
        this.NoOfPages = new Array(data.pages);
        this.currentPage = 1;
      },
      error: (error) => {
        this.toster.error(error.error.msg)
        this.allPricing = []

        console.log(error);
      },
    });
  }
  onNext() {
    this.currentPage++;
    console.log(this.currentPage);
    console.log(this.NoOfPages);

    this.getAllPricing(this.currentPage);
  }
  onPrevious() {
    this.currentPage--;
    this.getAllPricing(this.currentPage);
  }
  onPage(page: any) {
    this.currentPage = page;
    this.getAllPricing(this.currentPage);
  }
  integerOnly(event: any): boolean {
    const charCode = event.which ? event.which : event.keyCode;

    if (event.target.value.length == 1 && event.target.value > 1) {
      console.log("true");
      return false;
    }
    if (event.target.value.length > 1) {
      return false;
    }
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }
  numberLimit(event: any) {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    if (event.target.value.length > 2) {
      return false;
    }
    return true;
  }
  onSave(modal: any) {
    console.log('worl');

    this.UpdateForm.markAllAsTouched();
    if (this.UpdateForm.invalid) {
      console.log('invalid form');

      return

    }
    let data = this.UpdateForm.value

    const formObj = new FormData();


    formObj.append("minfare", data.uminfare),
      formObj.append("driverprofit", data.udriverprofit),
      formObj.append("distanceforbaseprice", data.udistanceforbaseprice);
    formObj.append("baseprice", data.ubaseprice),
      formObj.append("priceperunitdistance", data.upriceperunitdistance),
      formObj.append("priceperunittime", data.upriceperunittime),
      formObj.append("maxspace", data.umaxspace);

    this.pricingService.saveUpdatedVehiclePricing(this.updateid, formObj).subscribe({
      next: (data: any) => {
        this.toster.success(data.msg)
        this.getAllPricing(this.currentPage);
        modal.dismiss('Click')


      }, error: (error) => {
        this.toster.error(error.error.msg)
        console.log(error);
      }
    })

  }
  onCancel(modal: any) {
    modal.dismiss('Click')
    this.PricingForm.reset()

  }
}
