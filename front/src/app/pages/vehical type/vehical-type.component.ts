import {
  Component,
  ElementRef,
  OnInit,
  SimpleChanges,
  ViewChild,
} from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ToastrService } from "ngx-toastr";
import { PricingService } from "src/app/services/pricing.servive";
import { environment } from "src/environments/environment";

@Component({
  selector: "app-vehicletype",
  templateUrl: "./vehical-type.component.html",
  styleUrls: ["./vehical-type.component.scss"],
})
export class VehicleType implements OnInit {


  public Vehicles = [];
  public title = "Add Vehicle";
  public UpdateActivate = false;
  public SubmitActivate = true;
  public vehicleName: any;
  public allVehicles: any;
  public vehicleForm: any;
  selectedImage: string;


  private updateId = "";

  constructor(
    private pricingService: PricingService,
    private ngbService: NgbModal,
    private toster: ToastrService,

  ) { }

  ngOnInit() {
    this.getVehicles();
  }

  createVehicleTypeForm() {
    this.vehicleForm = new FormGroup({
      name: new FormControl(null, [Validators.required]),
      file: new FormControl(null, [Validators.required]),

    });
  }
  async onSearch(val: any) {
    console.log(val);
    this.Vehicles = this.allVehicles.filter((vehicle: any) =>
      vehicle.name.toLowerCase().includes(val.toLowerCase())
    );
  }
  getVehicles() {
    this.pricingService.getallVehicleTypes().subscribe(
      {
        next: (data: any) => {

          this.Vehicles = data.vehicle;
          if (this.Vehicles.length == 0) {
            this.toster.error('Vehicles Not Found')
          } else {
            // this.toster.success(data.msg)

          }

        },error:(error)=>{
          this.toster.error(error.error.msg)


        }
      }


    );
  }

  onAdd(files: any, modal: any) {

    const file = files.files[0];
    const formDataObj = new FormData();

    if (file.size >= 1000000) {
      this.toster.error('File should be less than 1 Mb')
      return;
    }

    formDataObj.append("name", this.vehicleForm.value.name);
    formDataObj.append("file", file);

    this.pricingService.addVehicle(formDataObj).subscribe({
      next: (data:any) => {
        if(data.msg){
          this.toster.success(data.msg)
        }
        this.getVehicles();
        modal.dismiss('Click')
        this.vehicleForm.reset()
      },
      error: (error) => {

        if (error.error.msg) {
          this.toster.error(error.error.msg)

        }
      },
    });
  }

  onUpdate(id: any) {

    this.pricingService.updateVehicle(id).subscribe({
      next: (res: any) => {

       let data = res.vehicle

        this.vehicleForm.get('name').setValue(data.name)

        this.selectedImage = `${environment.URL}/avatars/${data.file}`
        this.updateId = id;
        this.UpdateActivate = true;
        this.SubmitActivate = false;
        // this.toster.success(res.msg)

      },
      error: (error) => {
        console.log(error);
      },
    });
  }
  onSave(fileInput: any, modal: any) {

    const file = fileInput.files[0];
    console.log(file);
    if (file?.size >= 1000000) {
      this.toster.error('File should be less than 1 Mb')
      return;
    }
    const formDataObj = new FormData();
    formDataObj.append("name", this.vehicleForm.value.name);

    if (file) {
      formDataObj.append("file", file);
    }

    const id = this.updateId;
    this.pricingService.saveVehicle(formDataObj, id).subscribe({
      next: (data: any) => {
        modal.dismiss('Click')

        this.toster.success(data.msg)
        this.vehicleForm.reset()
        this.updateId = "";

        this.getVehicles();

      }, error: (error) => {
        console.log(error);
          this.toster.error(error.error.msg)

      }
    })


  }
  scrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  onCancel(modal: any) {
    modal.dismiss('Click')
    this.vehicleForm.reset()
    // this.UpdateActivate = false;
    // this.SubmitActivate = true;
    this.updateId = "";
    // this.title = "Add Vehicle";
  }
  openModel(content: any, type: any) {
    this.createVehicleTypeForm()
    this.selectedImage = null

    if (type == 1) {
      this.UpdateActivate = false
    }
    if (type == 2) {
      this.UpdateActivate = true

    }
    this.ngbService.open(content, { centered: true });
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
