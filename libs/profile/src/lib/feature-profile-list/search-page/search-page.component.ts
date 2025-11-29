import { Component } from '@angular/core';
import { ProfileFiltersComponent } from '../profile-filters/profile-filters.component';
import { ProfileWrapComponent } from '../profile-wrap/profile-wrap.component';

@Component({
  selector: 'app-search-page',
  imports: [ProfileFiltersComponent, ProfileWrapComponent],
  templateUrl: './search-page.component.html',
  styleUrl: './search-page.component.scss',
})
export class SearchPageComponent {}
