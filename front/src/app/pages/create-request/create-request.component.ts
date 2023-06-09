import {
  Component,
  ElementRef,
  OnInit,
  Renderer2,
  ViewChild,
} from "@angular/core";
import { DashService } from "src/app/services/dashboard.service";
import { PricingService } from "src/app/services/pricing.servive";
import { RidesService } from "src/app/services/rides.service";
import { SocketService } from "src/app/services/soketio.service";
import { UsersService } from "src/app/services/users.service";
import { ChangeDetectorRef } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { Stripe, StripeCardElement, StripeCardElementOptions, StripeElements } from '@stripe/stripe-js';

import { loadStripe } from '@stripe/stripe-js';
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { Router } from "@angular/router";
import { SettingsService } from "src/app/services/setting.service";

const stripePromise = loadStripe('pk_test_51N2piRJAU9zBfSBOixMp53BIFUU3aFXpACWos1Lvi2aM8H984bRSIf1aVoloiRnQNVCWU0Ckyg6SWuYyyXwlDT8000xGZO12wf');

let infoWindow: google.maps.InfoWindow;
let map!: google.maps.Map;
let marker: google.maps.Marker;
@Component({
  selector: "app-create-request",
  templateUrl: "./create-request.component.html",
  styleUrls: ["./create-request.component.scss"],
})
export class CreateRequestComponent implements OnInit {
  @ViewChild("stopContainer") stopContainer: ElementRef;

  private city2: any;
  private city1: any;
  private UserId: any;
  private city2Obj: any
  private cardElement: any
  private stops_array = [];
  private selectedCard: any
  private DistanceInfo = {};
  private No_stops: any = 0;
  private BookingForm: FormGroup
  private directionsRenderer = new google.maps.DirectionsRenderer();
  private directionsService = new google.maps.DirectionsService();
  private service = new google.maps.DistanceMatrixService();
  private geocoder = new google.maps.Geocoder();
  private stripe: Stripe
  private Max_stops:any


  public vT: any = [];
  public selectedOption: any ;
  public pickerr: any;
  public group21: any
  public allCards: any
  public TotalTime: any;
  public ServiceFees: any;
  public TotalDistance: any;
  public allCallingCode: any;
  public selectedbooking: any
  public group3 = false;
  public group2 = false;
  public ccVal = false;
  public group1 = true;




  constructor(
    private dashservice: DashService,
    private pricingService: PricingService,
    private usersService: UsersService,
    private ridesService: RidesService,
    private renderer: Renderer2,
    public cdRef: ChangeDetectorRef,
    private toster: ToastrService,
    private router:Router,
    private settingsService: SettingsService
  ) { }

  async ngOnInit() {

    this.stripe = await stripePromise;
    this.initMap();
    this.getCallingCodes();
    this.forCurrentlocation();
    this.getMaxStops()

  }

  forautostop() {
    for (
      let i = 1;
      i < this.stopContainer.nativeElement.children.length + 1;
      i++
    ) {
      const element = this.stopContainer.nativeElement.children.length[i];

      let autocomplete = new google.maps.places.Autocomplete(
        document.getElementById(`stop${i}`) as HTMLInputElement,
        {
          types: ["geocode"],
        }
      );

      this.stopContainer.nativeElement.children.length;

      google.maps.event.addListener(autocomplete, "place_changed", () => {
        var place = autocomplete.getPlace();
        let lat = place.geometry?.location?.lat();
        let lng = place.geometry?.location?.lng();
        let selectedLocation: any = {
          lat,
          lng,
        };
        map.setCenter(selectedLocation);
        this.addMarker({ cords: selectedLocation, data: `stop${i}` });
      });
    }
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

    this.stopContainer.nativeElement.children.length;

    google.maps.event.addListener(autocomplete, "place_changed", () => {
      var place = autocomplete.getPlace();
      let lat = place.geometry?.location?.lat();
      let lng = place.geometry?.location?.lng();

      let selectedLocation: any = {
        lat,
        lng,
      };
      console.log('pick up change');
      this.getcity(selectedLocation, "pickup");


      // this.initMap(selectedLocation);
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
      let address = place.formatted_address
      let country = address.split(',')
      console.log(this.city2);
      this.city1 = address
      let country2 = this.city2.split(',')
      if (!this.city2) {
        // this.toster.warning('drop location and pickup location should be in same country', '')
        console.log('work');
        this.group21 = false
        this.pickerr = '*pickup and drop location must be in same country'

      } else {
        this.pickerr = false
        this.group21 = true
      }

      this.cdRef.detectChanges()
      this.getcity(sselectedLocation, "dropoff");
      // map.setCenter(sselectedLocation)

      // this.initMap(sselectedLocation);

      map.setCenter(sselectedLocation);

      this.addMarker({ cords: sselectedLocation, data: "dropoff" });
    });

  }

  addMarker(props: { cords: any; data?: any }) {
    if (marker) {
      marker.setMap(null);
    }
    marker = new google.maps.Marker({
      position: props.cords,
      map: map,
      draggable: true, // set draggable option to true
      title: "Drag me!",
    });

    marker.addListener("click", () => {
      infoWindow.open(map, marker);
    });

    google.maps.event.addListener(marker, "dragend", () => {
      let newplace = marker.getPosition();
      this.geocoder.geocode({ location: newplace }, (results: any, status) => {
        if (status === "OK") {
          if (results[0]) {
            if (document.getElementById(props.data) as HTMLInputElement) {
              let ele = document.getElementById(props.data) as HTMLInputElement;
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
      // this.initMap(data);
      map.setCenter(data)
      this.addMarker({ cords: data, data: "pickup" });

      let newplace = marker.getPosition();

      this.geocoder.geocode({ location: newplace }, (results: any, status) => {
        if (status === "OK") {
          if (results[0]) {
            setTimeout(() => {
              if (document.getElementById("pickup") as HTMLInputElement) {
                let ele = document.getElementById("pickup") as HTMLInputElement;
                ele.value = results[0].formatted_address;

                let selectedLocation: any = {
                  lat: results[0].geometry.location.lat(),
                  lng: results[0].geometry.location.lng(),
                };
                this.getcity(selectedLocation, 'pickup')

              }
            }, 100);
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
    console.log(this.city1, this.city2);

    if (!this.city1 || !this.city2) {
      return;
    }
    let fromEL = document.getElementById("pickup") as HTMLInputElement;
    let toEL = document.getElementById("dropoff") as HTMLInputElement;
    let origin = fromEL.value;
    let destination = toEL.value;
    this.forDrawPath(origin, destination);
  }

  getDistance() {
    let destArray = [];
    let origin = [(document.getElementById("pickup") as HTMLInputElement).value];
    this.stops_array.forEach((each) => {
      destArray.push(each.location);
    });
    destArray.push((document.getElementById("dropoff") as HTMLInputElement).value);

    this.service.getDistanceMatrix(
      {
        origins: origin,
        destinations: destArray,
        travelMode: google.maps.TravelMode.DRIVING,
        avoidHighways: false,
        avoidTolls: false,
      } as google.maps.DistanceMatrixRequest,
      (data: any) => {
        let distance = data.rows[0].elements[0].distance.value / 1000;
        let time = data.rows[0].elements[0].duration.value / 60;

        this.DistanceInfo["distance"] = distance;
        this.DistanceInfo["time"] = time;

        this.getOneVehiclePricing(
          this.city2Obj._id,
          (document.getElementById("vehicle") as HTMLSelectElement).value
        );
      }
    );
  }

  forDrawPath(origin: any, destination: any) {
    marker.setMap(null)
    this.stops_array = [];

    for (let i = 0; i < this.No_stops; i++) {
      let val = document.getElementById(`stop${i + 1}`) as HTMLInputElement;

      if (val.value) {
        this.stops_array.push({
          location: val.value,
          stopover: true,
        });
      }
    }

    this.directionsRenderer.setMap(map);
    var request: any = {
      origin: origin,
      destination: destination,
      waypoints: this.stops_array,
      travelMode: "DRIVING",
    };

    this.directionsService.route(request, (result: any, status) => {
      if (status == "OK") {
        this.directionsRenderer.setDirections(result);
        this.getDistance();
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
      this.usersService.getAddedUser(data).subscribe((data: any) => {
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
      });
    } else {

    }
  }

  BookRide(data: any) {
    let pickup = document.getElementById("pickup") as HTMLInputElement;
    let dropoff = document.getElementById("dropoff") as HTMLInputElement;
    let vehicle = document.getElementById("vehicle") as HTMLInputElement;
    let date = document.getElementById("date") as HTMLInputElement;
    let stime = document.getElementById("stime") as HTMLInputElement;
    if (!pickup.value || !dropoff.value || !vehicle.value) {
      this.toster.error('Fill required fields', '')
      return

    }


    let rideDetail = {
      user: this.UserId,
      pickup: pickup.value,
      dropoff: dropoff.value,
      vehicle: vehicle.value,
      distance: this.TotalDistance,
      time: this.TotalTime,
      bookingtime: Date.now(),
      payment_type:this.selectedOption,
      status: 0,
    };
    if (this.stops_array.length >= 1) {
      rideDetail['stops'] = this.stops_array

    }
    if (date && stime) {

      rideDetail['scheduledate'] = date.value
      rideDetail['scheduletime'] = stime.value
    }
    this.getPayment(this.selectedCard, this.ServiceFees, this.UserId)

    this.ridesService.addRide(rideDetail).subscribe({

      next: (data: any) => {
        this.cdRef.detectChanges()
        this.directionsRenderer.setMap(null)
        this.router.navigate(['/rides/confirmed-rides'])


        this.toster.success("Booking Successfully", "")

        console.log(this.selectedCard);
      }, error: (error) => {
        console.log(error);
      }
    });
  }

  getOneVehiclePricing(city: any, vehicle: any) {
    this.pricingService.getServicePricing(city, vehicle).subscribe({
      next: (data: any) => {
        let driverProfit = data.driverprofit;
        let minFare = data.minfare;
        let basePriceDistance = data.distanceforbaseprice;
        let baseprice: number = data.baseprice;
        let unitDistancePrice = data.priceperunitdistance;
        let unitTimePrice = data.priceperunittime;

        let DistancePrice: number;
        let TimePrice: number = this.DistanceInfo["time"];

        if (this.DistanceInfo["distance"] <= 1) {
          DistancePrice = 0;
        } else {
          DistancePrice =
            (this.DistanceInfo["distance"] - 1) * unitDistancePrice;
        }

        let ServiceFees = DistancePrice + TimePrice + baseprice;
        this.TotalDistance = this.DistanceInfo["distance"];
        this.ServiceFees = Math.floor(ServiceFees);
        this.cdRef.detectChanges();
      },
    });
  }

  getCityVehicles(city: any) {
    this.pricingService.getVehiclesType(city).subscribe({
      next: (data: any) => {
        this.vT = data;
        if (data.length <= 0) {
          this.pickerr = '*service is not available ay your place';
          this.group21 = false

        } else {
          this.pickerr = false;
          this.group21 = true


        }
        this.cdRef.detectChanges();
      },
      error: (error) => { },
    });
  }

  getCallingCodes() {
    this.pricingService.allCallingCodes().subscribe({
      next: (data: any) => {
        this.allCallingCode = data;
      },
    });
  }

  async onNext() {



    this.BookingForm = new FormGroup({
      pickup: new FormControl("", Validators.required),
      dropoff: new FormControl("", [Validators.required]),

    })
    this.group2 = true;
    this.group1 = false;
    setTimeout(() => {
      this.forAutofordist();
    }, 100);
    this.forCurrentlocation();
    console.log(this.UserId);



    this.usersService.getCards(this.UserId).subscribe({
      next: (cards: any) => {
        console.log(cards);
        this.allCards = cards.data
        console.log(document.getElementById('cards'));

      }, error: (error) => {
        console.log(error);
      }
    })

  }

  addStop(data: any) {
    for (let i = 0; i < this.No_stops; i++) {
      if (
        (document.getElementById(`stop${i + 1}`) as HTMLInputElement) &&
        !(document.getElementById(`stop${i + 1}`) as HTMLInputElement).value
      ) {
        this.toster.warning("you must fill previous stop before add", "");

        return;
      }
    }
    this.No_stops++;

    const stopNumber = this.stopContainer.nativeElement.children.length + 1;
    const label = this.renderer.createElement("label");
    const labelText = this.renderer.createText(`Stop ${stopNumber}: `);
    const input = this.renderer.createElement("input");
    this.renderer.setProperty(input, "type", "text");
    this.renderer.setProperty(input, "id", `stop${stopNumber}`);
    this.renderer.setProperty(input, "name", `stop${stopNumber}`);
    this.renderer.setProperty(input, "required", true);

    this.renderer.appendChild(label, labelText);
    this.renderer.appendChild(label, input);
    this.renderer.appendChild(this.stopContainer.nativeElement, label);

    setTimeout(() => {
      this.forautostop();
    }, 100);
  }

  onSelect(vehicle: any) {
    console.log('work');
    this.showRoute();
  }

  getcity(point: any, type: any) {
    this.pricingService.getcityofpoint(point).subscribe({
      next: (data: any) => {
        console.log(data);
        if (type == "pickup") {

          if(!data){

            this.pickupError()
            return
          }

          this.city2 = data.city;
          this.city2Obj = data
          this.getCityVehicles(data._id);
          console.log(data);
        }
        // if (type == "dropoff") {
        //   this.city1 = data.city;
        // }
      },error:(error)=>{
        console.log(error);
      }
    });
  }

  onPay() {
    this.ridesService.getPayment().subscribe({
      next: async (data: any) => {
        let stripe = await loadStripe(
          "pk_test_51N2piRJAU9zBfSBOixMp53BIFUU3aFXpACWos1Lvi2aM8H984bRSIf1aVoloiRnQNVCWU0Ckyg6SWuYyyXwlDT8000xGZO12wf"
        );
        stripe?.redirectToCheckout({
          sessionId: data.id,
        });
      },
      error: (error) => { },
    });
  }

  onCancel() {
    this.group2 = false;
    this.group1 = true;
    this.forCurrentlocation()

  }

  onBooktype(val: any) {
    this.selectedbooking = val
    this.cdRef.detectChanges()


  }

  openAssignDialog() {
    document.getElementById('modal').style.display = 'block';
    document.body.classList.add('modal-open');


  }

  closeAssignDialog() {
    document.getElementById('modal').style.display = 'none';

    document.body.classList.remove('modal-open');
  }

  async saveCard() {




    const { error, paymentMethod } = await this.stripe.createPaymentMethod({
      type: 'card',
      card: this.cardElement,
    });

    if (error) {
      console.error('Error creating payment method:', error);
      return;
    }
    let token = paymentMethod

    this.usersService.addCard(this.UserId, token).subscribe({
      next: (data: any) => {

        console.log(data);
      }, error: (error) => {
        console.log(error);
      }
    })
  }

  async addCard() {
    let stripes = await stripePromise

    const elements = stripes.elements();
    const cardElement = elements.create('card');
    this.cardElement = cardElement
    cardElement.mount('#card-element');

  }

  getPayment(card: any, amount: any, userid: any) {
    this.usersService.getPayment(card, amount, userid).subscribe({
      next: (data: any) => {
        console.log(data);
      }, error: (error) => {
        console.log(error);
      }
    })
  }
  onPayment(val:any){
    this.selectedOption = val
    this.cdRef.detectChanges()

  }

  pickupError(){
    this.group21 = false
    this.pickerr = '*Service is not available at your place'
    this.cdRef.detectChanges()
  }
  getMaxStops(){
    this.settingsService.currentSettings().subscribe({
      next:(data:any)=>{

        this.Max_stops = data.MaxStopsForRide
        console.log(this.Max_stops);
      },error:(error)=>{
        console.log(error);
      }
    })

  }

}
