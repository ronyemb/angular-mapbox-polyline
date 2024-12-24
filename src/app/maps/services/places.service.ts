import { inject, Injectable } from '@angular/core';
import { Feature, PlacesResponse } from '../interfaces/places';
import { PlacesApiClient } from '../api';
import { MapService } from './map.service';

@Injectable({
  providedIn: 'root',
})
export class PlacesService {
  public useLocation?: [number, number];
  public isLoadingPaces: boolean = false;
  public places: Feature[] = [];

  public get isUserLocationReady(): boolean {
    return !!this.useLocation;
  }

  private _placesApi = inject(PlacesApiClient);
  private _mapService = inject(MapService);

  constructor() {
    this.getUserLocation();
  }

  public async getUserLocation(): Promise<[number, number]> {
    return new Promise((resolve, reject) => {
      if (this.isUserLocationReady) {
        if (this.useLocation) {
          resolve(this.useLocation);
        } else {
          reject('User location is not set');
        }
      } else {
        navigator.geolocation.getCurrentPosition(
          ({ coords }) => {
            this.useLocation = [coords.longitude, coords.latitude];
            resolve(this.useLocation);
          },
          (err) => {
            alert('Cannot get user location');
            console.log(err);
            reject(err);
          }
        );
      }
    });
  }

  public getPlacesByQuery(query: string): void {

    if ( query.length === 0 ) {
      this.isLoadingPaces = false;
      this.places = [];
      return
    }

    if (!this.useLocation) throw new Error('User location is not set');

    this.isLoadingPaces = true;

    this._placesApi
      .get<PlacesResponse>(`/${query}.json`, {
        params: {
          proximity: this.useLocation.join(','),
        },
      })
      .subscribe({
        next: (res) => {
          // console.log(res.features);

          this.isLoadingPaces = false;
          this.places = res.features;
          this._mapService.createMarkersFromPlaces( this.places, this.useLocation! );
        },
        error: (err) => {
          console.error(err);
        },
      });
  }

  deletePlaces() {
    this.places = [];
  }
}
