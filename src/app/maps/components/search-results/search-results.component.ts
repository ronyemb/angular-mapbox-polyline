import { Component, inject } from '@angular/core';
import { PlacesService } from '../../services/places.service';
import { Feature } from '../../interfaces/places';
import { MapService } from '../../services/map.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-search-results',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './search-results.component.html',
  styleUrl: './search-results.component.css'
})
export class SearchResultsComponent {

  private _placesService = inject(PlacesService);
  private _mapService = inject(MapService);
  public selectedId: string | null = null;

  public get isLoadingPlaces(): boolean {
    return this._placesService.isLoadingPaces;
  }

  public get places(): Feature[] {
    return this._placesService.places;
  }

  public flyTo (place : Feature): void {
    this.selectedId = place.id;
    const [ lng, lat ] = place.center;
    this._mapService.flyTo({ lng, lat });
  }

  public getDirections (place: Feature): void {

    if( !this._placesService.useLocation ) throw new Error('User location is not set');

    this._placesService.deletePlaces();

    const start = this._placesService.useLocation!;
    const end = place.center as [number, number];

    this._mapService.getRouteBetweenPoints( start, end );
  }


}
