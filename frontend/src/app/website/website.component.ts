import { Component } from '@angular/core';
import { Website, RatingStatus, RatingResult, Page } from '../website';

@Component({
  selector: 'app-website',
  templateUrl: './website.component.html',
  styleUrls: ['./website.component.css']
})
export class WebsiteComponent {
    website!: Website;
}
