import { Component, OnInit } from "@angular/core";
import { RidesService } from "src/app/services/rides.service";

import { saveAs } from "file-saver";
import * as Papa from "papaparse";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ToastRef, ToastrService } from "ngx-toastr";

let map!: google.maps.Map;
let directionsService = new google.maps.DirectionsService();
@Component({
  selector: "app-ride-history",
  templateUrl: "./ride-history.component.html",
  styleUrls: ["./ride-history.component.scss"],
})
export class RideHistoryComponent implements OnInit {
  public allConfirmedrides: any;
  public NoOfPages: any;
  public currentPage: any = 1;
  public searchField: any;
  public rideInfo: any;

  constructor(
    private ridesService: RidesService,
    private ngbService: NgbModal,
    private toster: ToastrService,


  ) {}

  ngOnInit(): void {
    this.getRides(this.currentPage);
  }

  getRides(page: any) {
    this.ridesService.getCompletedRides(page).subscribe({
      next: (data: any) => {
        console.log(data);
        this.toster.success(data.msg)

        this.allConfirmedrides = data.rides;
        this.NoOfPages = new Array(data.pages);
      },
      error: (error) => {
        this.toster.error(error.error.msg)
        this.allConfirmedrides = []

        console.log(error);
      },
    });
  }
  onPage(page: any) {
    this.currentPage = page;
    this.getRides(this.currentPage);
  }
  onPrevious() {
    this.currentPage--;
    this.getRides(this.currentPage);
  }
  onNext() {
    this.currentPage++;
    console.log(this.currentPage);
    console.log(this.NoOfPages);

    this.getRides(this.currentPage);
  }
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

    this.ridesService.getCompletedRides(1, option).subscribe({
      next: (data: any) => {
        console.log(data);
        this.toster.success(data.msg)
        this.allConfirmedrides = data.rides;
        this.NoOfPages = new Array(data.pages);
      },
      error: (error) => {
        this.toster.error(error.error.msg)
        this.allConfirmedrides = []
        // this.NoOfPages = [];


        console.log(error);
      },
    });
  }

  onFilter(value: any) {
    this.searchField = value;
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
        download:true
      },
    };
    if (from_date && to_date) {
      option.search["from_date"] = from_date;
      option.search["to_date"] = to_date;
    }

    this.ridesService.getCompletedRides(1, option).subscribe({
      next: (data: any) => {
        console.log(data);
       data.rides;


    const csv = Papa.unparse(  data.rides);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    saveAs(blob, "tableData.csv");
        this.NoOfPages = new Array(data.pages);
      },
      error: (error) => {
        console.log(error);
      },
    });
  }
  openModel(content: any, ride: any) {
    this.ngbService.open(content, { centered: true });

    this.rideInfo = ride;
    this.initMap();
    let stops = []
    for (
      let i = 0;
      i < (ride.stop.length);
      i++
    ) {
      let val = ride.stop[i]

      if (val) {
        stops.push({
          location: val,
          stopover: true,
        });
      }
    }

    var request: any = {
      origin: ride.pickup,
      destination: ride.dropoff,
      waypoints: stops,
      travelMode: "DRIVING",
    };

    directionsService.route(request, function (result: any, status) {
      if (status == "OK") {
        var route = result.routes[0];
        var path = [];

        for (var i = 0; i < route.legs.length; i++) {
          var leg = route.legs[i];
          for (var j = 0; j < leg.steps.length; j++) {
            var step = leg.steps[j];
            for (var k = 0; k < step.path.length; k++) {
              path.push(step.path[k]);
            }
          }
        }

        var polyline = new google.maps.Polyline({
          path: path,
          geodesic: true,
          strokeColor: "#000000",
          strokeOpacity: 1.0,
          strokeWeight: 2,
        });

        var startPointMarker = new google.maps.Marker({
          position: path[0],
          map: map,
          label:'p',
          title: "Start Point",
        });

        // Create a marker for the end point
        var endPointMarker = new google.maps.Marker({
          position: path[path.length - 1],
          map: map,
          title: "End Point",
        });

        polyline.setMap(map);

        // Create a LatLngBounds object to encompass the entire route
        var bounds = new google.maps.LatLngBounds();
        for (var i = 0; i < path.length; i++) {
          bounds.extend(path[i]);
        }

        // Fit the map to the bounds
        map.fitBounds(bounds);
      } else {
        window.alert("sjddf");
      }
    });
  }
  initMap() {
    let option = {
      zoom: 8,
      // animation: google.maps.Animation.DROP,
      // mapTypeControlOptions: {
      //   mapTypeIds: []
      // },
      // streetViewControl: false,
    };
    map = new google.maps.Map(
      document.getElementById("map") as HTMLElement,
      option
    );
    map.setCenter({
      lat: 22,
      lng: 22,
    });
  }
}
