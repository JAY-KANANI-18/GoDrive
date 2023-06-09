import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { DriversService } from "src/app/services/drivers.service";
import { PricingService } from "src/app/services/pricing.servive";
import { SocketService } from "src/app/services/soketio.service";

@Component({
  selector: "app-drivers",
  templateUrl: "./drivers.component.html",
  styleUrls: ["./drivers.component.scss"],
})
export class DriversComponent implements OnInit {

  public allDrivers: any;
  public allCallingCode: any;
  public selectedCountry: any;
  public adddriverForm: FormGroup;
  public vehicleTypesArray: any = [];
  public countriesArray: any = [];
  public UpdateActivate = false;
  public citiesArray = [];
  public currentPage: any = 1
  public NoOfPages: any = []


  private updateId: any;

  @ViewChild("fileInput") fileInput: ElementRef;
  @ViewChild("country") country: ElementRef;
  @ViewChild("city") city: ElementRef;

  constructor(
    private pricingService: PricingService,
    private driversService: DriversService,
    private ngbService: NgbModal,
    private socketService: SocketService,
    public cdRef: ChangeDetectorRef,

  ) {
    this.socketChangeDriverStatus()
    this.createDriverFormGroup()
  }

  ngOnInit(): void {
    this.getDrivers(this.currentPage);
    this.getVehicleType();
    this.getCallingCodes();
    this.getAvailableCoutries()
  }

  addDriver(file:any) {

   let data = this.adddriverForm.value
    file = file.files[0];
    // const country = this.country.nativeElement.value;
    // const city = this.city.nativeElement.value;
    // console.log(city);
    // console.log(country);

    let formObj = new FormData();

    formObj.append("name", data.name);
    formObj.append("email", data.email);
    formObj.append("mobile", data.mobile);
    formObj.append("country", data.country);
    formObj.append("city", data.city);
    formObj.append("file", file);

    console.log(formObj);

    this.driversService.addDriver(formObj).subscribe((data: any) => {
      console.log(data);

      this.getDrivers(this.currentPage);
    });
  }
  onSave() {
    let data = this.adddriverForm.value;
    const file = this.fileInput.nativeElement.value;

    let formObj = new FormData();

    formObj.append("name", data.name);
    formObj.append("email", data.email);
    formObj.append("mobile", data.mobile);
    formObj.append("country", data.country);
    formObj.append("city", data.city);
    formObj.append("file", file);
    this.driversService.SaveDriver(this.updateId, formObj).subscribe({
      next: (data: any) => {
        console.log(data);
        this.getDrivers(this.currentPage);
      },
      error: (error) => {
        console.log(error);
      },
    });
  }
  getDrivers(page:any) {
    this.driversService.getDrivers(page).subscribe((data: any) => {
      this.allDrivers = data.drivers;
      this.NoOfPages = new Array(data.pages)

      console.log(data);
    });
  }


  getCities(country: any) {
    this.pricingService.getCities(country).subscribe((data: any) => {
      console.log(data);
      this.citiesArray = data;
    });
  }
  onselect(val: any) {
    this.selectedCountry = val;
    this.getCities(this.selectedCountry);
  }
  onDelete(id: any) {
    this.driversService.deleteDriver(id).subscribe({
      next: (data: any) => {
        console.log(data);
        this.getDrivers(this.currentPage);
      },
      error: (error) => {
        console.log(error);
      },
    });
  }
  onUpdate(id: any) {
    this.updateId = id;
    this.driversService.updateDriver(id).subscribe({
      next: (data: any) => {
        this.UpdateActivate = true;

        // let name = document.getElementById('name') as HTMLInputElement
        // let email = document.getElementById('email') as HTMLInputElement
        // let mobile = document.getElementById('mobile') as HTMLInputElement
        // let country = document.getElementById('country') as HTMLInputElement
        // let city = document.getElementById('city') as HTMLInputElement

        // let Vals = this.adddriverForm.value

        this.adddriverForm.get("name").setValue(data.name);
        this.adddriverForm.get("email").setValue(data.email);
        this.adddriverForm.get("mobile").setValue(data.mobile);
        this.adddriverForm.get("country").setValue(data.country);
        this.onselect(data.country);

        this.adddriverForm.get("city").setValue(data.city);

        // name.value = Vals.get
        // email.value = Vals.email
        // mobile.value = Vals.mobile
        // country.value = Vals.country
        // city.value = Vals.city

        console.log(data);
      },
      error: (error) => {
        console.log(error);
      },
    });
  }
  onacceptSelect(data: any, id: any) {

    let formObj = new FormData();

    formObj.append("acceptride", data);


    this.driversService.SaveDriver(id, formObj).subscribe({
      next: (data: any) => {
        console.log(data);
        this.getDrivers(this.currentPage)
      }, error: (error) => {
        console.log(error);
      }
    })


  }
  updateService(vehicle: any) {

    let formObj = new FormData();

    formObj.append("vehicle", vehicle);


    this.driversService.SaveDriver(this.updateId, formObj).subscribe({
      next: (data: any) => {
        console.log(data);
        this.getDrivers(this.currentPage)
        this.ngbService.dismissAll();

      }, error: (error) => {

        console.log(error);
      }

    })
  }
  onApprove(id: any) {

    let data = {
      approval: 1,
    };
    this.driversService.approveDriver(id, data).subscribe({
      next: (data: any) => {
        this.getDrivers(this.currentPage);
        this.cdRef.detectChanges()

      },
      error: (error) => {
        console.log(error);
      },
    });
  }
  onDecline(id: any) {
    console.log(id);
    let data = {
      approval: 2,
    };
    this.driversService.approveDriver(id, data).subscribe({
      next: (data: any) => {

        this.getDrivers(this.currentPage);
        this.cdRef.detectChanges()
      },
      error: (error) => {
        console.log(error);
      },
    });
  }
  getCallingCodes() {
    this.pricingService.allCallingCodes().subscribe({
      next: (data) => {
        console.log(data);
        this.allCallingCode = data;
      },
      error: (error) => {
        console.log(error);
      },
    });
  }
  getVehicleType() {
    this.pricingService.getallVehicleTypes().subscribe((data: any) => {
      this.vehicleTypesArray = data

    });
  }
  openModel(content: any, id?:any,event?:Event) {
    if(id){
      event.stopPropagation();
      this.updateId = id

    }
    this.ngbService.open(content, { centered: true });
  }
  onStatusSelect(data: any, id: any) {

    let formObj = new FormData();

    formObj.append("status", data);


    this.driversService.SaveDriver(id, formObj).subscribe({
      next: (data: any) => {
        console.log(data);
        this.getDrivers(this.currentPage)
      }, error: (error) => {
        console.log(error);
      }
    })



  }
  socketChangeDriverStatus() {
    this.socketService.changeDriverStatusOn().subscribe({
      next: (data: any) => {
        console.log(data);
        let index = this.allDrivers.findIndex(element => element._id === data.driver._id);
        console.log(index);
        if (index !== -1) {
          this.allDrivers[index].status = data.driver.status;
          this.allDrivers[index].currentride = data.ride;
        }
        this.socketService.changeDriverStatusEmit(data.driver)
      }, error: (error) => {
        console.log(error);
      }
    })

  }
  createDriverFormGroup() {

    this.adddriverForm = new FormGroup({
      file: new FormControl(null),
      name: new FormControl(null, [Validators.required]),
      email: new FormControl(null, [Validators.required]),
      country: new FormControl("", [Validators.required]),
      city: new FormControl("", [Validators.required]),
      callingCode: new FormControl("", [Validators.required]),
      mobile: new FormControl(null, [
        Validators.required,
        Validators.pattern("^((\\+91-?)|0)?[0-9\\s-]{10}$"),
      ]),
    });

  }
  getAvailableCoutries() {
    this.pricingService.getAddedCountry().subscribe(
      {
        next: (countries: any) => {
          this.countriesArray = countries
        },
        error: (error) => {
          console.log(error);
        }
      })

  }
  onSearch(search:any){
    this.driversService.getDrivers(this.currentPage,{search}).subscribe({
      next:(data:any)=>{
        console.log(data);
        this.allDrivers = data.drivers
        this.NoOfPages = new Array(data.pages)
        // this.currentPage =1

    },error:(error)=>{
      console.log(error);
    }
    })

  }
  onNext(){
    this.currentPage++
    console.log(this.currentPage);
    console.log(this.NoOfPages);

    this.getDrivers(this.currentPage)



  }
  onPrevious(){
    this.currentPage--
    this.getDrivers(this.currentPage)


  }
  onPage(page:any){
    this.currentPage = page
    this.getDrivers(this.currentPage)

  }
}
