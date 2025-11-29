import { Component } from '@angular/core';
import { CommunityPageElementComponent } from '../community-page-element/community-page-element.component';
import { CommunityPageFilterComponent } from '../community-page-filter/community-page-filter.component';

@Component({
  selector: 'app-community-page-wrapper',
  imports: [CommunityPageElementComponent, CommunityPageFilterComponent],
  templateUrl: './community-page-wrapper.component.html',
  styleUrl: './community-page-wrapper.component.scss',
})
export class CommunityPageWrapperComponent {}
