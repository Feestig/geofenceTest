import { Component } from '@angular/core';
import { NavController, Platform, Events } from 'ionic-angular';

import { Geofence } from '@ionic-native/geofence';
import { Geolocation } from '@ionic-native/geolocation';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  /* Segment Switch */
  project: string = 'mapping';

  /* POI form */
  poiName: string;
  geofenceTransitionTypes: any[] = [ { type: 1, description: "entering" }, { type: 2, description: "leaving" } ];
  selectedGeofenceTransitionType: any;

  /* Current location */
  lat: number;
  lng: number;

  /* Range */
  radius: number = 100;

  /* Geofences */
  msg: string;
  result: string;

  geos: any = [];

  /* Google Maps */
  markers: any[] = [];

  constructor(public navCtrl: NavController, private _geofence: Geofence, private _geolocation: Geolocation, public platform: Platform, public events: Events) {
  }

  ionViewDidLoad() {
    this.platform.ready().then(() => {
      // initialize the plugin
      this._geofence.initialize().then(
        // resolved promise does not return a value
        () => {
          this.msg = 'Geofence Plugin Ready'
          this._geofence.removeAll()
          .then(
            () => this.msg = 'fences cleared',
            (err) => this.msg = err
            )
        },
        (err) => this.msg = err
        )
    })
  }

  ionViewDidEnter() {

  }

  getCurrentLocation(): void {
    this._geolocation.getCurrentPosition({ enableHighAccuracy: true }).then((resp) => {
     // resp.coords.latitude
     // resp.coords.longitude
     console.log(resp)
     this.lat = resp.coords.latitude
     this.lng = resp.coords.longitude

    this.geofenceTransitionTypes.filter((c) => c.type == this.selectedGeofenceTransitionType)

    this.markers.push({ lat: this.lat, lng: this.lng, radius: this.radius, color: this.generateRandomColor(), name: this.poiName, transitionType: this.selectedGeofenceTransitionType })
    console.log(this.markers)

     // let watch = this._geolocation.watchPosition();
     //  watch.subscribe((data) => {
     //   // data can be a set of coordinates, or an error (if an error occurred).
     //   this.lat = data.coords.latitude
     //   this.lng = data.coords.longitude
     //  });

     // this.addGeofence() // move to testing section

   }).catch((error) => {
     for (let i in error) {
       console.error(error[i])
     }
     this.msg = 'Error getting location';
   });
 }

 private addGeofence(): void {
    //options describing geofence
    let fences = [
      {
        id: 'Leave', //any unique ID
        latitude:       this.lat, //center of geofence radius
        longitude:      this.lng,
        radius:         20, //radius to edge of geofence in meters. Try increase the radius, 3 meters is not enough to catch any transition, try with 100 instead.
        transitionType: 2, //see 'Transition Types' below
        notification: { //notification settings
            id:             2, //any unique ID
            title:          'You crossed a fence', //notification title
            text:           'You just left CoLab.', //notification body
            openAppOnClick: true //open app when notification is tapped
        }
      },
      {
        id: 'Enter', //any unique ID
        latitude:       this.lat, //center of geofence radius
        longitude:      this.lng,
        radius:         25, //radius to edge of geofence in meters. Try increase the radius, 3 meters is not enough to catch any transition, try with 100 instead.
        transitionType: 1, //see 'Transition Types' below
        notification: { //notification settings
            id:             2, //any unique ID
            title:          'You crossed a fence', //notification title
            text:           'You just entered CoLab.', //notification body
            openAppOnClick: true //open app when notification is tapped
        }
      }
    ]

    this._geofence.addOrUpdate(fences).then(
      () => {
        this.msg = 'Geofences added'

        this._geofence.getWatched()
        .then((geofencesJson) => {
          const geofences = JSON.parse(geofencesJson);
          this.geos = geofences;
        });
      },
      (err) => this.msg = 'Geofence failed to add'
    )

    this._geofence.onTransitionReceived()
    .subscribe(
      (resp) => {
        this.result = resp
        // this.events.publish('transition:recieved');
        this.msg = 'Transition Received'
      },
      (err) => this.msg = err
      )
  }

  previewOnMap(): void {
    // Show modal? page with map
    this.navCtrl.push('page-map-preview', this.markers)
  }

  private generateRandomColor(): string {
    return '#' + Math.floor(Math.random() * 16777215).toString(16)
  }
}
