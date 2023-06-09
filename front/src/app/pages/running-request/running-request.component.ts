import { SimpleChanges } from '@angular/core';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DriversService } from 'src/app/services/drivers.service';
import { SocketService } from 'src/app/services/soketio.service';
import io from 'socket.io-client/dist/socket.io.js';
import { RidesService } from 'src/app/services/rides.service';
import { CreateRequestComponent } from '../create-request/create-request.component';
import { PricingService } from 'src/app/services/pricing.servive';
import { Subscription, async } from 'rxjs';

import { Observable, interval } from 'rxjs';
import { map, takeWhile } from 'rxjs/operators';




@Component({
  selector: 'app-running-request',
  templateUrl: './running-request.component.html',
  styleUrls: ['./running-request.component.scss']
})
export class RunningRequestComponent {
  private socket: any
  s1 = []
  s2 = []
  currentRide: any
  Vehicles: any
  allrides: any = []
  z: any
  TotalDistance: any
  TotalTime: any

  accepted: any
  driverLocationSubscription: Subscription;
  correntPosition: string = ""
  status: any
  driverId: any
  markers = []
  timers: { id: number, seconds: number }[] = [];
  countDowns$: { [key: number]: Observable<number> } = {};



  infoWindow: google.maps.InfoWindow
  private map!: google.maps.Map
  private marker: google.maps.Marker
  private geocoder = new google.maps.Geocoder;
  private service = new google.maps.DistanceMatrixService()
  private directionsRenderer: google.maps.DirectionsRenderer;
  @ViewChild('modals') modals!: ElementRef
  constructor(private driverService: DriversService, private rideService: RidesService, private pricingService: PricingService, private socketService: SocketService) {




    this.socketService.changeRideStatusOn().subscribe({
      next: (data: any) => {
        this.getRunningRequest()
        // console.log(data);

        // data['remainingSeconds'] = 0



        // if (data.status == 'arrived') {

        //   this.forDirectionToDrop()
        // }
        // let index = this.allrides.findIndex((element: any) => element._id === data._id);

        // if (index !== -1) {

        //   this.allrides[index].status = data.status;

        //   if (data.status == "pending") {
        //     this.allrides.splice(index);
        //     return

        //   }
        //   if (data.driver) {

        //     this.allrides[index].driver = data.driver;
        //   }
        // } else {

        //   console.log(data.status);
        //   if (data.status === "assigning") {
        //     console.log('annd');
        //     this.allrides.push(data)
        //     this.timer(data._id)


        //   }

        //   console.log(this.allrides.length);

        // }




      }, error: (error) => {
        console.log(error);
      }
    })
    this.socketService.driversResponseOn().subscribe({
      next: (data: any) => {
        this.getRunningRequest()
      }
    })



  }

  ngOnInit(): void {
    this.getRunningRequest()

  }




  onAccept(id: any) {

    this.socketService.changeRideStatusEmit({ ride: { status: 2, id } })

    // let data = {
    //   status: "accepted"

    // }
    // let res = {
    //   response: 'accepted'
    // }
    // this.socketService.changeDriverStatusEmit({ id: '6448b5b2541475ce64a83e7f', status: "busy" })


    // this.socketService.driversResponseEmit("kaka")

    // this.socketService.changeRideStatusEmit({ride:{ id, data }})
    // this.socketService.changeDriverStatusOn().subscribe({
    //   next: (data: any) => {
    //     console.log(data);
    //     this.allrides.push(this.currentRide)
    //     this.initMap()

    //     this.forDirectionTouser()
    //     this.socket.emit('accept_ride', this.currentRide)





    //   }, error: (error) => {
    //     console.log(error);
    //   }
    // })

    // this.rideService.RideStatus(id, data).subscribe({
    //   next: async (data) => {
    //     this.allrides.push(this.currentRide)
    //     this.initMap()


    //     this.forDirectionTouser()
    //     this.socket.emit('accept_ride', this.currentRide)
    //     console.log(this.currentRide);




    //   }, error: (error) => {
    //     console.log(error);
    //   }
    // })

  }
  onReject(ride: any) {


    if (ride?.assignType === 2) {
      this.socketService.changeDriverStatusEmit({ id:ride.driver, status: 1 })
      this.socketService.changeRideStatusEmit({ ride: { id: ride._id, status: 0, assignType: 4,driver:'' } })
    } else {

      this.socketService.driversResponseEmit({ res: 'reject', id: ride._id })
    }


  }
  // forCurrentlocation() {

  //   if (navigator.geolocation) {
  //     // Get the user's current position
  //     let z = navigator.geolocation.getCurrentPosition((position) => {

  //       console.log(position.coords.latitude);
  //       console.log(position.coords.longitude);

  //       let data = {
  //         lat: position.coords.latitude,
  //         lng: position.coords.longitude
  //       }
  //       return data
  //       // const latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
  //       // console.log(latLng);
  //       console.log(z);
  //     });
  //   } else {
  //     console.log("Geolocation is not supported by this browser.");
  //   }


  // }

  // forDirectionToDrop() {
  //   if (navigator.geolocation) {
  //     navigator.geolocation.watchPosition((position) => {
  //       const latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

  //       // Center the map on the user's current location
  //       this.map.setCenter(latLng);
  //       const userMarker = new google.maps.Marker({
  //         position: latLng,
  //         map: this.map,
  //         title: 'Location',
  //         icon: {
  //           path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
  //           scale: 5,
  //         }
  //       });

  //       const directionsRenderer = new google.maps.DirectionsRenderer({
  //         map: this.map,
  //         markerOptions: {
  //           icon: {
  //             path: google.maps.SymbolPath.CIRCLE,
  //             scale: 4,
  //           }
  //         }
  //       });

  //       // Get the directions from the user's current location to the destination
  //       const directionsService = new google.maps.DirectionsService();
  //       const request = {
  //         origin: latLng,
  //         destination: this.currentRide.dropoff,
  //         travelMode: google.maps.TravelMode.DRIVING
  //       };
  //       directionsService.route(request, (response, status) => {
  //         if (status === 'OK') {
  //           // Set the directions on the DirectionsRenderer object
  //           directionsRenderer.setDirections(response);

  //           // Get the distance between the user's current location and the destination
  //           const distance = google.maps.geometry.spherical.computeDistanceBetween(
  //             latLng,
  //             response.routes[0].legs[0].end_location
  //           );

  //           console.log(distance);

  //           if (distance < 10) {  //10 meter
  //             console.log("dropped");
  //             this.status = "dropped"
  //             let id = this.currentRide._id
  //             this.socketService.changeDriverStatusEmit({ id: '6448b5b2541475ce64a83e7f', status: "online" })
  //             // this.socket.emit('driver_status_change',{id:'6448b5b2541475ce64a83e7f',status:"online"})
  //             directionsRenderer.setMap(null)
  //             this.socketService.changeRideStatusEmit({ id, status: "completed" })
  //             // this.socket.emit("status_change", { id, status: "completed" })

  //           }
  //         } else {
  //           window.alert('Directions request failed due to ' + status);
  //         }
  //       });
  //     }, (error) => {
  //       console.log('Error getting current position:', error);
  //     });
  //   } else {
  //     console.log('Geolocation is not supported by this browser.');
  //   }
  // }

  // forDirectionTouser() {
  //   if (navigator.geolocation) {
  //     navigator.geolocation.watchPosition((position) => {
  //       const latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

  //       // Center the map on the user's current location
  //       this.map.setCenter(latLng);

  //       // Create a new marker for the user's current location and add it to the map
  //       const userMarker = new google.maps.Marker({
  //         position: latLng,
  //         map: this.map,
  //         title: 'Location',
  //         icon: {
  //           path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
  //           scale: 5,
  //         }
  //       });

  //       // Initialize a new DirectionsRenderer object and bind it to the map
  //       const directionsRenderer = new google.maps.DirectionsRenderer({
  //         map: this.map,
  //         markerOptions: {
  //           icon: {
  //             path: google.maps.SymbolPath.CIRCLE,
  //             scale: 4,
  //           }
  //         }
  //       });

  //       // Get the directions from the user's current location to the destination
  //       const directionsService = new google.maps.DirectionsService();
  //       const request = {
  //         origin: latLng,
  //         destination: this.currentRide.pickup,
  //         travelMode: google.maps.TravelMode.DRIVING
  //       };

  //       directionsService.route(request, (response, status) => {
  //         if (status === 'OK') {
  //           // Set the directions on the DirectionsRenderer object
  //           directionsRenderer.setDirections(response);

  //           // Get the distance between the user's current location and the destination
  //           const distance = google.maps.geometry.spherical.computeDistanceBetween(
  //             latLng,
  //             response.routes[0].legs[0].end_location
  //           );

  //           console.log(distance);

  //           if (distance < 1000000) {
  //             console.log("avi gyo");
  //             this.status = "arrived"
  //             let id = this.currentRide._id
  //             directionsRenderer.setMap(null)
  //             this.socketService.changeRideStatusEmit({ id, status: "arrived" })
  //             // this.socket.emit("status_change", { id, status: "arrived" })
  //           }
  //         } else {
  //           window.alert('Directions request failed due to ' + status);
  //         }
  //       });
  //     }, (error) => {
  //       console.log('Error getting current position:', error);
  //     });
  //   } else {
  //     console.log('Geolocation is not supported by this browser.');
  //   }
  // }

  // initMap() {
  //   let option = {
  //     zoom: 8,
  //     center: { lat: 22, lng: 22 },
  //     animation: google.maps.Animation.DROP

  //   }
  //   this.map = new google.maps.Map(document.getElementById('map') as HTMLElement, option)




  // }


  // initDriverLocationSubscription(): void {
  //   this.socket.emit('driver-location', this.correntPosition)

  // }


  getRunningRequest() {
    this.driverService.getRunningRequest().subscribe({
      next: (data: any) => {

        this.allrides = data

        this.allrides.forEach((each) => {

          this.timer(each._id)
          this.startCountdown(each._id, (30 - each.remainingSeconds))

        })




      }, error: (error) => {
        console.log(error);
      }
    })
  }


  timer(id: any) {
    let index = this.allrides.findIndex((element: any) => element._id === id);
    if (index !== -1) {
      let count = this.allrides[index].remainingSeconds

      let z = setInterval(() => {

        count++
        if (this.allrides[index]?.remainingSeconds == 29) {
          console.log('done');
          clearInterval(z)
          return

        } else {
          if (this.allrides[index]?.remainingSeconds) {
            this.allrides[index].remainingSeconds = count

          }
        }
      }, 1000)
    }


  }



  startCountdown(id: number, seconds: number) {
    if (this.countDowns$[id]) {
      return; // Timer with the same id already exists
    }

    const timer$ = interval(1000).pipe(
      map(t => seconds - t),
      takeWhile(t => t >= 0)
    );

    this.countDowns$[id] = timer$;

    timer$.subscribe(
      t => {
        if (t === 1) {
          this.stopCountdown(id);
        }
      },
      err => {
        console.error('An error occurred:', err);
        this.stopCountdown(id);
      }
    );

    this.timers.push({ id, seconds });
  }



  stopCountdown(id: number) {
    delete this.countDowns$[id];
    this.timers = this.timers.filter(timer => timer.id !== id);
  }



}


