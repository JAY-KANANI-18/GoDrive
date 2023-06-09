import { Component, OnInit } from '@angular/core';
import { RidesService } from 'src/app/services/rides.service';

@Component({
  selector: 'app-ride-history',
  templateUrl: './ride-history.component.html',
  styleUrls: ['./ride-history.component.scss']
})
export class RideHistoryComponent implements OnInit {

  public allConfirmedrides: any
  public NoOfPages: any
  public currentPage: any = 1
  public searchField: any

  constructor(private ridesService: RidesService) { }

  ngOnInit(): void {

    this.getRides(this.currentPage)
  }

  getRides(page: any) {
    this.ridesService.getCompletedRides(page).subscribe({
      next: (data: any) => {
        console.log(data);
        this.allConfirmedrides = data.rides
        this.NoOfPages = new Array(data.pages)
      }, error: (error) => {
        console.log(error);
      }
    })

  }
  onPage(page: any) {
    this.currentPage = page
    this.getRides(this.currentPage)
  }
  onPrevious() {
    this.currentPage--
    this.getRides(this.currentPage)


  }
  onNext() {
    this.currentPage++
    console.log(this.currentPage);
    console.log(this.NoOfPages);

    this.getRides(this.currentPage)



  }
  onSearch(search: any) {

    let search_type =  (document.getElementById('search_type')as HTMLInputElement).value
    let payment_mode = (document.getElementById('payment_mode') as HTMLInputElement).value
    let from_date = (document.getElementById('from_date')as HTMLInputElement).value
    let to_date = (document.getElementById('to_date')as HTMLInputElement).value
    let search_value = (document.getElementById('search_value')as HTMLInputElement).value
    let status = (document.getElementById('status')as HTMLInputElement).value


    let option = {
      search: {
        search_type: search_type,
        search_value: search_value,
        payment_mode:payment_mode,
        status
      }

    }
    if(from_date && to_date){
      option.search['from_date'] = from_date
      option.search['to_date'] = to_date
    }


    this.ridesService.getRides(1, option).subscribe({
      next: (data: any) => {
        console.log(data);
        this.allConfirmedrides = data.rides
        this.NoOfPages = new Array(data.pages)
      }, error: (error) => {
        console.log(error);
      }
    })

  }

  onFilter(value: any) {
    this.searchField = value



  }
}
