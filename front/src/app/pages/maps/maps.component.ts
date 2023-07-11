import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ToastrService } from "ngx-toastr";
import { PricingService } from "src/app/services/pricing.servive";
// import * as $ from 'jquery';
// declare const google: any;
let infoWindow: google.maps.InfoWindow;
let map!: google.maps.Map;
let marker: google.maps.Marker;
// let service = new google.maps.DistanceMatrixService()

@Component({
  selector: "app-maps",
  templateUrl: "./maps.component.html",
  styleUrls: ["./maps.component.scss"],
})
export class MapsComponent implements OnInit {
  private geocoder = new google.maps.Geocoder();

  private autocomplete: google.maps.places.Autocomplete;

  public polyerr: any = true;
  public allzones: any;
  public errorMsg: any;
  public countriesArray: any;
  public cityForm: FormGroup;
  public activateAddZone: boolean = true;
  public currentPage: any = 1;
  public NoOfPages: any = [];
  public Polygons: any = [];

  private polygon: any;
  private updateId: any;
  public zone: any = [];
  private selectedCountry: any;

  constructor(
    private pricingService: PricingService,
    private ngbService: NgbModal,
    public cdRef: ChangeDetectorRef,

    private toster: ToastrService
  ) {}

  ngOnInit() {
    this.getZones(this.currentPage);
    this.getAvailableCountries();
  }

  initMap() {
    let option = {
      zoom: 8,
      animation: google.maps.Animation.DROP,
      mapTypeControlOptions: {
        mapTypeIds: [],
      },
      streetViewControl: false,
    };
    map = new google.maps.Map(
      document.getElementById("map") as HTMLElement,
      option
    );
  }

  forCurrentlocation() {
    this.initMap();
    this.forPoly();
  }

  forholy(data: any, edit: boolean) {
    const coordinates = data;

    this.polygon = new google.maps.Polygon({
      paths: coordinates,
      strokeColor: "#FF0000",
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: "#FF0000",
      fillOpacity: 0.35,
      editable: edit,
      draggable: edit,
    });

    this.polygon = this.polygon;
    var center = this.getPolygonCenter(this.polygon);
    let lat = center.lat();
    let lng = center.lng();
    let selectedLocation: any = {
      lat,
      lng,
    };

    this.Polygons.push(this.polygon);

    this.polygon.setMap(map);
    map.setCenter(selectedLocation);
  }

  changeAutoComplete(countryCode: any) {
    // this.autocomplete.setComponentRestrictions(null);
    this.autocomplete.setComponentRestrictions({ country: countryCode });
  }

  onselect(country: any) {
    let countryId = country;
    const selectedCountry = this.countriesArray.find(
      (country: any) => country._id === countryId
    );
    this.selectedCountry = selectedCountry.name;
    this.setMapCenterByCountry(selectedCountry.name);
    this.changeAutoComplete(selectedCountry.countrycode);
    this.drawExistingZones(country);
  }

  forPoly() {
    var drawingManager = new google.maps.drawing.DrawingManager({
      drawingMode: google.maps.drawing.OverlayType.POLYGON,
      drawingControl: true,
      drawingControlOptions: {
        position: google.maps.ControlPosition.TOP_CENTER,
        drawingModes: [google.maps.drawing.OverlayType.POLYGON],
      },
      polygonOptions: {
        strokeColor: "#FF0000",
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: "#FF0000",
        fillOpacity: 0.35,
        editable: true,
        draggable: true,
      },
    });

    drawingManager.setMap(map);

    var polygon: any;
    // jayre edit thay tyare array update karvano che
    google.maps.event.addListener(
      drawingManager,
      "overlaycomplete",
      (event: any) => {
        console.log(event);
        // this.polygon.setMap(null)
        if (event.type === google.maps.drawing.OverlayType.POLYGON) {
          if (this.polygon) {
            this.polygon.setMap(null);
          }
          this.polygon = event.overlay;
          var coordinates = [];
          var path = this.polygon.getPath();

          path.forEach(function (latLng) {
            coordinates.push({ lat: latLng.lat(), lng: latLng.lng() });
          });
          this.zone = coordinates;
          console.log(this.zone);
          this.polyerr = true;
        }
      }
    );

    map.addListener("click", (event: any) => {
      if (drawingManager.getDrawingMode() !== null) {
        drawingManager.setDrawingMode(null);
      }
      var path: any = polygon.getPath();
      path.push(event.latLng);
    });
  }

  drawExistingZones(country: any) {
    this.pricingService.getCities(country).subscribe({
      next: (res: any) => {

        let data = res.city
        // this.toster.success(data.msg)
        this.removePolygons();

        data.forEach((city: any) => {
          this.forholy(city.zone, false);
        });
        this.polygon = null;
      },
      error: (error) => {
        this.toster.error(error.error.msg)

        console.log(error);
      },
    });
  }

  openModel(content: any) {
    if (this.countriesArray.length == 0) {
      this.toster.error("Add Country First", "Countries Not Found");
      return;
    }

    this.cityForm = null;
    this.CreateCityForm();
    this.ngbService.open(content, { centered: true });

    this.forCurrentlocation();
    this.forAutofordist();
    this.onselect(this.countriesArray[0]?._id);
  }
  forAutofordist() {
    this.autocomplete = new google.maps.places.Autocomplete(
      document.getElementById("city") as HTMLInputElement,
      {
        types: ["(cities)"],
        // fields: ['formatted_address']
      }
    );
    console.log(this.autocomplete);

    google.maps.event.addListener(this.autocomplete, "place_changed", () => {
      var place = this.autocomplete.getPlace();
      let lat = place.geometry?.location?.lat();
      let lng = place.geometry?.location?.lng();
      console.log(this.autocomplete);
      let selectedLocation: any = {
        lat,
        lng,
      };
      console.log(selectedLocation);
      this.cityForm.get("city").setValue(place.formatted_address);
      map.setCenter(selectedLocation);

      // this.addMarker({ coords: selectedLocation })
    });
  }

  addZone(modal: any) {
    this.validateInput();

    var coordinates = [];
    var path = this.polygon.getPath();

    path.forEach(function (latLng) {
      coordinates.push({ lat: latLng.lat(), lng: latLng.lng() });
    });
    this.zone = coordinates;
    console.log(this.zone);

    let formData = this.cityForm.value;
    let length: any = this.cityForm.controls;

    this.cityForm.markAllAsTouched();

    if (this.cityForm.invalid) {
      if (this.zone.length < 2) {
        this.polyerr = false;
        return;
      }

      return;
    }

    console.log(this.zone.length);

    if (!this.polyerr) {
      this.polyerr = false;
      return;
    }
    let citydata = {
      country: formData.country,
      city: formData.city,
      zone: this.zone,
    };
    console.log(citydata);
    this.pricingService.addZone(citydata).subscribe({
      next: (data: any) => {
        this.toster.success(data.msg);
        this.cityForm.reset();
        this.zone = [];
        this.forCurrentlocation();
        this.getZones(this.currentPage);
        modal.dismiss("Click");
      },
      error: (error) => {
        if (error.error.city) {
          this.toster.error(error.error.city);

          console.log(this.errorMsg);
        } else {
          this.toster.error(error.errro.msg);
        }
      },
    });
  }
  getZones(page: any) {
    this.pricingService.getZone(page).subscribe({
      next: (data: any) => {
        console.log(data);
        // this.toster.success(data.msg)
        this.allzones = data.cities;
        this.NoOfPages = new Array(data.pages);
        if (this.allzones.length == 0) {
          this.toster.error("Add Country First", "Countries Not Found");
        }
      },
      error: (error) => {
        this.toster.error(error.errro.msg);

        console.log(error);
      },
    });
  }

  updateCity(id: any, content: any) {
    this.ngbService.open(content, { centered: true });
    this.CreateCityForm();

    this.forCurrentlocation();

    this.pricingService.updateCity(id).subscribe({
      next: (res: any) => {
        let data = res.city;
        // this.toster.success(res.msg);
        console.log(data);

        this.updateId = data._id;

        this.cityForm.patchValue({
          city: data.city,
          country: data.country,
        });

        this.forholy(data.zone, true);

        var vertices = this.polygon.getPath();
        var centroid = { lat: 0, lng: 0 };
        var n = vertices.getLength();

        for (var i = 0; i < n; i++) {
          var vertex = vertices.getAt(i);
          centroid.lat += vertex.lat();
          centroid.lng += vertex.lng();
        }

        centroid.lat /= n;
        centroid.lng /= n;

        const centre = new google.maps.LatLng(centroid.lat, centroid.lng);
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  onSave(modal: any) {
    let coordinates = [];
    let path = this.polygon.getPath();
    path.forEach(function (latLng) {
      coordinates.push({ lat: latLng.lat(), lng: latLng.lng() });
    });

    let zoneData = {
      zone: coordinates,
    };
    console.log(zoneData);
    this.pricingService.saveCity(this.updateId, zoneData).subscribe({
      next: (data: any) => {
        if(data.msg){

          this.toster.success(data.msg)
        }
        this.forCurrentlocation();
        modal.dismiss("Click");

        this.getZones(this.currentPage);
      },
      error: (error) => {
        console.log(error);
        if (error.error.city) {
          this.toster.error(error.error.city);

        }else{
          error.error.msg
        }
      },
    });

    // this.dashService.addZone(country)
  }

  getPolygonCenter(polygon) {
    var vertices = polygon.getPath();
    var centroid = { lat: 0, lng: 0 };
    var n = vertices.getLength();

    for (var i = 0; i < n; i++) {
      var vertex = vertices.getAt(i);
      centroid.lat += vertex.lat();
      centroid.lng += vertex.lng();
    }

    centroid.lat /= n;
    centroid.lng /= n;

    return new google.maps.LatLng(centroid.lat, centroid.lng);
  }

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }



  onCancel() {
    this.getZones(this.currentPage);
    this.forCurrentlocation();
  }

  CreateCityForm() {
    console.log(this.countriesArray);

    this.cityForm = new FormGroup({
      country: new FormControl(this.countriesArray[0]._id, [
        Validators.required,
      ]),
      city: new FormControl(null, [Validators.required]),
    });
  }

  getAvailableCountries() {
    this.pricingService.getAddedCountry().subscribe({
      next: (data: any) => {
        // this.toster.success(data.msg);

        this.countriesArray = data.country;
      },
      error: (error) => {
        console.log(error);
        this.toster.error(error.error.msg);
      },
    });
  }
  onSearch(search: any) {
    console.log(search);
    this.pricingService.getZone(1, { search }).subscribe({
      next: (data: any) => {
        // this.toster.success(data.msg)

        this.allzones = data.cities;
        this.NoOfPages = new Array(data.pages);
        this.currentPage = 1;
      },
      error: (error) => {
        this.toster.error(error.error.msg);
        this.allzones = []

        console.log(error);
      },
    });
  }
  onNext() {
    this.currentPage++;
    console.log(this.currentPage);
    console.log(this.NoOfPages);

    this.getZones(this.currentPage);
  }
  onPrevious() {
    this.currentPage--;
    this.getZones(this.currentPage);
  }
  onPage(page: any) {
    this.currentPage = page;
    this.getZones(this.currentPage);
  }
  validateInput() {
    if (this.cityForm.value.country) {
      const autocompleteService = new google.maps.places.AutocompleteService();
      const request = {
        input: this.cityForm.value.country,
        types: ["cities"],
      };

      autocompleteService.getPlacePredictions(
        request,
        (predictions: any[], status: string) => {
          if (status === google.maps.places.PlacesServiceStatus.OK) {
            const validInput = predictions.some(
              (prediction) =>
                prediction.description === this.cityForm.value.country
            );
            console.log("Input is valid:", validInput);
          } else {
            console.error("Autocomplete request failed:", status);
          }
        }
      );
    }
  }
  setMapCenterByCountry(countryName: any) {
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ address: countryName }, function (results, status) {
      if (status === google.maps.GeocoderStatus.OK && results.length > 0) {
        const location = results[0].geometry.location;
        const bounds = results[0].geometry.bounds;
        map.fitBounds(bounds);
      } else {
        console.log(
          "Geocode was not successful for the following reason:",
          status
        );
      }
    });
  }
  //  removeAllPolygons() {
  //   // Get all map objects
  //   const objects = map.getMapObjects();

  //   // Iterate over the map objects and remove polygons
  //   objects.forEach(function(object) {
  //     if (object instanceof google.maps.Polygon) {
  //       object.setMap(null);
  //     }
  //   });
  // }
  removePolygons() {
    // Get the overlay map types
    this.Polygons.forEach((polygon) => {
      // Remove the polygon from the map
      polygon.setMap(null);
    });

    // Clear the polygons array
    this.Polygons.length = 0;
  }
}
