import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage({
  name: 'page-map-preview'
})
@Component({
  selector: 'page-map-preview',
  templateUrl: 'map-preview.html',
})
export class MapPreviewPage {
  /* Google Maps */
  mapInit: any = { lat: -33.9324975, lng: 18.6309301, zoom: 15 };
  markers: any[] = [];

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    if (this.navParams.data) {
      console.log(this.navParams.data)
      this.markers = this.navParams.data
    }
  }

}
