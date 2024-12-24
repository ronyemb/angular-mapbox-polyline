import { inject, Injectable } from '@angular/core';
import mapboxgl, { AnySourceData, LngLatBounds, Popup } from 'mapbox-gl';
import { LngLatLike, Map, Marker } from 'mapbox-gl';
import { Feature } from '../interfaces/places';
import { DirectionsApiClient } from '../api';
import { DirectionsResponse, Route } from '../interfaces/directions';

@Injectable({
  providedIn: 'root',
})
export class MapService {
  private map: Map | undefined;
  private markers: Marker[] = [];
  private directionsApi = inject(DirectionsApiClient);

  public get isMapReady(): boolean {
    return !!this.map;
  }

  public setMap(map: Map): void {
    this.map = map;
  }

  constructor() {}

  public flyTo(coords: LngLatLike): void {
    if (!this.isMapReady) throw new Error('Map is not ready');

    this.map?.flyTo({
      center: coords,
      zoom: 14,
    });
  }

  public createMarkersFromPlaces(
    places: Feature[],
    userLocation: [number, number]
  ): void {
    if (!this.isMapReady) throw new Error('Map is not ready');

    this.markers.forEach((marker) => marker.remove());
    this.markers = [];
    // const newMarkers: Marker[] = [];

    places.forEach((place) => {
      const [lng, lat] = place.center;
      const marker = new Marker()
        .setLngLat([lng, lat])
        .setPopup(new mapboxgl.Popup().setHTML(`<h3>${place.text}</h3>`))
        .addTo(this.map!);

      this.markers.push(marker);
      // newMarkers.push(marker);
    });

    if (places.length === 0) return;

    //límites del mapa
    const bounds = new mapboxgl.LngLatBounds();
    // console.log(this.markers.length);
    this.markers.forEach((marker) => bounds.extend(marker.getLngLat()));

    bounds.extend(userLocation);

    this.map?.fitBounds(bounds, {
      padding: 100,
    });
  }

  public getRouteBetweenPoints(
    start: [number, number],
    end: [number, number]
  ): void {
    if (!this.isMapReady) throw new Error('Map is not ready');

    const startStr = start.join(',');
    const endStr = end.join(',');

    this.directionsApi
      .get<DirectionsResponse>(`/${startStr};${endStr}`)
      .subscribe((response) => {
        this.drawPolyline( response.routes[0] )
      });
  }

  private drawPolyline(route: Route) {
    console.log({ kms: route.distance / 1000, duration: route.duration / 60 });

    if (!this.map) throw Error('Mapa no inicializado');

    const coords = route.geometry.coordinates;

    const bounds = new LngLatBounds();
    coords.forEach(([lng, lat]) => {
      bounds.extend([lng, lat]);
    });

    this.map?.fitBounds(bounds, {
      padding: 200,
    });

    // Polyline
    const sourceData: AnySourceData = {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'LineString',
              coordinates: coords,
            },
          },
        ],
      },
    };

    if (this.map.getLayer('RouteString')) {
      this.map.removeLayer('RouteString');
      this.map.removeSource('RouteString');
    }

    this.map.addSource('RouteString', sourceData);

    this.map.addLayer({
      id: 'RouteString',
      type: 'line',
      source: 'RouteString',
      layout: {
        'line-cap': 'round',
        'line-join': 'round',
      },
      paint: {
        'line-color': 'black',
        'line-width': 3,
      },
    });

    const popup = new Popup({ closeButton: false, closeOnClick: false })
      .setHTML(`
      <span><strong>Distancia:</strong> ${
        route.distance / 1000
      } kms.</span><br />
      <span><strong>Duración:</strong> ${route.duration / 60} min.</span>
    `);

    this.map.on('mouseover', 'RouteString', (event) => {
      this.map!.getCanvas().style.cursor = 'pointer';
      const coordinates = event.lngLat;
      popup.setLngLat(coordinates).addTo(this.map!);
    });

    this.map.on('mouseleave', 'RouteString', () => {
      this.map!.getCanvas().style.cursor = '';
      popup.remove();
    });
  }
}
