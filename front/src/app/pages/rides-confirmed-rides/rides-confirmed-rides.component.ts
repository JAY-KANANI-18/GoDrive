import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { DriversService } from 'src/app/services/drivers.service';
import { RidesService } from 'src/app/services/rides.service';
import { SocketService } from 'src/app/services/soketio.service';



@Component({
  selector: 'app-rides-confirmed-rides',
  templateUrl: './rides-confirmed-rides.component.html',
  styleUrls: ['./rides-confirmed-rides.component.scss']
})
export class RidesConfirmedRidesComponent implements OnInit {

  constructor(private ridesService: RidesService,private renderer: Renderer2,private sockServivce:SocketService,private driversService:DriversService) { }
  ridesArray:any
  showElement:any
  OnlineDrivers:any

  ngOnInit(): void {
    this.showRides()
  }

  showRides() {
    this.ridesService.getRides().subscribe({
      next: (data) => {

        this.ridesArray=data
      }, error: (error) => {
        console.log(error);
      }
    })
  }


  openAssignDialog(id:any) {
    document.getElementById(id).style.display =  'block';
    // this.assignDialog.nativeElement.style.display = 'block';
    document.body.classList.add('modal-open');


    this.driversService.getOnlineDrivers().subscribe({
      next:(data:any)=>{
        console.log(data);
        this.OnlineDrivers = data

      },error:(error)=>{
        console.log(error);
      }
    })
  }

  closeAssignDialog(id:any) {
    document.getElementById(id).style.display =  'none';

    // this.assignDialog.nativeElement.style.display = 'none';
    document.body.classList.remove('modal-open');
  }


  onCancel(id:any){

   let  data={
    status:'cancelled'
   }


    this.ridesService.RideStatus(id,data).subscribe({
      next:(data)=>{
        console.log(data);
        this.showRides()
      },error:(error)=>{
        console.log(error);
      }
    })


  }
  onSelectAssign(ride:any){
    this.sockServivce.fromAdminassign(ride)

  }


}
