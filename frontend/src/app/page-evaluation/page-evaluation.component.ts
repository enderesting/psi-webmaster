import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Website, RatingStatus, RatingResult, Page, ErrorElement, QWAssertion} from '../website';
import { WebsiteService } from '../website.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-page-evaluation',
  templateUrl: './page-evaluation.component.html',
  styleUrls: ['./page-evaluation.component.css']
})
export class PageEvaluationComponent {

  page!: Page;
  rules!: QWAssertion[];

  passedPercentage!: number;
  warningPercentage!: number;
  failedPercentage!: number;
  notApplicablePercentage!: number;

  constructor(
    private route: ActivatedRoute,
    private websiteService: WebsiteService,
    private location: Location
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.websiteService.getPageEvaluationById(id)
      .subscribe(page => {
        this.page = page;
        this.rules = page.rules ?? [];

        this.passedPercentage = this.calculatePercentage(this.page?.totalPassed ?? 0);
        this.warningPercentage = this.calculatePercentage(this.page?.totalWarning ?? 0);
        this.failedPercentage = this.calculatePercentage(this.page?.totalFailed ?? 0);
        this.notApplicablePercentage = this.calculatePercentage(this.page?.totalNotApplicable ?? 0);
      });
  }

  private calculatePercentage(tests : number): number {
    const totalTests = this.page?.totalTests ?? 1;
    return (tests/totalTests) * 100;
  }

  goBack(): void {
    this.location.back();
  }
}
