import { SimpleChanges } from '@angular/core';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DriversService } from 'src/app/services/drivers.service';
import { SocketService } from 'src/app/services/soketio.service';
import io from 'socket.io-client/dist/socket.io.js';
import { RidesService } from 'src/app/services/rides.service';
import { CreateRequestComponent } from '../create-request/create-request.component';
import { PricingService } from 'src/app/services/pricing.servive';
import { Subscription, async } from 'rxjs';
import { Socket } from 'ngx-socket-io';




let infoWindow: google.maps.InfoWindow
let map!: google.maps.Map
let marker: google.maps.Marker
let geocoder = new google.maps.Geocoder;
let service = new google.maps.DistanceMatrixService()
let directionsRenderer: google.maps.DirectionsRenderer;

@Component({
  selector: 'app-running-request',
  templateUrl: './running-request.component.html',
  styleUrls: ['./running-request.component.scss']
})
export class RunningRequestComponent {
  private socket: any
  s1 = []
  s2 = []
  ride: any
  Vehicles: any
  allrides: any = []
  z: any
  TotalDistance: any
  TotalTime: any
  map: any;
  marker: any;
  accepted: any
  driverLocationSubscription: Subscription;
  correntPosition: string = ""
  status: any
  markers = []
  @ViewChild('modals') modals!: ElementRef
  constructor(private driverService: DriversService, private rideService: RidesService, private pricingService: PricingService) {



    this.socket = io('http://localhost:3000', {
      forceNew: true,
      transports: ['websocket', 'polling']
    });

    this.socket.on('connect', () => {
      console.log('Connected to server');
    });


    this.socket.on('ride_request', (location) => {

      this.socket.emit('driver_status_change',{id:'6448b5b2541475ce64a83e7f',status:"busy"})

      console.log(location);
      this.ride = location
      this.openAssignDialog()
      setTimeout(() => {
        this.closeAssignDialog()
        this.socket.emit('driver_status_change',{id:'6448b5b2541475ce64a83e7f',status:"online"})


      }, 1000);


    })
    this.socket.on('status_change', (location) => {

      if (location.status == 'arrived') {

        this.forDirectionToDrop()
      }
      console.log("bar gyo");
    })

    this.toDriver()



  }
  ngOnInit(): void {
    // this.getRunningRequest()
    // if(this.accepted){

    // }

  }


  toDriver() {
    this.socket.on('toDriver', (data: any) => {
      this.ride = data
      this.openAssignDialog()
      setTimeout(() => {
        this.closeAssignDialog()



      }, 10000);
      let time = 1
      let int = setInterval(() => {
        console.log(time);
        time++

        if (time == 10) {
          console.log("work");
          clearInterval(int)
        }

      }, 1000)


    });


  }
  onAccept(id: any) {

    let data = {
      status: "accepted"

    }
    let res = {
      response:'accepted'
    }
    this.socket.emit('driver_status_change',{id:'6448b5b2541475ce64a83e7f',status:"busy"})

    this.socket.emit('check_driver',res)
    this.rideService.RideStatus(id, data).subscribe({
      next: async (data) => {
        this.allrides.push(this.ride)
        this.initMap()


        this.forDirectionTouser()
        this.socket.emit('accept_ride', this.ride)




      }, error: (error) => {
        console.log(error);
      }
    })

  }
  forCurrentlocation() {

    if (navigator.geolocation) {
      // Get the user's current position
      let z = navigator.geolocation.getCurrentPosition((position) => {

        console.log(position.coords.latitude);
        console.log(position.coords.longitude);

        let data = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        }
        return data
        // const latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        // console.log(latLng);
        console.log(z);
      });
    } else {
      console.log("Geolocation is not supported by this browser.");
    }


  }

  forDirectionToDrop() {
    if (navigator.geolocation) {
      navigator.geolocation.watchPosition((position) => {
        const latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

        // Center the map on the user's current location
        map.setCenter(latLng);
        const userMarker = new google.maps.Marker({
          position: latLng,
          map: map,
          title: 'Location',
          icon: {
            path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
            scale: 5,
          }
        });

        // Create a new marker for the user's current location and add it to the map
        // const marker = new google.maps.Marker({
        //   position: latLng,
        //   map: map,
        //   title: 'Current Location'
        // });
        // Initialize a new DirectionsRenderer object and bind it to the map
        const directionsRenderer = new google.maps.DirectionsRenderer({
          map: map,
          markerOptions: {
            icon: {
              path: google.maps.SymbolPath.CIRCLE,
              scale: 4,
            }
          }
        });

        // Get the directions from the user's current location to the destination
        const directionsService = new google.maps.DirectionsService();
        const request = {
          origin: latLng,
          destination: this.ride.dropoff,
          travelMode: google.maps.TravelMode.DRIVING
        };
        directionsService.route(request, (response, status) => {
          if (status === 'OK') {
            // Set the directions on the DirectionsRenderer object
            directionsRenderer.setDirections(response);

            // Get the distance between the user's current location and the destination
            const distance = google.maps.geometry.spherical.computeDistanceBetween(
              latLng,
              response.routes[0].legs[0].end_location
            );

            console.log(distance);

            if (distance < 100000000) {  //10 meter
              console.log("dropped");
              this.status = "dropped"
              let id = this.ride._id
              this.socket.emit('driver_status_change',{id:'6448b5b2541475ce64a83e7f',status:"online"})
              directionsRenderer.setMap(null)

              this.socket.emit("status_change", { id, status: "completed" })

            }
          } else {
            window.alert('Directions request failed due to ' + status);
          }
        });
      }, (error) => {
        console.log('Error getting current position:', error);
      });
    } else {
      console.log('Geolocation is not supported by this browser.');
    }
  }
  // forDirectionTouser() {
  //   if (navigator.geolocation) {
  //     navigator.geolocation.watchPosition((position) => {
  //       const latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

  //       // Center the map on the user's current location
  //       map.setCenter(latLng);

  //       // Create a new marker for the user's current location and add it to the map
  //       const marker = new google.maps.Marker({
  //         position: latLng,
  //         map: map,
  //         title: ' Location'
  //       });
  //       // Initialize a new DirectionsRenderer object and bind it to the map
  //       const directionsRenderer = new google.maps.DirectionsRenderer({
  //         map: map,
  //         markerOptions: {
  //           icon: {
  //             path:google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
  //             scale: 10,
  //           }
  //         }
  //       });

  //       // Get the directions from the user's current location to the destination
  //       const directionsService = new google.maps.DirectionsService();
  //       const request = {
  //         origin: latLng,
  //         destination: this.ride.pickup,
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
  //             console.log("avi gyo");
  //             this.status = "arrived"
  //             let id = this.ride._id
  //             // directionsRenderer.setMap(null)
  //             this.socket.emit("status_change", { id, status: "arrived" })
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

  forDirectionTouser() {
    if (navigator.geolocation) {
      navigator.geolocation.watchPosition((position) => {
        const latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

        // Center the map on the user's current location
        map.setCenter(latLng);

        // Create a new marker for the user's current location and add it to the map
        const userMarker = new google.maps.Marker({
          position: latLng,
          map: map,
          title: 'Location',
          icon: {
            path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
            scale: 5,
          }
        });

        // Initialize a new DirectionsRenderer object and bind it to the map
        const directionsRenderer = new google.maps.DirectionsRenderer({
          map: map,
          markerOptions: {
            icon: {
              path: google.maps.SymbolPath.CIRCLE,
              scale: 4,
            }
          }
        });

        // Get the directions from the user's current location to the destination
        const directionsService = new google.maps.DirectionsService();
        const request = {
          origin: latLng,
          destination: this.ride.pickup,
          travelMode: google.maps.TravelMode.DRIVING
        };

        directionsService.route(request, (response, status) => {
          if (status === 'OK') {
            // Set the directions on the DirectionsRenderer object
            directionsRenderer.setDirections(response);

            // Get the distance between the user's current location and the destination
            const distance = google.maps.geometry.spherical.computeDistanceBetween(
              latLng,
              response.routes[0].legs[0].end_location
            );

            console.log(distance);

            if (distance < 100000000) {  //10 meter
              console.log("avi gyo");
              this.status = "arrived"
              let id = this.ride._id
              directionsRenderer.setMap(null)
              this.socket.emit("status_change", { id, status: "arrived" })
            }
          } else {
            window.alert('Directions request failed due to ' + status);
          }
        });
      }, (error) => {
        console.log('Error getting current position:', error);
      });
    } else {
      console.log('Geolocation is not supported by this browser.');
    }
  }








  openAssignDialog() {
    document.getElementById('modals').style.display = 'block';
    // this.assignDialog.nativeElement.style.display = 'block';
    // document.body.classList.add('modal-open');



  }

  closeAssignDialog() {
    this.allrides = []
    // document.getElementById('modal').style.display =  'none';

    this.modals.nativeElement.style.display = 'none';
    // document.body.classList.remove('modal-open');
  }


  initMap() {
    let option = {
      zoom: 8,
      center: { lat: 22, lng: 22 },
      animation: google.maps.Animation.DROP

    }
    map = new google.maps.Map(document.getElementById('map') as HTMLElement, option)




  }



  // showRoute() {
  //   // let fromEL = document.getElementById('pickup') as HTMLInputElement
  //   // let toEL = document.getElementById('dropoff') as HTMLInputElement
  //   console.log(this.correntPosition);

  //   let origin = this.correntPosition
  //   let destination = this.ride.dropoff
  //   this.forDrawPath(origin, destination)


  // }
  // getDistance() {

  //   // let fromEL = document.getElementById('pickup') as HTMLInputElement
  //   // let toEL = document.getElementById('dropoff') as HTMLInputElement
  //   let origin = this.correntPosition
  //   let destination = this.ride.dropoff
  //   service.getDistanceMatrix(
  //     {
  //       origins: [origin],
  //       destinations: [destination],
  //       travelMode: google.maps.TravelMode.DRIVING,
  //       unitSystem: google.maps.UnitSystem.IMPERIAL,
  //       avoidHighways: false,
  //       avoidTolls: false

  //     }, (data: any) => {





  //       // this.forDrawPath(origin, destination)

  //     }
  //   )

  // }
  // forDrawPath(origin: any, destination: any) {
  //   this.getDistance()
  //   var directionsService = new google.maps.DirectionsService();
  //   var directionsRenderer = new google.maps.DirectionsRenderer({
  //     map: map
  //   });

  //   var request: any = {
  //     origin: origin,
  //     destination: destination,
  //     travelMode: 'DRIVING'
  //   };

  //   directionsService.route(request, function (result: any, status) {
  //     if (status == 'OK') {
  //       directionsRenderer.setDirections(result);
  //       var route = result.routes[0];
  //       var path = [];

  //       for (var i = 0; i < route.legs.length; i++) {
  //         var leg = route.legs[i];
  //         for (var j = 0; j < leg.steps.length; j++) {
  //           var step = leg.steps[j];
  //           for (var k = 0; k < step.path.length; k++) {
  //             path.push(step.path[k]);
  //           }
  //         }
  //       }

  //       var polyline = new google.maps.Polyline({
  //         path: path,
  //         geodesic: true,
  //         strokeColor: '#FF0000',
  //         strokeOpacity: 1.0,
  //         strokeWeight: 2
  //       });

  //       polyline.setMap(map);
  //     }
  //   });

  // }
  initDriverLocationSubscription(): void {
    this.socket.emit('driver-location', this.correntPosition)



  }


  getRunningRequest() {
    this.driverService.driversCurrentRide().subscribe({
      next: (data: any) => {

        if (data[0].currentride !== "none") {
          this.ride = data[0].currentride
          this.initMap()
          if (this.status == 'arrived') {
            this.forDirectionToDrop
          } else {
            this.forDirectionTouser()

          }


        }

        console.log(data[0].currentride);
      }, error: (error) => {
        console.log(error);
      }
    })

  }

}


