import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DashService } from 'src/app/services/dashboard.service';
import { PricingService } from 'src/app/services/pricing.servive';
// import * as $ from 'jquery';
// declare const google: any;
let infoWindow: google.maps.InfoWindow
let map!: google.maps.Map
let marker: google.maps.Marker
// let service = new google.maps.DistanceMatrixService()

@Component({
  selector: 'app-maps',
  templateUrl: './maps.component.html',
  styleUrls: ['./maps.component.scss']
})

export class MapsComponent implements OnInit {
  private geocoder = new google.maps.Geocoder;

  private autocomplete: google.maps.places.Autocomplete

  public polyerr: any
  public allzones: any
  public errorMsg: any
  public countriesArray: any
  public cityForm: FormGroup
  public activateUpdate: boolean = false
  public activateAddZone: boolean = true
  public currentPage: any = 1
  public NoOfPages: any = []


  private polygon: any
  private updateId: any
  private zone: any = []
  private selectedCountry: any


  @ViewChild('fromInput') fromInput: ElementRef;
  @ViewChild('toInput') toInput: ElementRef;


  constructor(private dashService: DashService, private pricingService: PricingService, private ngbService: NgbModal,
  ) { }


  ngOnInit() {

    this.getZones(this.currentPage)

  }

  initMap() {
    let option = {
      zoom: 8,
      animation: google.maps.Animation.DROP,
      mapTypeControlOptions: {
        mapTypeIds: []
      },
      streetViewControl: false,

    }
    map = new google.maps.Map(document.getElementById('map') as HTMLElement, option)

  }

  forCurrentlocation() {

    navigator.geolocation.getCurrentPosition((position) => {
      let data = {
        lat: position.coords.latitude,
        lng: position.coords.longitude

      }
      this.initMap()
      console.log(data);
      map.setCenter(data)

      // this.forAutofordist()
      this.forPoly()
    })


  }

  forholy(data: any,edit:boolean) {
    const coordinates = data

    // Create a map object
    // const map = new google.maps.Map(document.getElementById("map"), {
    //   zoom: 8,
    //   center: { lat: 37.7749, lng: -122.4194 }
    // });

    // Create a polygon object
    const polygon = new google.maps.Polygon({
      paths: coordinates,
      strokeColor: "#FF0000",
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: "#FF0000",
      fillOpacity: 0.35,
      editable: edit,
      draggable: edit
    });

    google.maps.event.addListener(polygon.getPath(), 'set_at', function (index) {
      let coordinates = []
      let path = polygon.getPath()
      path.forEach(function (latLng) {
        coordinates.push({ lat: latLng.lat(), lng: latLng.lng() });

      })
      console.log(coordinates);
      this.zone = coordinates
    });
    this.polygon = polygon

    var center = this.getPolygonCenter(polygon);

    let lat = center.lat()
    let lng = center.lng()

    let selectedLocation: any = {
      lat,
      lng


    }




    polygon.setMap(map);
    map.setCenter(selectedLocation)
  }

  changeAutoComplete(countryCode: any) {
    // this.autocomplete.setComponentRestrictions(null);
    this.autocomplete.setComponentRestrictions({ country: countryCode });
  }

  onselect(country: any) {

    let countryId = country
    const selectedCountry = this.countriesArray.find((country: any) => country._id === countryId);
    console.log(selectedCountry.countrycode);
    this.changeAutoComplete(selectedCountry.countrycode)
    this.pricingService.getCities(country).subscribe({
      next:(data:any)=>{

        data.forEach((city:any) => {
          this.forholy(city.zone,false)

        });

      },error:(error)=>{
        console.log(error);
      }
    })
  }

  forPoly() {


    var drawingManager = new google.maps.drawing.DrawingManager({
      drawingMode: google.maps.drawing.OverlayType.POLYGON,
      drawingControl: true,
      drawingControlOptions: {
        position: google.maps.ControlPosition.TOP_CENTER,
        drawingModes: [google.maps.drawing.OverlayType.POLYGON]
      },
      polygonOptions: {
        strokeColor: '#FF0000',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: '#FF0000',
        fillOpacity: 0.35,
        editable: true,
        draggable: true
      }
    });

    drawingManager.setMap(map);

    var polygon: any;
    // jayre edit thay tyare array update karvano che
    google.maps.event.addListener(drawingManager, 'overlaycomplete', (event: any) => {
      console.log(event);
      if (event.type === google.maps.drawing.OverlayType.POLYGON) {
        if (polygon) {
          polygon.setMap(null);
        }
        polygon = event.overlay;
        var coordinates = [];
        var path = polygon.getPath();

        path.forEach(function (latLng) {
          coordinates.push({ lat: latLng.lat(), lng: latLng.lng() });
        });
        this.zone = coordinates
        this.polyerr = true


        google.maps.event.addListener(path, 'set_at', function (index) {
          var coordinates = [];
          var path = polygon.getPath();

          path.forEach(function (latLng) {
            coordinates.push({ lat: latLng.lat(), lng: latLng.lng() });
          });
          this.zone = coordinates
          console.log(this.zone);


        });


      }
    });

    map.addListener('click', (event: any) => {
      if (drawingManager.getDrawingMode() !== null) {
        drawingManager.setDrawingMode(null);
      }
      var path: any = polygon.getPath();
      path.push(event.latLng);

    });


  }
  openModel(content: any) {

    this.ngbService.open(content, { centered: true });
    this.CreateCityForm()
    this.getAvailableCountries()
    this.forCurrentlocation()
    this.forAutofordist()
  }
  forAutofordist() {


    this.autocomplete = new google.maps.places.Autocomplete(document.getElementById('city') as HTMLInputElement, {
      types: ['(cities)'],
      // fields: ['formatted_address']

    })
    console.log(this.autocomplete);


    google.maps.event.addListener(this.autocomplete, 'place_changed', () => {
      var place = this.autocomplete.getPlace()
      let lat = place.geometry?.location?.lat()
      let lng = place.geometry?.location?.lng()
      console.log( this.autocomplete);
      let selectedLocation: any = {
        lat,
        lng

      }
      console.log(selectedLocation);
      this.cityForm.get('city').setValue(place.formatted_address)
      map.setCenter(selectedLocation)

      // this.addMarker({ coords: selectedLocation })

    })

  }

  addZone() {

    let formData = this.cityForm.value
    let length: any = this.cityForm.controls


    if (this.cityForm.invalid) {
      for (const field in length) {
        if (!length[field].value) {
          length[field].touched = true
        }
      }
      return
    }

    if (!this.polyerr) {
      this.polyerr = false
      return
    }
    let citydata = {
      country: formData.country,
      city: formData.city,
      zone: this.zone

    }
    console.log(citydata);
    this.pricingService.addZone(citydata).subscribe({
      next: (data: any) => {
        this.cityForm.reset()
        this.zone = []
        this.forCurrentlocation()
        this.getZones(this.currentPage)

      }, error: (error) => {
        if (error.error.city) {
          console.log('in city err');

          this.errorMsg = error.error.city
          console.log(this.errorMsg);
        }
      }
    })



  }
  getZones(page:any) {
    this.pricingService.getZone(page).subscribe(
      {
        next: (data: any) => {
          console.log(data);
          this.allzones = data.cities
          this.NoOfPages = new Array(data.pages)


        }, error: (error) => {
          console.log(error);
        }
      })
  }

  updateCity(id: any) {
    this.activateUpdate = true
    this.activateAddZone = false
    this.pricingService.updateCity(id).subscribe({
      next: (data: any) => {
        console.log(data.city.zone);
        let el1 = document.getElementById('country') as HTMLInputElement
        let el2 = document.getElementById('city') as HTMLInputElement
        el1.value = data.country
        el2.value = data.city
        this.updateId = data._id
        this.forholy(data.zone,true)

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
        console.log(centre.lat);




      }, error: (error) => {
        console.log(error);
      }
    })

  }

  onSave() {
    let coordinates = []
    let path = this.polygon.getPath()
    path.forEach(function (latLng) {
      coordinates.push({ lat: latLng.lat(), lng: latLng.lng() });

    })
    let country = document.getElementById('country') as HTMLInputElement
    let city = document.getElementById('city') as HTMLInputElement



    let zoneData = {
      country: country.value,
      city: city.value,
      zone: coordinates


    }
    console.log(zoneData);
    this.pricingService.saveCity(this.updateId, zoneData).subscribe((data: any) => {
      this.activateUpdate = false
      this.activateAddZone = true
      this.forCurrentlocation()


      console.log(data);
      this.getZones(this.currentPage)
    })

    // this.dashService.addZone(country)





  };

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
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  onDelete(id: any) {
    let type: "City"
    this.pricingService.deleteCity(id).subscribe({
      next: (data: any) => {
        this.getZones(this.currentPage)

      }, error: (error) => {
        console.log(error);
      }
    })
  }

  onCancel() {
    this.getZones(this.currentPage)
    this.activateUpdate = false
    this.activateAddZone = true
    this.forCurrentlocation()

  }

  CreateCityForm() {

    this.cityForm = new FormGroup({
      country: new FormControl("",
      [Validators.required]
      ),
      city: new FormControl(null,
        [Validators.required]
        ),
    })

  }

  getAvailableCountries() {

    this.pricingService.getAddedCountry().subscribe(
      {
        next: (data: any) => {
          this.countriesArray = data
          console.log(data);

        }, error: (error) => {
          console.log(error);
        }
      })

  }
  onSearch(search:any){
    console.log(search);
    this.pricingService.getZone(this.currentPage,{search}).subscribe({
      next:(data:any)=>{
        console.log(data);
        this.allzones = data.cities
        this.NoOfPages = new Array(data.pages)
        this.currentPage = 1
      },error:(error)=>{
        console.log(error);
      }
    })

  }
  onNext(){
    this.currentPage++
    console.log(this.currentPage);
    console.log(this.NoOfPages);

    this.getZones(this.currentPage)



  }
  onPrevious(){
    this.currentPage--
    this.getZones(this.currentPage)


  }
  onPage(page:any){
    this.currentPage = page
    this.getZones(this.currentPage)

  }

}
