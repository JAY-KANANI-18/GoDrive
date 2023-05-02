import { Component, OnInit } from '@angular/core';
import { RidesService } from 'src/app/services/rides.service';

@Component({
  selector: 'app-ride-history',
  templateUrl: './ride-history.component.html',
  styleUrls: ['./ride-history.component.scss']
})
export class RideHistoryComponent implements OnInit {
  allConfirmedrides:any
  constructor(private ridesService:RidesService) { }

  ngOnInit(): void {

    this.getRides()
  }
getRides(){
  this.ridesService.getCompletedRides().subscribe({
    next:(data:any)=>{
      this.allConfirmedrides = data
      console.log(data);
    },error:(error)=>{
      console.log(error);
    }
  })

}
}
