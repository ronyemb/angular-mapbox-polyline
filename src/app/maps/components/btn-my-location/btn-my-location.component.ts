import { Component, inject } from '@angular/core';
import { MapService } from '../../services/map.service';
import { PlacesService } from '../../services/places.service';

@Component({
  selector: 'app-btn-my-location',
  standalone: true,
  imports: [],
  templateUrl: './btn-my-location.component.html',
  styleUrl: './btn-my-location.component.css'
})
export class BtnMyLocationComponent {

  private _mapService = inject(MapService);
  private _placesService = inject(PlacesService);

  constructor(){}

  public goToMyLocation(): void {

    if( !this._placesService.isUserLocationReady ) throw Error('User location not found');
    if ( !this._mapService.isMapReady ) throw Error('Map is not ready');

    this._mapService.flyTo(this._placesService.useLocation!);
  }
}
