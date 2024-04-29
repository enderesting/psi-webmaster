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
    if(input.startsWith(this.website.websiteURL)) {
      var newPage : Page = {
        _id: '',
        websiteURL: input,
        pageURL: input,
        lastEvalDate: new Date(),
        ratingResult: RatingResult.NONE,
      };
      this.websiteService.addPageToWebsite(newPage,this.website._id).subscribe((page: Page) => {
        newPage._id = page._id;
        this.website.moniteredPages.push(newPage);
      });
    }
  }
}
