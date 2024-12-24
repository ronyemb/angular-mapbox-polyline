import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import Mapboxgl from 'mapbox-gl';

Mapboxgl.accessToken = 'pk.eyJ1IjoiZnJhbnJpcXVlbG1lNCIsImEiOiJjbGhjZnQweGQwcW9rM3NtdDgzZW44ejNlIn0.DWW1_LNV3YlGV3qbsvsf6Q';

if ( !navigator.geolocation ) {
  alert('Geolocation is not supported by your browser');
  throw new Error('Geolocation is not supported by your browser');
}

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
