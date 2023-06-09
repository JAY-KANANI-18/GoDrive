import { Component, ElementRef, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DashService } from 'src/app/services/dashboard.service';
import { PricingService } from 'src/app/services/pricing.servive';

@Component({
  selector: 'app-vehicletype',
  templateUrl: './vehical-type.component.html',
  styleUrls: ['./vehical-type.component.scss']
})
export class VehicleType implements OnInit {

  @ViewChild('fileInput') fileInput: ElementRef;

  public errorMsg: any
  public errorMsg2: any
  public Vehicles = []
  public title = "Add Vehicle"
  public UpdateActivate = false
  public SubmitActivate = true
  public vehicleName: any
  public allVehicles: any

  private updateId = ""
  private file: any

  constructor(private dashService: DashService, private pricingService: PricingService,private ngbService: NgbModal
    ) { }

  ngOnInit() {
    this.getVehicles()

  }
 async  onSearch(val:any){
    console.log(val);
    this.Vehicles = this.allVehicles.filter((vehicle:any)=>vehicle.name.toLowerCase().includes(val.toLowerCase()))
    //  this.getVehicles()



  }
  getVehicles() {
    this.pricingService.getallVehicleTypes().subscribe((data: any) => {
      this.allVehicles = data
      this.Vehicles = this.allVehicles

      console.log(this.Vehicles);
    })

  }

  onAdd(formData: any,files:any) {
    this.errorMsg2 = false

    const file = files.files[0];
    const formDataObj = new FormData();
    if (file.size >= 1000000) {
      this.errorMsg2 = true
      return
    }

    formDataObj.append('name', formData.name);
    formDataObj.append('file', file);



    this.pricingService.addVehicle(formDataObj).subscribe({

      next: (data) => {

        console.log(data);

        this.getVehicles()


      }, error: (error) => {
        console.log(error);

        if (error.error.msg) {

          this.errorMsg = error.error.msg
        }
        // this.errorMsg = error.error.error

      }



    })


  }
  onDelete(id: any) {
    console.log('on delete', id);
    let type = 'Vehicles'
    this.pricingService.deleteItem(id, type).subscribe(
      {
        next: (data: any) => {
          console.log(data);
          this.getVehicles()
        }
      })
  }
  onUpdate(id: any) {
    this.errorMsg2 = false
    this.pricingService.updateVehicle(id).subscribe(
      {
        next: (data: any) => {

          this.vehicleName = data.name
          this.file = data.file
          this.updateId = id
          this.title = "Update User"
          this.UpdateActivate = true
          this.SubmitActivate = false
        }, error: (error) => {
          console.log(error);
        }
      })

  }
  onSave(formData: any,fileInput:any) {
    this.errorMsg2 = false


    const file = fileInput.files[0];
     console.log(file);
    if (file?.size >= 1000000) {
      this.errorMsg2 = true
      return
    }
    const formDataObj = new FormData();
    formDataObj.append('name', formData.name);
    if (!file) {
      console.log("no file");
      console.log(this.file);

      formDataObj.append('file', this.file);
    } else {
      console.log("file che");

      formDataObj.append('file', file);


    }





    const id = this.updateId
    this.pricingService.saveVehicle(formDataObj, id).subscribe((data) => {
      console.log(data);
      this.updateId = ''

      this.getVehicles()

      this.UpdateActivate = false
      this.SubmitActivate = true


    })

  }
  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  onCancel() {
    this.UpdateActivate = false
    this.SubmitActivate = true
    this.updateId = ''
    this.title = "Add Vehicle"


  }
  openModel(content: any) {

    this.ngbService.open(content,{centered:true});

  }
}
