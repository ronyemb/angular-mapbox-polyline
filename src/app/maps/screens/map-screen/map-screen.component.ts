import { Component } from '@angular/core';
import { PlacesService } from '../../services/places.service';
import { LoadingComponent } from '../../components/loading/loading.component';
import { MapViewComponent } from '../../components/map-view/map-view.component';
import { AngularLogoComponent } from "../../components/angular-logo/angular-logo.component";
import { BtnMyLocationComponent } from '../../components/btn-my-location/btn-my-location.component';
import { SearchBarComponent } from '../../components/search-bar/search-bar.component';
// import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-map-screen',
  standalone: true,
  imports: [
    // CommonModule,
    LoadingComponent,
    MapViewComponent,
    AngularLogoComponent,
    BtnMyLocationComponent,
    SearchBarComponent
],
  templateUrl: './map-screen.component.html',
  styleUrl: './map-screen.component.css',
})
export default class MapScreenComponent {

  constructor(private placesService: PlacesService) {
    this.placesService.getUserLocation();
  }

  public get isUserLocationReady(): boolean {
    return this.placesService.isUserLocationReady;
  }



}
