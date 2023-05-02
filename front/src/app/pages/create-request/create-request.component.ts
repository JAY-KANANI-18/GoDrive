import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { DashService } from 'src/app/services/dashboard.service';
import { PricingService } from 'src/app/services/pricing.servive';
import { RidesService } from 'src/app/services/rides.service';
import { SocketService } from 'src/app/services/soketio.service';
import { UsersService } from 'src/app/services/users.service';
import { ChangeDetectorRef } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';



let infoWindow: google.maps.InfoWindow
let map!: google.maps.Map
let marker: google.maps.Marker
let geocoder = new google.maps.Geocoder;
let service = new google.maps.DistanceMatrixService()

@Component({
  selector: 'app-create-request',
  templateUrl: './create-request.component.html',
  styleUrls: ['./create-request.component.scss']
})
export class CreateRequestComponent implements OnInit {
  @ViewChild('stopContainer') stopContainer: ElementRef;

  TotalDistance: any
  TotalTime: any
  vT: any = []
  polygon: any
  pickUp: any
  dropOff: any
  allCallingCode: any
  city1: any
  city2: any
  ServiceFees: number
  group1 = true
  group2 = false
  group3 = false
  No_stops: any = 0
  stops_array = []
  ccVal = false

  myForm = new FormGroup({
    name: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email])
  });

  constructor(private dashservice: DashService, private pricingService: PricingService, private usersService: UsersService, private ridesService: RidesService, private sockService: SocketService, private renderer: Renderer2, private cdRef: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.getCallingCodes()
    this.forCurrentlocation()


  }




  forautostop() {

    // let el1:HTMLInputElement =
    // let el2 :HTMLInputElement=

    for (let i = 1; i < this.stopContainer.nativeElement.children.length + 1; i++) {
      const element = this.stopContainer.nativeElement.children.length[i];


      let autocomplete = new google.maps.places.Autocomplete(document.getElementById(`stop${i}`) as HTMLInputElement, {
        types: ['geocode'],

      })



      this.stopContainer.nativeElement.children.length

      google.maps.event.addListener(autocomplete, 'place_changed', () => {
        var place = autocomplete.getPlace()
        let lat = place.geometry?.location?.lat()
        let lng = place.geometry?.location?.lng()

        let selectedLocation: any = {
          lat,
          lng


        }

        this.getallzone(selectedLocation, `stop${i}`)



        this.initMap(selectedLocation)
        map.setCenter(selectedLocation)


        this.addMarker({ cords: selectedLocation, data: `stop${i}` })
        // this.showRoute()


      })




    }




  }
  forAutofordist() {

    // let el1:HTMLInputElement =
    // let el2 :HTMLInputElement=

    let autocomplete = new google.maps.places.Autocomplete(document.getElementById('pickup') as HTMLInputElement, {
      types: ['establishment'],

    })
    let autocomplete2 = new google.maps.places.Autocomplete(document.getElementById('dropoff') as HTMLInputElement, {
      types: ['establishment'],

    })


    this.stopContainer.nativeElement.children.length

    google.maps.event.addListener(autocomplete, 'place_changed', () => {
      var place = autocomplete.getPlace()
      let lat = place.geometry?.location?.lat()
      let lng = place.geometry?.location?.lng()

      let selectedLocation: any = {
        lat,
        lng


      }

      this.getallzone(selectedLocation, "pickup")



      this.initMap(selectedLocation)
      map.setCenter(selectedLocation)


      this.addMarker({ cords: selectedLocation, data: "pickup" })

    })




    google.maps.event.addListener(autocomplete2, 'place_changed', () => {
      var place = autocomplete2.getPlace()
      let lat = place.geometry?.location?.lat()
      let lng = place.geometry?.location?.lng()

      let sselectedLocation: any = {
        lat,
        lng


      }
      // this.getOneVehiclePricing(sselectedLocation.lat,sselectedLocation.lng)
      // this.getallzone()

      this.getallzone(sselectedLocation, "dropoff")
      this.initMap(sselectedLocation)

      map.setCenter(sselectedLocation)

      this.addMarker({ cords: sselectedLocation, data: "dropoff" })
      // this.forholy()
      this.showRoute()


    })




  }



  forholy(cors: any, name: any, location: any) {

    const polygon = new google.maps.Polygon({
      paths: cors,
      strokeColor: "#FF0000",
      strokeOpacity: 0.0,
      strokeWeight: 2,
      fillColor: "#FF0000",
      fillOpacity: 0,
      editable: false,
      draggable: false
    });
    this.polygon = polygon


    polygon.setMap(map);



  }


  addMarker(props: { cords: any, data?: any }) {

    marker = new google.maps.Marker({
      position: props.cords,
      map: map,
      draggable: true, // set draggable option to true
      title: 'Drag me!'

    })




    marker.addListener('click', () => {
      infoWindow.open(map, marker)
    })


    google.maps.event.addListener(marker, 'dragend', function () {
      let newplace = marker.getPosition();
      geocoder.geocode({ location: newplace }, function (results: any, status) {
        if (status === 'OK') {
          if (results[0]) {

            let ele = document.getElementById(props.data) as HTMLInputElement
            ele.value = results[0].formatted_address

          } else {
            window.alert('No results found');
          }
        } else {
          window.alert('Geocoder failed due to: ' + status);
        }
      });
    });



  }



  forCurrentlocation() {

    navigator.geolocation.getCurrentPosition((position) => {
      let data = {
        lat: position.coords.latitude,
        lng: position.coords.longitude

      }
      this.initMap(data)
      this.addMarker({ cords: data, data: "pickup" },)



      let newplace = marker.getPosition();

      geocoder.geocode({ location: newplace }, function (results: any, status) {
        if (status === 'OK') {
          if (results[0]) {

            setTimeout(() => {


              let ele = document.getElementById('pickup') as HTMLInputElement
              if (ele) {
                ele.value = results[0].formatted_address

              }

            }, 1000);
          } else {
            window.alert('No results found');
          }
        } else {
          window.alert('Geocoder failed due to: ' + status);
        }
      });

    })





  }
  initMap(data: any) {
    let option = {
      zoom: 8,
      center: data,
      animation: google.maps.Animation.DROP

    }
    map = new google.maps.Map(document.getElementById('map') as HTMLElement, option)




  }
  showRoute() {
    let fromEL = document.getElementById('pickup') as HTMLInputElement
    let toEL = document.getElementById('dropoff') as HTMLInputElement
    let origin = fromEL.value
    let destination = toEL.value
    this.forDrawPath(origin, destination)


  }
  // getDistance() {

  //   let fromEL = document.getElementById('pickup') as HTMLInputElement
  //   let toEL = document.getElementById('dropoff') as HTMLInputElement
  //   let origin = fromEL.value
  //   let destination = toEL.value
  //   service.getDistanceMatrix(
  //     {
  //       origins: [origin],
  //       destinations: [destination],
  //       travelMode: google.maps.TravelMode.DRIVING,
  //       unitSystem: google.maps.UnitSystem.IMPERIAL,
  //       avoidHighways: false,
  //       avoidTolls: false

  //     }, (data: any) => {
  //       this.TotalDistance = data.rows[0].elements[0].distance.text
  //       console.log(this.TotalDistance);
  //       this.TotalDistance = this.TotalDistance.replace(/mi(?!.*mi)/, "")
  //       this.TotalDistance = this.TotalDistance * 1.60934



  //       this.TotalTime = data.rows[0].elements[0].duration.text.replace(/mins(?!.*mins)/, "")

  //       console.log(this.TotalTime);
  //       // this.forDrawPath(origin, destination)

  //     }
  //   )

  // }
  getDistance() {
    let fromEL = document.getElementById('pickup') as HTMLInputElement;
    let toEL = document.getElementById('dropoff') as HTMLInputElement;
    let origin = fromEL.value;
    let destination = toEL.value;

    service.getDistanceMatrix(
      {
        origins: [origin],
        destinations: [destination],
        travelMode: google.maps.TravelMode.DRIVING,
        unitSystem: google.maps.UnitSystem.IMPERIAL,
        avoidHighways: false,
        avoidTolls: false
      },
      (data: any) => {
        this.TotalDistance = data.rows[0].elements[0].distance.text;
        console.log(this.TotalDistance);
        this.TotalDistance = this.TotalDistance.replace(/mi(?!.*mi)/, "");
        this.TotalDistance = this.TotalDistance * 1.60934;

        this.TotalTime = data.rows[0].elements[0].duration.text;
        const durationArray = this.TotalTime.split(' ');
        if (durationArray[1] === 'mins') {
          this.TotalTime = durationArray[0];
        } else if (durationArray[1] === 'hours') {
          this.TotalTime = (+durationArray[0] * 60 + +durationArray[2]).toString();
        } else {
          // Handle other cases if necessary
        }
        console.log(this.TotalTime);
        // this.forDrawPath(origin, destination);
      }
    );
  }

  forDrawPath(origin: any, destination: any) {


    for (let i = 0; i < this.No_stops; i++) {
      let val = document.getElementById(`stop${i + 1}`) as HTMLInputElement


      this.stops_array.push({
        location: val.value,
        stopover: true
      })


    }
    this.getDistance()
    var directionsService = new google.maps.DirectionsService();
    var directionsRenderer = new google.maps.DirectionsRenderer({
      map: map
    });
    console.log(this.stops_array);

    var request: any = {
      origin: origin,
      destination: destination,
      waypoints: this.stops_array,
      travelMode: 'DRIVING'
    };

    directionsService.route(request, function (result: any, status) {
      if (status == 'OK') {
        directionsRenderer.setDirections(result);
        var route = result.routes[0];
        var path = [];


      }
    });

  }

  onInput(value: any) {
    let cc = document.getElementById('CallingCode') as HTMLInputElement

    if (cc.value == '') {
      console.log('khali he topa');
      this.ccVal = true

    }



    if (value.length === 10) {

      let data = {
        number: cc.value + "-" + value
      }
      this.usersService.getAddedUser(data).subscribe((data: any) => {
        let el1 = document.getElementById('email') as HTMLInputElement
        let el2 = document.getElementById('name') as HTMLInputElement
        console.log(data);
        if (!data) {

          el1.value = ''
          el2.value = ''
          this.renderer.removeAttribute(el1, 'disabled');
          this.renderer.removeAttribute(el2, 'disabled');

        } else {

          el1.value = data.email
          el2.value = data.name
          this.renderer.setAttribute(el1, 'disabled', 'true');
          this.renderer.setAttribute(el2, 'disabled', 'true');
          this.cdRef.detectChanges();
        }




      })
    }
  }
  onChange() {
    this.ngOnInit()
  }

  BookRide(data: any) {


    let name = document.getElementById('name') as HTMLInputElement
    let email = document.getElementById('email') as HTMLInputElement
    let phone = document.getElementById('phone') as HTMLInputElement
    let pickup = document.getElementById('pickup') as HTMLInputElement
    let dropoff = document.getElementById('dropoff') as HTMLInputElement
    let vehicle = document.getElementById('vehicle') as HTMLInputElement

    // const formObj = new FormData()
    // console.log(name.value);

    // formObj.append("name",name.value)
    // formObj.append("email",email.value)
    // formObj.append("phone",phone.value)
    // formObj.append("pickup",pickup.value)
    // formObj.append("dropoff",dropoff.value)
    // formObj.append("vehicle",vehicle.value)
    // formObj.append("distance",this.TotalDistance)
    // formObj.append("time",this.TotalTime)


    let rideDetail = {
      name: name.value,
      email: email.value,
      phone: phone.value,
      pickup: pickup.value,
      dropoff: dropoff.value,
      vehicle: vehicle.value,
      distance: this.TotalDistance,
      time: this.TotalTime,
      bookingtime: new Date(),
      status: 'pending'


    }

    this.ridesService.addRide(rideDetail).subscribe((data: any) => {
      console.log(data);
    })


  }
  getOneVehiclePricing(city:any,vehicle:any) {

    this.pricingService.getServicePricing(city,vehicle).subscribe({
      next: (data: any) => {
        console.log('fwfureferferfge',data);
        let driverProfit = data.driverprofit
        let minFare = data.minfare
        let basePriceDistance = data.distanceforbaseprice
        let baseprice: number = data.baseprice
        let unitDistancePrice = data.priceperunitdistance
        let unitTimePrice = data.priceperunittime


        let DistancePrice: number
        let TimePrice:number = this.TotalTime

        if (this.TotalDistance <= 1) {
          DistancePrice = 0

        } else {
          DistancePrice = (this.TotalDistance - 1) * (unitDistancePrice)

        }

        let ServiceFees:number = DistancePrice + TimePrice + baseprice
        console.log("ServiceFees", this.ServiceFees);
        console.log("DistancePrice", DistancePrice);
        console.log("TimePrice", TimePrice);
        console.log("baseprice", baseprice);
        this.ServiceFees = ServiceFees






      }
    })

  }
  getallzone(sselectedLocation: any, type: any) {
    this.pricingService.getallzone().subscribe({
      next: (data: any) => {


        data.forEach((each: any) => {


          this.forholy(each.city.zone, each.city.name, sselectedLocation)
          if (google.maps.geometry.poly.containsLocation(sselectedLocation, this.polygon)) {
            console.log(`The location is inside polygon `);

            if (type == "dropoff") {
              this.city1 = each.city.name
              console.log("111111", each.city.name);
              return

            } else if (type == "pickup") {
              this.city2 = each.city.name
              this.getCityVehicles(this.city2)

              return
              console.log('22222222222222', each.city.name);

            }

            if (this.city1 == this.city2) {

              console.log('ayu');

              // this.getOneVehiclePricing(this.city2)
              // this.getCityVehicles(this.city2)

            }
          } else {

          }


        });

        // if(!this.city2){
        //   alert('service not available at your ')
        //   this.forCurrentlocation()

        // }

      }, error: (error) => {
        console.log(error);

      }
    })

  }


  getCityVehicles(city: any) {
    this.pricingService.getVehiclesType(city).subscribe((data: any) => {
      this.vT = data
      this.cdRef.detectChanges();

      console.log(this.vT);

    })

  }
  getCallingCodes() {
    this.pricingService.allCallingCodes().subscribe({
      next: (data: any) => {
        this.allCallingCode = data
      }
    })
  }
  onNext() {

    this.group2 = true
    this.group1 = false
    this.forCurrentlocation()
    setTimeout(() => {
      this.forAutofordist()

    }, 100);

  }

  addStop() {

    this.No_stops++
    const stopNumber = this.stopContainer.nativeElement.children.length + 1;
    const label = this.renderer.createElement('label');
    const labelText = this.renderer.createText(`Stop ${stopNumber}: `);
    const input = this.renderer.createElement('input');
    this.renderer.setProperty(input, 'type', 'text');
    this.renderer.setProperty(input, 'id', `stop${stopNumber}`);
    this.renderer.setProperty(input, 'name', `stop${stopNumber}`);

    this.renderer.appendChild(label, labelText);
    this.renderer.appendChild(label, input);
    this.renderer.appendChild(this.stopContainer.nativeElement, label);



    setTimeout(() => {

      this.forautostop()
    }, 100);
  }
  onSelect(vehicle:any){
    console.log('work');
    this.getOneVehiclePricing(this.city2,vehicle)

  }

}
