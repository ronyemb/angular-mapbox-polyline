import { Component, inject } from '@angular/core';
import { SearchResultsComponent } from '../search-results/search-results.component';
import { PlacesService } from '../../services/places.service';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [SearchResultsComponent],
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.css'
})
export class SearchBarComponent {

  private _debounceTimer?: NodeJS.Timeout;
  private _placesService = inject(PlacesService);

  public onQueryChanged(query: string = ''): void {
    if (this._debounceTimer) {
      clearTimeout(this._debounceTimer);
    }
    this._debounceTimer = setTimeout(() => {
      this._placesService.getPlacesByQuery(query);
    }, 300);
  }

}
