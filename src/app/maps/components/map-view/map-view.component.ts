import mapboxgl from 'mapbox-gl';
import { PlacesService } from './../../services/places.service';
import { Component, inject, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { Map, Popup, Marker } from 'mapbox-gl';
import { MapService } from '../../services/map.service';

@Component({
  selector: 'app-map-view',
  standalone: true,
  imports: [],
  templateUrl: './map-view.component.html',
  styleUrl: './map-view.component.css'
})
export class MapViewComponent implements AfterViewInit {

  private _placesService = inject(PlacesService);
  private _mapService = inject(MapService);

  @ViewChild('mapDiv')
  mapDivElement!: ElementRef;

  constructor() {}

  ngAfterViewInit(): void {

    if( !this._placesService.useLocation ) throw Error('User location not found');

    const map = new Map({
      container: this.mapDivElement.nativeElement,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: this._placesService.useLocation,
      zoom: 14
    });

    const popup = new Popup().setHTML(`
      <h6>Im Here</h6>
      <span>Im here in this place of world</span>
      `);

      new Marker({ color: 'red' })
        .setLngLat(this._placesService.useLocation)
        .setPopup(popup)
        .addTo(map);

      this._mapService.setMap(map);



  }

}
