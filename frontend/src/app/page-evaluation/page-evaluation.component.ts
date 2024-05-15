import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Website, RatingStatus, RatingResult, Page, ErrorElement} from '../website';
import { WebsiteService } from '../website.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-page-evaluation',
  templateUrl: './page-evaluation.component.html',
  styleUrls: ['./page-evaluation.component.css']
})
export class PageEvaluationComponent {

  page!: Page;

  constructor(
    private route: ActivatedRoute,
    private websiteService: WebsiteService,
    private location: Location
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.websiteService.getPageEvaluationById(id)
      .subscribe(page => {
        this.page = page
      });
  }
}
