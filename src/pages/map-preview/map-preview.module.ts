import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import { AgmCoreModule } from '@agm/core';

import { MapPreviewPage } from './map-preview';

@NgModule({
  declarations: [
    MapPreviewPage,
  ],
  imports: [
    IonicPageModule.forChild(MapPreviewPage),
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyCdQ89FE4gvrkYwdleuJDLz-Plcibu10u8' // auguste.vnieuwenhuyzen@gmail.com
    })
  ],
})
export class MapPreviewPageModule {}
