import { Component, ElementRef, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { DashService } from 'src/app/services/dashboard.service';
import { PricingService } from 'src/app/services/pricing.servive';

@Component({
  selector: 'app-vehicletype',
  templateUrl: './vehical-type.component.html',
  styleUrls: ['./vehical-type.component.scss']
})
export class VehicleType implements OnInit {
  @ViewChild('fileInput') fileInput: ElementRef;
  errorMsg: any
  errorMsg2: any
  Vehicles = []
  constructor(private dashService: DashService,private pricingService:PricingService) { }
  title = "Add Vehicle"
  vehicleName = ""
  UpdateActivate = false
  SubmitActivate = true
  updateId = ""
  file: any


  getVehicles() {
    this.pricingService.getVelicles().subscribe((data: any) => {
      this.Vehicles = data

      console.log(this.Vehicles);
    })

  }


  ngOnInit() {
    this.getVehicles()

  }




  onAdd(formData: any) {
    this.errorMsg2 = false

    const file = this.fileInput.nativeElement.files[0];
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
        console.log(error.error.message);

        if (error.error.msg) {

          this.errorMsg = error.error.msg
        }

      }



    })


  }
  onDelete(id: any) {
    console.log('on delete', id);
    let type = 'Vehicles'
    this.pricingService.deleteItem(id, type).subscribe((data) => {
      console.log(data);
    })

    this.getVehicles()


  }
  onUpdate(id: any) {
    this.errorMsg2 = false



    console.log('on update', id);
    this.pricingService.updateVehicle(id).subscribe((data: any) => {
      this.vehicleName = data.name
      this.file = data.file

      this.updateId = id



      this.title = "Update User"
      this.UpdateActivate = true
      this.SubmitActivate = false

    })
  }
  onSave(formData: any) {
    this.errorMsg2 = false


    const file = this.fileInput.nativeElement.files[0];
    if (file.size >= 1000000) {
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


}
