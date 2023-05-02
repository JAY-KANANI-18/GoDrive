import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DashService } from 'src/app/services/dashboard.service';
import { PricingService } from 'src/app/services/pricing.servive';
// declare const google: any;
let infoWindow: google.maps.InfoWindow
let map!: google.maps.Map
let marker: google.maps.Marker
let geocoder = new google.maps.Geocoder;
let service = new google.maps.DistanceMatrixService()

@Component({
  selector: 'app-maps',
  templateUrl: './maps.component.html',
  styleUrls: ['./maps.component.scss']
})
export class MapsComponent implements OnInit {
  loaction: any = { lat: 22, lng: 22 }
  newLocation: any
  TotalDistance: any
  TotalTime: any
  polyValid:any = true
  zoneMode = false
  data = {
    lat: 22,
    lng: 22
  }
  zone: any = []
  allzones: any
  countriesArray: any
  countryObj: any
  selectedCountry: any
  allZones: any
  polygon: any
  updateId: any
  activateUpdate =false
  activateAddZone =true
  @ViewChild('fromInput') fromInput: ElementRef;
  @ViewChild('toInput') toInput: ElementRef;


  constructor(private dashService: DashService, private pricingService: PricingService) { }


  ngOnInit() {
    this.getZones()

    this.pricingService.getAddedCountry().subscribe((data: any) => {
      this.countriesArray = []

      data.forEach(element => {
        this.countriesArray.push(element.name)



      });

console.log(data);

      // this.countryObj = data.countriesObject




    })

    this.forCurrentlocation()
    this.forAutofordist()


  }




  initMap(data: any) {
    let option = {
      zoom: 8,
      center: data,
      animation: google.maps.Animation.DROP

    }
    map = new google.maps.Map(document.getElementById('map') as HTMLElement, option)




  }



  forCurrentlocation() {

    navigator.geolocation.getCurrentPosition((position) => {
      let data = {
        lat: position.coords.latitude,
        lng: position.coords.longitude

      }
      this.initMap(data)

      this.forAutofordist()
      this.forPoly()
      // this.forholy()
    })


  }
  forholy(data: any) {
    const coordinates = data

    // Create a map object
    const map = new google.maps.Map(document.getElementById("map"), {
      zoom: 8,
      center: { lat: 37.7749, lng: -122.4194 }
    });

    // Create a polygon object
    const polygon = new google.maps.Polygon({
      paths: coordinates,
      strokeColor: "#FF0000",
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: "#FF0000",
      fillOpacity: 0.35,
      editable: true,
      draggable: true
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





  forPoly() {

    var map = new google.maps.Map(document.getElementById('map') as HTMLElement, {
      zoom: 10,
      center: { lat: 37.7749, lng: -122.4194 } // set initial map center
    });



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



  forAutofordist() {
    let option = {
      componentRestrictions: { country: 'us' }


    }
    let autocomplete = new google.maps.places.Autocomplete(document.getElementById('city') as HTMLInputElement, {
      types: ['(cities)'],




    })



    google.maps.event.addListener(autocomplete, 'place_changed', () => {
      var place = autocomplete.getPlace()
      let lat = place.geometry?.location?.lat()
      let lng = place.geometry?.location?.lng()

      let selectedLocation: any = {
        lat,
        lng


      }

      map.setCenter(selectedLocation)

      this.addMarker({ coords: selectedLocation })

    })




  }
  addMarker(props: any) {
    marker = new google.maps.Marker({
      position: props.coords,
      map: map,
      draggable: true, // set draggable option to true
      title: 'Drag me!'

    })

    if (props.icon) {
      marker.setIcon(props.icon)
    }
    if (props.content) {
      infoWindow = new google.maps.InfoWindow({
        content: props.content
      })
    }


    marker.addListener('click', () => {
      infoWindow.open(map, marker)
    })


    google.maps.event.addListener(marker, 'dragend', function () {
      let newplace = marker.getPosition();
      geocoder.geocode({ location: newplace }, function (results: any, status) {
        if (status === 'OK') {
          if (results[0]) {

            let ele = document.getElementById('searchInput') as HTMLInputElement
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



  addZone(country: any, city: any) {
      if((this.zone.length == 0) || (this.zone.length<=3)){
        this.polyValid = false
        return
      }
    let zoneData = {
      country: country,
      city: {
        name: city,
        zone: this.zone
      }


    }
    console.log(zoneData);
    this.pricingService.addZone(zoneData).subscribe((data: any) => {
      this.forCurrentlocation()
      this.getZones()

    })
    console.log(zoneData);


    // this.dashService.addZone(country)





  }
  getZones() {
    this.pricingService.getZone().subscribe((data: any) => {
      // console.log(data);
      this.allzones = data

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
        el2.value = data.city.name
        this.updateId = data._id
        this.forholy(data.city.zone)

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
      city: {
        name: city.value,
        zone: coordinates
      }

    }
    console.log(zoneData);
    this.pricingService.saveCity(this.updateId, zoneData).subscribe((data: any) => {
      this.activateUpdate = false
      this.activateAddZone = true
      this.forCurrentlocation()


      console.log(data);
      this.getZones()
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
        this.getZones()

      }, error: (error) => {
        console.log(error);
      }
    })
  }
  onCancel(){
    this.getZones()
    this.activateUpdate = false
    this.activateAddZone = true
    this.forCurrentlocation()

  }


}
