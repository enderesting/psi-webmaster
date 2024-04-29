import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Website, RatingStatus, RatingResult, Page } from '../website';
import { WebsiteService } from '../website.service';


@Component({
  selector: 'app-website',
  templateUrl: './website.component.html',
  styleUrls: ['./website.component.css']
})
export class WebsiteComponent {
  website!: Website;
  input: string = '';

  constructor(
    private route: ActivatedRoute,
    private websiteService: WebsiteService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.websiteService.getWebsiteById(id)
      .subscribe(website => this.website = website);
  }

  submit(input : string) {
    if(input.startsWith(this.website.websiteURL) || input.startsWith(this.website.websiteURL)) {
      var newPage : Page = {
        _id: '123', // placeholder
        websiteURL: input,
        lastEvalDate: new Date(),
        ratingResult: RatingResult.NONE,
      };
      this.website.moniteredPages.push(newPage);
    }
  }
}
