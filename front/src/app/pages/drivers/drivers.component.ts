import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ToastrService } from "ngx-toastr";
import { DriversService } from "src/app/services/drivers.service";
import { PricingService } from "src/app/services/pricing.servive";
import { SocketService } from "src/app/services/soketio.service";
import { environment } from "src/environments/environment";

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
  public UpdateForm: FormGroup;
  public vehicleTypesArray: any = [];
  public countriesArray: any = [];
  public UpdateActivate = false;
  public citiesArray = [];
  public currentPage: any = 1;
  public NoOfPages: any = [];
  public sortField: any
  public driverImage: any
  public selectedImage: any

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
    private toster: ToastrService,

  ) {
    this.socketChangeDriverStatus();
    this.createDriverFormGroup();
  }

  ngOnInit(): void {
    this.getDrivers(this.currentPage);
    this.getVehicleType();
    this.getCallingCodes();
    this.getAvailableCoutries();
  }

  addDriver(file: any, modal: any) {
    let data = this.adddriverForm.value;
    file = file.files[0];

    let formObj = new FormData();

    formObj.append("name", data.name);
    formObj.append("email", data.email);
    formObj.append("mobile", data.callingCode + "-" + data.mobile);
    formObj.append("country", data.country);
    formObj.append("city", data.city);
    formObj.append("profile", file);

    console.log(formObj);

    this.driversService.addDriver(formObj).subscribe((data: any) => {
      modal.dismiss('Click')
      console.log('DRIVER REG');
      this.adddriverForm.reset()
      this.toster.success(data.msg)

      this.getDrivers(this.currentPage);
    }, (error: any) => {
      console.log(error.error);

      if (error.error.email) {
        // this.errorMsg = error.error.email;
        this.toster.error(error.error.email, "");

      }
      if (error.error.number) {
        // this.errorMsg2 = error.error.number;
        this.toster.error(error.error.number, "");

      } if (error.error.msg) {
        this.toster.error(error.error.msg, "");


      }
    });
  }
  onSave(file: any, modal?: any) {
    let data = this.UpdateForm.value;
    file = file.files[0];
    // const file = this.fileInput.nativeElement.value;

    let formObj = new FormData();

    formObj.append("name", data.uname);
    formObj.append("email", data.uemail);
    formObj.append("mobile", data.ucallingCode + "-" + data.umobile);
    formObj.append("country", data.ucountry);
    formObj.append("city", data.ucity);
    if (file) {

      formObj.append("profile", file);
    }


    this.driversService.SaveDriver(this.updateId, formObj).subscribe({
      next: (data: any) => {
this.toster.success(data.msg)
   this.getDrivers(this.currentPage);
        modal.dismiss('Click')
      },
      error: (error) => {
        if (error.error.email) {
          // this.errorMsg = error.error.email;
          this.toster.error(error.error.email, "");

        }
        if (error.error.number) {
          // this.errorMsg2 = error.error.number;
          this.toster.error(error.error.number, "");

        } if (error.error.msg) {
          console.log('here');
          this.toster.error(error.error.msg, "");


        }
      },
    });
  }
  getDrivers(page: any) {
    this.driversService.getDrivers(page, { field: this.sortField }).subscribe(
      {
        next:(data:any)=>{

            // this.toster.success(data.msg)

          this.allDrivers = data.drivers;
          this.NoOfPages = new Array(data.pages);
        },error:(error)=>{
          this.toster.error(error.error.msg)
        }
      }
     );
  }
  getCities(country: any) {
    this.pricingService.getCities(country).subscribe(
      {
        next:(data:any)=>{
          this.citiesArray = data.city
          // this.toster.success(data.msg);
        },error:(error)=>{
          this.toster.error(error.error.msg)
        }



      })



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
        // this.toster.success(data.msg)
      },
      error: (error) => {
        this.toster.error(error.error.msg)
        console.log(error);
      },
    });
  }
  onUpdate(id: any) {
    this.updateId = id;
    this.createUpdateForm()
    this.driversService.updateDriver(id).subscribe({
      next: (data: any) => {
        // this.toster.success(data.msg)


        data = data.driver
        this.UpdateActivate = true;

        let num = data.mobile.split("-");
        console.log(num);


        this.UpdateForm.get("uname").setValue(data.name);
        this.UpdateForm.get("uemail").setValue(data.email);

        this.UpdateForm.get("ucallingCode").setValue(num[0]);
        this.UpdateForm.get("umobile").setValue(num[1]);
        this.UpdateForm.get("ucountry").setValue(data.country);
        this.onselect(data.country);
        this.selectedImage = environment.URL + "/avatars/" + data.profile
        this.UpdateForm.get("ucity").setValue(data.city);




      },
      error: (error) => {
        this.toster.error(error.error.msg)
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
        this.getDrivers(this.currentPage);
      },
      error: (error) => {
        console.log(error);
      },
    });
  }
  updateService(vehicle: any) {
    let formObj = new FormData();


    formObj.append("vehicle", vehicle);

    this.driversService.SaveDriver(this.updateId, formObj).subscribe({
      next: (data: any) => {
        console.log(data);
        this.getDrivers(this.currentPage);
        this.ngbService.dismissAll();
      },
      error: (error) => {
        console.log(error);
      },
    });
  }
  onApprove(id: any) {
    let data = {
      approval: 1,
    };
    this.driversService.approveDriver(id, data).subscribe({
      next: (data: any) => {
        // this.toster.success(data.msg)
        this.getDrivers(this.currentPage);
        this.cdRef.detectChanges();
      },
      error: (error) => {
        this.toster.error(error.error.msg)
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
        // this.toster.success(data.msg)

        this.getDrivers(this.currentPage);
        this.cdRef.detectChanges();
      },
      error: (error) => {
        this.toster.error(error.error.msg)

        console.log(error);
      },
    });
  }
  getCallingCodes() {
    this.pricingService.allCallingCodes().subscribe({
      next: (data:any) => {
        console.log(data);
        // this.toster.success(data.msg)
        console.log(data);

        this.allCallingCode = data.allCollingCodes;
      },
      error: (error) => {
        this.toster.error(error.error.msg)

        console.log(error);
      },
    });
  }
  getVehicleType() {
    this.pricingService.getallVehicleTypes().subscribe(
      {
        next:(data:any)=>{

          this.vehicleTypesArray = data.vehicle;
          if(this.vehicleTypesArray.length == 0 ){
            this.toster.error('Vehicles Not Found')
          }else{
            // this.toster.success(data.msg)

          }

        },error:(error)=>{
          console.log(error);
          this.toster.error(error.error.msg)

        }
      })

  }
  openModel(content: any, id?: any, event?: Event) {
    if (id) {
      console.log(id);
      event.stopPropagation();
      this.updateId = id;
    }
    this.ngbService.open(content, { centered: true });
  }
  onStatusSelect(data: any, id: any) {
    let formObj = new FormData();

    formObj.append("status", data);

    this.driversService.SaveDriver(id, formObj).subscribe({
      next: (data: any) => {
        console.log(data);
        this.getDrivers(this.currentPage);
      },
      error: (error) => {
        console.log(error);
      },
    });
  }
  socketChangeDriverStatus() {
    this.socketService.changeDriverStatusOn().subscribe({
      next: (data: any) => {
        console.log(data);
        let index = this.allDrivers.findIndex(
          (element) => element._id === data.driver._id
        );
        console.log(index);
        if (index !== -1) {
          this.allDrivers[index].status = data.driver.status;
          this.allDrivers[index].currentride = data.ride;
        }
        this.socketService.changeDriverStatusEmit(data.driver);
      },
      error: (error) => {
        console.log(error);
      },
    });
  }
  createUpdateForm() {
    this.UpdateForm = new FormGroup({
      ufile: new FormControl(null),
      uname: new FormControl(null, [Validators.required]),
      uemail: new FormControl(null, [Validators.required]),
      ucountry: new FormControl("", [Validators.required]),
      ucity: new FormControl("", [Validators.required]),
      ucallingCode: new FormControl("", [Validators.required]),
      umobile: new FormControl(null, [
        Validators.required,
        Validators.pattern("^((\\+91-?)|0)?[0-9\\s-]{10}$"),
      ]),
    });
  }
  createDriverFormGroup() {
    this.adddriverForm = new FormGroup({
      file: new FormControl(null),
      name: new FormControl(null, [Validators.required]),
      email: new FormControl(null, [Validators.required]),
      country: new FormControl(null, [Validators.required]),
      city: new FormControl(null, [Validators.required]),
      callingCode: new FormControl(null, [Validators.required]),
      mobile: new FormControl(null, [
        Validators.required,
        Validators.pattern("^((\\+91-?)|0)?[0-9\\s-]{10}$"),
      ]),
    });
  }
  getAvailableCoutries() {
    this.pricingService.getallCities().subscribe({
      next: (countries: any) => {
        console.log(countries);
        // this.toster.success(countries.msg)

        this.countriesArray = []


        countries.data.forEach((element:any) => {
          let val = element.country
          const existingObject = this.countriesArray.find((item) => item['_id'] === val['_id']);
          if (!existingObject) {
            this.countriesArray.push(val);
          }

        });
        if(this.countriesArray.length == 0){
          this.toster.error("Add City in Country",'City Not Found')
        }
        console.log(this.countriesArray);



      },
      error: (error) => {
        console.log(error);
        this.toster.error(error.error.msg)

      },
    });
  }
  onSearch(search: any) {
    this.driversService.getDrivers(1, { search }).subscribe({
      next: (data: any) => {
        console.log(data);
        this.currentPage = 1
        this.allDrivers = data.drivers;
        this.NoOfPages = new Array(data.pages);
        // this.currentPage =1
      },
      error: (error) => {
        console.log(error);
      },
    });
  }
  onNext() {
    this.currentPage++;
    console.log(this.currentPage);
    console.log(this.NoOfPages);

    this.getDrivers(this.currentPage);
  }
  onPrevious() {
    this.currentPage--;
    this.getDrivers(this.currentPage);
  }
  onPage(page: any) {
    this.currentPage = page;
    this.getDrivers(this.currentPage);
  }

  onSort(data: any) {

    this.sortField = data


    this.getDrivers(this.currentPage)

  }
  onFileSelected(e: any) {
    if (e.target.files) {
      let reader = new FileReader()
      reader.readAsDataURL(e.target.files[0])
      reader.onload = (event: any) => {
        this.selectedImage = event.target.result
      }
    }
  }
}
