import {
  Component,
  ElementRef,
  OnInit,
  Renderer2,
  ViewChild,
} from "@angular/core";
import { PricingService } from "src/app/services/pricing.servive";
import { RidesService } from "src/app/services/rides.service";
import { SocketService } from "src/app/services/soketio.service";
import { UsersService } from "src/app/services/users.service";
import { ChangeDetectorRef } from "@angular/core";
import {
  Form,
  FormArray,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import {
  Stripe,
  StripeCardElement,
  StripeCardElementOptions,
  StripeElements,
} from "@stripe/stripe-js";

import { loadStripe } from "@stripe/stripe-js";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { Router } from "@angular/router";
import { SettingsService } from "src/app/services/setting.service";
import { environment } from "src/environments/environment";

let infoWindow: google.maps.InfoWindow;
let map!: google.maps.Map;
let marker: google.maps.Marker;
@Component({
  selector: "app-create-request",
  templateUrl: "./create-request.component.html",
  styleUrls: ["./create-request.component.scss"],
})
export class CreateRequestComponent implements OnInit {
  // @ViewChild("stopContainer") stopContainer: ElementRef;
  options = [
    { value: 1, label: 'Option 1', image: '/src/assets/img/godrivePNG.png' },
    { value: 2, label: 'Option 2', image: '/src/assets/img/godrivePNG.png' },
    { value: 3, label: 'Option 3', image: '/src/assets/img/godrivePNG.png' }
  ];
  private city2: any;
  private city1: any;
  private UserId: any;
  private city2Obj: any;
  private cardElement: any;
  private stops_array = [];
  private selectedCard: any;
  private DistanceInfo = {};
  private No_stops: any = 0;
  private BookingForm: FormGroup;
  private directionsRenderer = new google.maps.DirectionsRenderer();
  private directionsService = new google.maps.DirectionsService();
  private service = new google.maps.DistanceMatrixService();
  private geocoder = new google.maps.Geocoder();
  private stripe: Stripe;
  private Max_stops: any;
  private stripePromise = loadStripe(environment.stripe.apiKey);
  private locObj: any = {};

  public vT: any = [];
  public selectedOption: any;
  public pickerr: any;
  public group21: any;
  public allCards: any;
  public TotalTime: any;
  public ServiceFees: any;
  public TotalDistance: any;
  public allCallingCode: any;
  public selectedbooking: any;
  public group3 = false;
  public group2 = false;
  public ccVal = false;
  public group1 = true;
  public default_method: any;

  constructor(
    private pricingService: PricingService,
    private usersService: UsersService,
    private ridesService: RidesService,
    private renderer: Renderer2,
    public cdRef: ChangeDetectorRef,
    private toster: ToastrService,
    private router: Router,
    private settingsService: SettingsService
  ) { }

  async ngOnInit() {
    this.usersService.getSettings();
    this.initMap();
    this.getCallingCodes();
    this.forCurrentlocation();
    this.getMaxStops();
    this.createBookingForm();
  }
  createBookingForm() {
    this.BookingForm = new FormGroup({
      pickup: new FormControl(null, [Validators.required]),
      dropoff: new FormControl(null, [Validators.required]),
      vehicle: new FormControl(null, [Validators.required]),
      bookingtype: new FormControl(null, [Validators.required]),
      date: new FormControl(null),
      time: new FormControl(null),
      stops: new FormArray([]),
      paymentOption: new FormControl(null, [Validators.required]),
      card: new FormControl(null),
    });
  }
  @ViewChild("bookingform") bookingform: ElementRef;

  forautostop(i: any) {
    let autocomplete = new google.maps.places.Autocomplete(
      document.getElementById(`stop${i}`) as HTMLInputElement,
      {
        types: ["establishment"],
      }
    );

    google.maps.event.addListener(autocomplete, "place_changed", () => {
      var place = autocomplete.getPlace();
      let lat = place.geometry?.location?.lat();
      let lng = place.geometry?.location?.lng();
      let selectedLocation: any = {
        lat,
        lng,
      };
      this.TotalTime = null
      this.ServiceFees = null
      this.TotalDistance = null
      this.locObj[`stop${i}`] = selectedLocation;
      let address = place.formatted_address;

      this.locObj[`stop${i}`]["address"] = address;
      map.setCenter(selectedLocation);
      this.addMarker({ cords: selectedLocation, data: `stop${i}` });
    });

    // }
  }

  forAutofordist() {
    let autocomplete = new google.maps.places.Autocomplete(
      document.getElementById("pickup") as HTMLInputElement,
      {
        types: ["establishment"],
      }
    );
    let autocomplete2 = new google.maps.places.Autocomplete(
      document.getElementById("dropoff") as HTMLInputElement,
      {
        types: ["establishment"],
      }
    );

    // this.stopContainer.nativeElement.children.length;

    google.maps.event.addListener(autocomplete, "place_changed", () => {
      var place = autocomplete.getPlace();
      let lat = place.geometry?.location?.lat();
      let lng = place.geometry?.location?.lng();

      let selectedLocation: any = {
        lat,
        lng,
      };
      this.locObj[`pickup`] = selectedLocation;
      let address = place.formatted_address;

      this.locObj.pickup["address"] = address;

      this.getcity(selectedLocation, "pickup");

      map.setCenter(selectedLocation);

      this.addMarker({ cords: selectedLocation, data: "pickup" });
    });

    google.maps.event.addListener(autocomplete2, "place_changed", () => {
      var place = autocomplete2.getPlace();
      let lat = place.geometry?.location?.lat();
      let lng = place.geometry?.location?.lng();

      let sselectedLocation: any = {
        lat,
        lng,
      };
      this.locObj[`dropoff`] = sselectedLocation;

      let address = place.formatted_address;
      this.locObj.dropoff["address"] = address;

      // if (this.BookingForm) {
      //   this.BookingForm.patchValue({
      //     dropoff: address,
      //   });
      // }

      this.cdRef.detectChanges();
      // this.getcity(sselectedLocation, "dropoff");

      map.setCenter(sselectedLocation);

      this.addMarker({ cords: sselectedLocation, data: "dropoff" });
    });
  }

  addMarker(props: { cords: any; data?: any }) {
    this.directionsRenderer.setMap(null);

    if (marker) {
      marker.setMap(null);
    }
    marker = new google.maps.Marker({
      position: props.cords,
      map: map,
      draggable: true,
      title: "Drag me!",
    });

    // marker.addListener("click", () => {
    //   infoWindow.open(map, marker);
    // });

    google.maps.event.addListener(marker, "dragend", () => {
      let newplace = marker.getPosition();
      this.geocoder.geocode({ location: newplace }, (results: any, status) => {
        if (status === "OK") {
          if (results[0]) {
            if (document.getElementById(props.data) as HTMLInputElement) {
              let ele = document.getElementById(props.data) as HTMLInputElement;
              let lat = results[0].geometry?.location?.lat();
              let lng = results[0].geometry?.location?.lng();

              let sselectedLocation: any = {
                lat,
                lng,
              };

              this.locObj[props.data] = sselectedLocation;

              let address = results[0].formatted_address;
              this.locObj[props.data]["address"] = address;

              if (props.data == "pickup") {
                this.getcity(sselectedLocation, "pickup");
              }
              ele.value = results[0].formatted_address;
            }
          } else {
            window.alert("No results found");
          }
        } else {
          window.alert("Geocoder failed due to: " + status);
        }
      });
    });
  }

  forCurrentlocation() {
    navigator.geolocation.getCurrentPosition((position) => {
      let data = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };
      map.setCenter(data);
      this.addMarker({ cords: data, data: "pickup" });

      let newplace = marker.getPosition();

      this.geocoder.geocode({ location: newplace }, (results: any, status) => {
        if (status === "OK") {
          if (results[0]) {
            if (this.BookingForm) {
              this.BookingForm.patchValue({
                pickup: results[0].formatted_address,
              });
            }

            // setTimeout(() => {
            //   if (document.getElementById("pickup") as HTMLInputElement) {
            //     let ele = document.getElementById("pickup") as HTMLInputElement;
            //     ele.value = results[0].formatted_address;
            //   }
            // }, 100);
            
            let selectedLocation: any = {
              lat: results[0].geometry.location.lat(),
              lng: results[0].geometry.location.lng(),
            };

            this.locObj[`pickup`] = selectedLocation;
            let address = results[0].formatted_address;
            this.locObj.pickup["address"] = address;

            this.getcity(selectedLocation, "pickup");
          } else {
            window.alert("No results found");
          }
        } else {
          window.alert("Geocoder failed due to: " + status);
        }
      });
    });
  }

  initMap() {
    let option = {
      zoom: 8,
      animation: google.maps.Animation.DROP,
    };
    map = new google.maps.Map(
      document.getElementById("map") as HTMLElement,
      option
    );
  }

  showRoute() {
    // if (!this.city1 || !this.city2) {
    //   return;
    // }

    let country1 = this.locObj.pickup.address.split(",");
    let country2 = this.locObj.dropoff.address.split(",");
    console.log(country1, country2);
    if (country1[country1.length - 1] != country2[country2.length - 1]) {
      this.pickupError();
      this.toster.error('Ride Should be Within Country')
      return
    }

    let fromEL = document.getElementById("pickup") as HTMLInputElement;
    let toEL = document.getElementById("dropoff") as HTMLInputElement;

    let origin = fromEL.value;
    let destination = toEL.value;

    if (!origin) {
      this.toster.error("Pick Up Location Required");
      return;
    } else if (!destination) {
      this.toster.error("Drop Off Location Required");

      return;
    }

    this.forDrawPath(origin, destination);
  }

  forDrawPath(origin: any, destination: any) {

    console.log(origin,destination);
    this.stops_array = [];
    let stops = [];
    for (
      let i = 0;
      i < (this.BookingForm.get("stops") as FormArray).length;
      i++
    ) {
      let val = (document.getElementById(`stop${i + 1}`) as HTMLInputElement)
        .value;

      if (val) {
        stops.push({
          location: val,
          stopover: true,
        });
        this.stops_array.push(val);
      }
    }
    this.directionsRenderer.setMap(map);
    var request: any = {
      origin: origin,
      destination: destination,
      waypoints: stops,
      travelMode: "DRIVING",
    };

    this.directionsService.route(request, (result: any, status) => {

      console.log(status);
      if (status == "OK") {

          this.BookingForm.patchValue({
      vehicle:null
    })
    this.TotalTime = null
    this.ServiceFees = null
    this.TotalDistance = null
        // marker.setMap(null);

        let routes = result.routes[0].legs;
        let distance = 0;
        let time = 0;
        for (let route of routes) {
          let rdist = route.distance.value;
          let rtime = route.duration.value;
          distance = distance + rdist;
          time = time + rtime;
        }
        if (marker) {
          marker.setMap(null)
        }

        this.directionsRenderer.setDirections(result);



        if (!this.group21) {

          let lat = this.locObj.pickup.lat
          let lng = this.locObj.pickup.lng
          let pickupLoc = {
            lat, lng

          }
          this.getcity(pickupLoc, "pickup");
          this.group21 = true

        }




        this.DistanceInfo["distance"] = distance / 1000;
        this.DistanceInfo["time"] = time / 60;


        this.TotalDistance = this.DistanceInfo['distance']
        this.TotalTime = this.DistanceInfo['time'].toFixed(2)



        if (this.BookingForm.value.vehicle == 'null') {
          return
        }

        this.getCityVehicles(this.city2Obj._id, this.DistanceInfo["distance"], this.DistanceInfo["time"]);


        // this.getOneVehiclePricing(
        //   this.city2Obj._id,
        //   this.BookingForm.value.vehicle
        // );

        // if ((document.getElementById("vehicle") as HTMLSelectElement).value == 'null') {
        //   return
        // }

        // this.getOneVehiclePricing(
        //   this.city2Obj._id,
        //   (document.getElementById("vehicle") as HTMLSelectElement).value
        // );


      }
      if (status != "OK") {
        this.pickupError();
      }
    });
  }

  onInput(value: any) {
    let cc = document.getElementById("CallingCode") as HTMLInputElement;

    if (cc.value == "") {
      this.ccVal = true;
    }

    if (value.length === 10) {
      let data = {
        number: cc.value + "-" + value,
      };
      this.usersService.getAddedUser(data).subscribe({
        next: (res: any) => {
          // this.toster.success(res.msg);
          console.log(res);

          let data = res.user;

          let el1 = document.getElementById("email") as HTMLInputElement;
          let el2 = document.getElementById("name") as HTMLInputElement;
          // if (!data) {
          //   (
          //     document.getElementById("nextbtn") as HTMLInputElement
          //   ).style.display = "none";
          //   el1.value = "";
          //   el2.value = "";
          //   this.toster.warning("You have to havn't registerd", "");
          //   return;
          // } else {
          this.UserId = data._id;
          this.default_method = res.customer
          this.selectedCard = res.customer

          this.default_method =
            el1.value = data.email;
          el2.value = data.name;
          this.renderer.setAttribute(el1, "disabled", "true");
          this.renderer.setAttribute(el2, "disabled", "true");
          this.cdRef.detectChanges();
          (
            document.getElementById("nextbtn") as HTMLInputElement
          ).style.display = "inline-block";
          // }
        },
        error: (error) => {
          (document.getElementById("nextbtn") as HTMLInputElement).style.display = "none";
          let el1 = document.getElementById("email") as HTMLInputElement;
          let el2 = document.getElementById("name") as HTMLInputElement;
          el1.value = "";
          el2.value = "";

          this.toster.error(error.error.msg);
        },
      });
    } else {
      (document.getElementById("nextbtn") as HTMLInputElement).style.display = "none";
      let el1 = document.getElementById("email") as HTMLInputElement;
      let el2 = document.getElementById("name") as HTMLInputElement;
      el1.value = "";
      el2.value = "";

    }
  }
  DeleteStop(index: any) {
    (this.BookingForm.get("stops") as FormArray).controls.splice(index, 1);
    this.showRoute();
    // this.BookingForm.patchValue({
    //   vehicle:null
    // })
    // this.TotalTime = null
    // this.ServiceFees = null
    // this.TotalDistance = null

  }
  focuson(id: any) {
    this.hideOtthers()
    let pickup = (document.getElementById("pickup") as HTMLInputElement).value;
    if (this.locObj[id]?.lat && this.locObj[id]?.lng) {
      this.directionsRenderer.setMap(null);
      let lat = this.locObj[id].lat;
      let lng = this.locObj[id].lng;

      let cords = {
        lat,
        lng,
      };
      this.addMarker({ cords, data: id });
    }
  }

  BookRide() {
    let pickup = document.getElementById("pickup") as HTMLInputElement;
    let dropoff = document.getElementById("dropoff") as HTMLInputElement;
    let vehicle = document.getElementById("vehicle") as HTMLInputElement;
    let date = document.getElementById("date") as HTMLInputElement;
    let stime = document.getElementById("stime") as HTMLInputElement;
    console.log(!pickup.value, !dropoff.value, !vehicle.value, this.BookingForm);
    this.BookingForm.markAllAsTouched();
    if (
      !pickup.value ||
      !dropoff.value ||
      this.BookingForm.invalid
    ) {
      this.cdRef.detectChanges();
      this.toster.error("Fill required fields", "");
      return;
    }
    if (
      this.BookingForm.value.paymentOption == 1 &&
      !this.BookingForm.value.card
    ) {
      this.toster.error("Select Card For Payment");
      return;
    }
    if (
      this.BookingForm.value.bookingtype === "scheduleride" &&
      (!this.BookingForm.value.date ||
        !this.BookingForm.value.time ||
        new Date(this.BookingForm.value.date).getTime() < new Date().getTime())
    ) {
      this.toster.error("Select a valid Schedule date & time");
      return;
    }

    this.stops_array = [];
    let stopsList = (this.BookingForm.get("stops") as FormArray).controls;

    for (let i = 0; i < stopsList.length; i++) {
      let val = (document.getElementById(`stop${i + 1}`) as HTMLInputElement)
        .value;
      if (val == "") {
        this.toster.error("Enter Stops value");
        return;
      }
      this.stops_array.push(val);
    }

    let rideDetail = {
      user: this.UserId,
      pickup: pickup.value,
      dropoff: dropoff.value,
      vehicle: this.BookingForm.value.vehicle,
      distance: this.TotalDistance,
      time: this.TotalTime,
      bookingtime: new Date().getTime(),
      ride_fees: this.ServiceFees,
      payment_type: this.selectedOption,

      status: 0,
    };
    if (this.stops_array.length >= 1) {
      rideDetail["stop"] = this.stops_array;
    }
    if (this.selectedOption == 1) {
      rideDetail["card_detail"] = this.selectedCard;
    }
    if (date && stime) {
      rideDetail["scheduledate"] = date.value;
      rideDetail["scheduletime"] = stime.value;
    }

    this.ridesService.addRide(rideDetail).subscribe({
      next: (data: any) => {
        this.cdRef.detectChanges();
        this.directionsRenderer.setMap(null);
        this.router.navigate(["/rides/confirmed-rides"]);

        this.toster.success(data.msg);
      },
      error: (error) => {
        this.toster.error(error.error.msg);
        console.log(error);
      },
    });
  }

  // getOneVehiclePricing(city: any, vehicle: any) {

  //   console.log(city,vehicle);
  //   this.pricingService.getServicePricing(city, vehicle).subscribe({
  //     next: (res: any) => {
  //       // return
  //       let data = res.pricing;
  //       // this.toster.success(res.msg);
  //       let driverProfit = data.driverprofit;
  //       let minFare = data.minfare;
  //       let basePriceDistance = data.distanceforbaseprice;
  //       let baseprice: number = data.baseprice;
  //       let unitDistancePrice = data.priceperunitdistance;
  //       let unitTimePrice = data.priceperunittime;

  //       let DistancePrice: number;
  //       let TimePrice: number = this.DistanceInfo["time"];

  //       if (this.DistanceInfo["distance"] <= 1) {
  //         DistancePrice = 0;
  //       } else {
  //         DistancePrice =
  //           (this.DistanceInfo["distance"] - 1) * unitDistancePrice;
  //       }

  //       let ServiceFees = DistancePrice + TimePrice + baseprice;
  //       this.TotalDistance = this.DistanceInfo["distance"];
  //       this.TotalTime = this.DistanceInfo["time"];
  //       this.ServiceFees = Math.floor(ServiceFees);
  //       this.cdRef.detectChanges();
  //     },
  //     error: (error) => {
  //       console.log(error);
  //       this.toster.error(error.errro.msg);
  //     },
  //   });
  // }

  getCityVehicles(city: any, distance: any, time: any) {
    this.pricingService.getVehiclesType(city, distance, time).subscribe({
      next: (res: any) => {
        let data = res.vehicle;

        console.log(res);
        // this.toster.success(res.msg);

        this.vT = data;

        if (data.length <= 0) {
          this.pickerr = "*service is not available ay your place";
          this.group21 = false;
        } else {
          this.pickerr = false;
          // this.group21 = true;
        }
        this.cdRef.detectChanges();
      },
      error: (error) => {
        this.vT = []
        this.toster.error(error.error.msg);
      },
    });
  }

  getCallingCodes() {
    this.pricingService.allCallingCodes().subscribe({
      next: (data: any) => {
        // this.toster.success(data.msg);
        this.allCallingCode = data.allCollingCodes;
      },
      error: (error) => {
        this.toster.error(error.error.msg);
      },
    });
  }

  onNext() {
    // this.stripePromise = loadStripe(this.usersService.stripe_public_key);
    // this.stripe = await this.stripePromise;

    this.group2 = true;
    this.group1 = false;

    setTimeout(() => {
      this.forAutofordist();
    }, 100);
    this.forCurrentlocation();

    this.usersService.getCards(this.UserId).subscribe({
      next: (cards: any) => {
        console.log(cards);
        this.allCards = cards.cards.data;
      },
      error: (error) => {
        console.log(error);
      },
    });
  }
  cards() {
    this.usersService.getCards(this.UserId).subscribe({
      next: (cards: any) => {
        this.allCards = cards.cards.data;
      },
      error: (error) => {
        console.log(error);
      },
    });
  }
  get stopsFormArray(): FormArray {
    return this.BookingForm.get("stops") as FormArray;
  }
  addStop() {

    this.hideOtthers()
    let stopsList = (this.BookingForm.get("stops") as FormArray).controls;

    for (let i = 0; i < stopsList.length; i++) {
      let val = (document.getElementById(`stop${i + 1}`) as HTMLInputElement)
        .value;
      if (val == "") {
        this.toster.error("Enter Stops value First");
        return;
      }
    }

    const stopFormControl = new FormControl("");
    this.stopsFormArray.push(stopFormControl);
    setTimeout(() => {
      this.forautostop(this.stopsFormArray.length);
    }, 0);
  }

  onSelect(vehicle: any) {
    // this.showRoute();
    console.log(vehicle);

    let index = this.vT.findIndex((element: any) => element.vehicle._id === vehicle);
    this.ServiceFees = this.vT[index].pricing.ServiceFees



  }

  getcity(point: any, type: any) {
    this.pricingService.getcityofpoint(point).subscribe({
      next: (res: any) => {
        let data = res.city;

        // this.toster.success(res.msg);

        if (type == "pickup") {
          if (!data) {
            this.pickupError();
            return;
          }

          this.city2 = data.city;
          this.city2Obj = data;
          // this.getCityVehicles(data._id,this.TotalDistance,this.TotalTime);
        }
      },
      error: (error) => {
        console.log(error);
        this.pickupError();
      },
    });
  }
  selectCode(cc: any, num: any) {
    if (cc.value == "") {
      this.ccVal = true;
    }

    if (num.length === 10) {
      let data = {
        number: cc.value + "-" + num,
      };
      this.usersService.getAddedUser(data).subscribe({
        next: (data: any) => {
          // this.toster.success(data.msg);
          data = data.user;
          let el1 = document.getElementById("email") as HTMLInputElement;
          let el2 = document.getElementById("name") as HTMLInputElement;
          if (!data) {
            (
              document.getElementById("nextbtn") as HTMLInputElement
            ).style.display = "none";
            el1.value = "";
            el2.value = "";
            this.toster.warning("You have to havn't registerd", "");
            return;
          } else {
            this.UserId = data._id;
            el1.value = data.email;
            el2.value = data.name;
            this.renderer.setAttribute(el1, "disabled", "true");
            this.renderer.setAttribute(el2, "disabled", "true");
            this.cdRef.detectChanges();
            (
              document.getElementById("nextbtn") as HTMLInputElement
            ).style.display = "inline-block";
          }
        },
        error: (error) => {
          this.toster.error(error.error.msg);
        },
      });
    }
  }
  onCancel() {
    this.group2 = false;
    this.group1 = true;
    this.forCurrentlocation();
    this.directionsRenderer.setMap(null);
  }

  onBooktype(val: any) {
    this.selectedbooking = val;
    this.cdRef.detectChanges();
  }

  openAssignDialog() {
    document.getElementById("modal").style.display = "block";
    document.body.classList.add("modal-open");
  }

  closeAssignDialog() {
    document.getElementById("modal").style.display = "none";

    document.body.classList.remove("modal-open");
  }

  // async saveCard() {
  //   const { error, paymentMethod } = await this.stripe.createPaymentMethod({
  //     type: "card",
  //     card: this.cardElement,
  //   });

  //   if (error) {
  //     console.error("Error creating payment method:", error);
  //     return;
  //   }
  //   let token = paymentMethod;

  //   this.usersService.addCard(this.UserId, token).subscribe({
  //     next: (data: any) => {
  //       console.log(data);
  //       this.cards
  //     },
  //     error: (error) => {
  //       console.log(error);
  //     },
  //   });
  // }

  // async addCard() {
  //   let stripes = await this.stripePromise;
  //   this.Max_stops = this.usersService.Max_stops;

  //   const elements = stripes.elements();
  //   const cardElement = elements.create("card");
  //   this.cardElement = cardElement;
  //   cardElement.mount("#card-element");
  // }

  onPayment(val: any) {
    this.selectedOption = val;
    this.cdRef.detectChanges();
  }

  pickupError() {
    this.directionsRenderer.setMap(null);

    this.group21 = false;
    this.BookingForm.patchValue({
      vehicle: null
    })
    this.TotalTime = null
    this.ServiceFees = null
    this.TotalDistance = null
    this.pickerr = "*Service is not available at your place";
    this.toster.error("Service is Not Available at you location");
    this.cdRef.detectChanges();
  }
  hideOtthers() {
    this.directionsRenderer.setMap(null);

    this.group21 = false;
    // this.BookingForm.patchValue({
    //   vehicle:null
    // })
    this.TotalTime = null
    this.ServiceFees = null
    this.TotalDistance = null
  }
  getMaxStops() {
    this.settingsService.currentSettings().subscribe({
      next: (data: any) => {
        this.Max_stops = data.setting.MaxStopsForRide;
        console.log(data);

      },
      error: (error) => {
        console.log(error);
      },
    });
  }
}
