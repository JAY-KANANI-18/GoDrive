import {
  Component,
  ElementRef,
  OnInit,
  Renderer2,
  ViewChild,
} from "@angular/core";
import { DriversService } from "src/app/services/drivers.service";
import { RidesService } from "src/app/services/rides.service";
import { SocketService } from "src/app/services/soketio.service";
import io from "socket.io-client/dist/socket.io.js";
import { AngularFireMessaging } from "@angular/fire/compat/messaging";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { messageService } from "src/app/services/message.service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
// import { Component } from '@angular/core';

import { saveAs } from "file-saver";
import * as Papa from "papaparse";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-rides-confirmed-rides",
  templateUrl: "./rides-confirmed-rides.component.html",
  styleUrls: ["./rides-confirmed-rides.component.scss"],
})
export class RidesConfirmedRidesComponent implements OnInit {
  constructor(
    private ridesService: RidesService,
    private http: HttpClient,
    private sockServivce: SocketService,
    private driversService: DriversService,
    private messagingService: messageService,
    private ngbService: NgbModal,
    private toster: ToastrService
  ) {
    this.sockServivce.notificationOn().subscribe({
      next: (data: any) => {
        console.log(data);

        this.messagingService.getTokenandSend(data.msg);
      },
      error: (error) => {
        console.log(error);
      },
    });

    this.sockServivce.changeRideStatusOn().subscribe({
      next: (data: any) => {
        this.showRides(this.currentPage);

        // console.log(data);
        // console.log('goti ne ayo');
        // let index = this.ridesArray.findIndex(element => element._id === data._id);
        // if (index !== -1) {
        //   this.ridesArray[index].status = data.status;
        //   if(data.driver){

        //     this.ridesArray[index].driver = data.driver;
        //   }
        // }
        // console.log(this.ridesArray);
      },
      error: (error) => {
        console.log(error);
      },
    });

    // this.socket = io('https://localhost:3000', {
    //   forceNew: true,
    //   transports: ['websocket', 'polling']
    // });

    // this.socket.on('connect', () => {
    //   console.log('Connected to server');
    // });

    // this.socket.on('status_changed', (location: any) => {

    //   let index = this.ridesArray .findIndex(element => element._id === location._id);
    //    if (index !== -1) {
    //     this.ridesArray[index].status = 'pending';
    //   }
    //   console.log(this.ridesArray );
    // })
  }
  public ridesArray: any;
  public OnlineDrivers: any;
  public selectedDriver: any;
  public NoOfPages: any;
  public rideInfo: any;
  public currentPage: any = 1;

  private socket: any;

  ngOnInit(): void {
    this.showRides(this.currentPage);
    // this.messagingService.requestPermission()
    this.messagingService.recieveMessasging();
    // this.messagingService.currentMessage
    // this.ridesService.getMail().subscribe((data: any) => {
    //   console.log(data);
    // })
  }

  showRides(page: any) {
    this.ridesService.getRides(page).subscribe({
      next: (data: any) => {
        console.log(data);

        // this.toster.success(data.msg);

        this.ridesArray = data.rides;
        this.NoOfPages = new Array(data.pages);
        console.log(this.NoOfPages);
      },
      error: (error) => {
        this.toster.error(error.error.msg);
        this.ridesArray = [];
        console.log(error);
      },
    });
  }

  onRowClick(driver: any) {
    this.selectedDriver = driver;
  }

  // openAssignDialog(id: any) {
  //   document.getElementById(id).style.display = "block";
  //   document.body.classList.add("modal-open");

  //   this.driversService.getOnlineDrivers().subscribe({
  //     next: (data: any) => {
  //       console.log(data);

  //       // this.toster.success(data.msg);
  //       this.OnlineDrivers = data.data;
  //     },
  //     error: (error) => {
  //       console.log("effw");
  //       console.log(error.error.msg);
  //       this.toster.error(error.error.msg);
  //     },
  //   });
  // }

  // closeAssignDialog(id: any) {
  //   document.getElementById(id).style.display = "none";

  //   // this.assignDialog.nativeElement.style.display = 'none';
  //   document.body.classList.remove("modal-open");
  // }

  onCancel(id: any) {
    let data = {
      id,
      status: 7, // cancelled
    };

    this.sockServivce.changeRideStatusEmit({ ride: data });
    this.sockServivce.changeRideStatusOn().subscribe({
      next: (data: any) => {
        console.log(data);
        this.showRides(this.currentPage);
      },
      error: (error) => {
        console.log(error);
      },
    });

    // this.ridesService.RideStatus(id, data).subscribe({
    //   next: (data) => {
    //     console.log(data);
    //     this.showRides()
    //   }, error: (error) => {
    //     console.log(error);
    //   }
    // })
  }
  onSelectAssign(ride: any, driver: any) {
    // let data = {
    //   ride,
    //   status: 'assigning'
    // }

    console.log(driver);
    if(!driver){
      this.toster.error('Select Driver First')
      return
    }
    let data2 = {
      id: ride._id,
      status: 1,
      assignType: 2,
      driver: driver._id,
    };
    // this.sockServivce.fromAdminassign({ ride, driver })
    this.sockServivce.changeRideStatusEmit({ ride: data2 });
    this.sockServivce.changeDriverStatusEmit({ id: driver._id, status: 2 });

    // this.sockServivce.changeRideStatusOn().subscribe({
    //   next: (data: any) => {
    //     console.log(this.ridesArray);
    //     let index = this.ridesArray.findIndex(element => element._id === data._id);
    //     if (index !== -1) {
    //       this.ridesArray[index].status = 'assigning';
    //     }
    //     console.log(index);
    //     console.log(this.ridesArray[0]);

    //     // this.showRides()

    //   }, error: (error) => {
    //     console.log(error);
    //   }
    // })
    // this.ridesService.RideStatus(ride._id, data).subscribe({
    //   next: (data) => {

    //     this.showRides()
    //   }, error: (error) => {
    //     console.log(error);
    //   }
    // })
  }
  onAutoAssign(ride: any) {
    // let data2 = {
    //   id: ride._id,
    //   status: 1,

    // }
    // this.sockServivce.changeRideStatusEmit({ ride: data2 })
    this.sockServivce.rideAutoAssignEmit(ride);
  }
  openModel(content: any, ride: any, options?: any) {

    this.selectedDriver = undefined
    console.log('rfff');
    console.log(ride, content);
    this.ngbService.open(content, {
      centered: true,
      size: "lg",
      scrollable: true,
    });
    this.rideInfo = ride

    if ( options?.readOnly) {
      return
    }

    this.driversService.getOnlineDrivers(ride).subscribe({
      next: (data: any) => {
        console.log(data);
        this.OnlineDrivers = data.data;
      },
      error: (error) => {
        console.log(error);
        // this.OnlineDrivers = []
        this.toster.error(error.error.msg);
      },
    });
  }
  onPage(page: any) {
    this.currentPage = page;
    this.showRides(this.currentPage);
  }
  onPrevious() {
    this.currentPage--;
    this.showRides(this.currentPage);
  }
  onNext() {
    this.currentPage++;
    console.log(this.currentPage);
    console.log(this.NoOfPages);

    this.showRides(this.currentPage);
  }
  //aaaaaaaaaaaaaaaaa
  onSearch(search: any) {
    let search_type = (
      document.getElementById("search_type") as HTMLInputElement
    ).value;
    let payment_mode = (
      document.getElementById("payment_mode") as HTMLInputElement
    ).value;
    let from_date = (document.getElementById("from_date") as HTMLInputElement)
      .value;
    let to_date = (document.getElementById("to_date") as HTMLInputElement)
      .value;
    let search_value = (
      document.getElementById("search_value") as HTMLInputElement
    ).value;
    let status = (document.getElementById("status") as HTMLInputElement).value;

    let option = {
      search: {
        search_type: search_type,
        search_value: search_value,
        payment_mode: payment_mode,
        status,
      },
    };
    if (from_date && to_date) {
      option.search["from_date"] = from_date;
      option.search["to_date"] = to_date;
    }

    this.ridesService.getRides(1, option).subscribe({
      next: (data: any) => {
        console.log(data);
        this.ridesArray = data.rides;
        this.NoOfPages = new Array(data.pages);
      },
      error: (error) => {
        this.toster.error(error.error.msg)
        this.ridesArray = []
        console.log(error);
      },
    });
  }
  onDownload() {
    let search_type = (
      document.getElementById("search_type") as HTMLInputElement
    ).value;
    let payment_mode = (
      document.getElementById("payment_mode") as HTMLInputElement
    ).value;
    let from_date = (document.getElementById("from_date") as HTMLInputElement)
      .value;
    let to_date = (document.getElementById("to_date") as HTMLInputElement)
      .value;
    let search_value = (
      document.getElementById("search_value") as HTMLInputElement
    ).value;
    let status = (document.getElementById("status") as HTMLInputElement).value;

    let option = {
      search: {
        search_type: search_type,
        search_value: search_value,
        payment_mode: payment_mode,
        status,
        download: true
      },
    };
    if (from_date && to_date) {
      option.search["from_date"] = from_date;
      option.search["to_date"] = to_date;
    }

    this.ridesService.getRides(1, option).subscribe({
      next: (data: any) => {
        console.log(data);
        data.rides;


        const csv = Papa.unparse(data.rides);
        const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
        saveAs(blob, "tableData.csv");
        this.NoOfPages = new Array(data.pages);
      },
      error: (error) => {
        console.log(error);
      },
    });








  }
  StatusNext(ride:any){
   let data = {
      status: ride.status + 1
    }



    this.ridesService.updateRide(ride._id,data).subscribe({
      next:(data:any)=>{
        console.log(data);
        this.showRides(this.currentPage)
      },error:(error)=>{
        console.log(error);
      }
    })


  }
}
