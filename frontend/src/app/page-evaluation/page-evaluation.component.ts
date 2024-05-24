import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Website, RatingStatus, RatingResult, Page, ErrorElement, QWAssertion, AffectedElement} from '../website';
import { WebsiteService } from '../website.service';
import { Location } from '@angular/common';
import { MatChipListboxChange, MatChipOption } from '@angular/material/chips';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-page-evaluation',
  templateUrl: './page-evaluation.component.html',
  styleUrls: ['./page-evaluation.component.css']
})
export class PageEvaluationComponent {

  page!: Page;
  rules!: QWAssertion[];

  mockElem1: AffectedElement = {
    verdict: "passed",
    elements: ['<a href=\"/w/index.php?title=End-to-end_encryption&amp;action=edit&amp;section=11\" title=\"Edit section: References\">edit</a>', 'elem2'],
  }
  mockElem2: AffectedElement = {
    verdict: "warning",
    elements: ['elem2', 'elem3'],
  }
  mockRules: QWAssertion[] = [
    {
      code: 'rule1',
      outcome: 'Passed',
      description: 'Description for rule1',
      levels: ['A'],
      elementsAffected: [this.mockElem1,this.mockElem2],
      module: 'act',
      page: this.page

    },
    {
      code: 'rule2',
      outcome: 'Failed',
      description: 'Description for rule2',
      levels: ['AA', 'AAA'],
      elementsAffected: [this.mockElem1],
      module: 'wcag',
      page: this.page
    }
  ];

  passedPercentage!: number;
  warningPercentage!: number;
  failedPercentage!: number;
  notApplicablePercentage!: number;
  items!: [1,2,3,4,5];

  constructor(
    private route: ActivatedRoute,
    private websiteService: WebsiteService,
    private location: Location
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.websiteService.getPageEvaluationById(id)
      .subscribe(pageReport => {
        this.page = pageReport;
        // this.page.pageURL = pageReport.pageURL;
        // this.page.totalFailed = pageReport.totalFailed;
        // this.page.totalPassed = pageReport.totalPassed;
        // this.page.totalWarning = pageReport.totalWarning;
        // this.page.totalFailed = pageReport.totalFailed;
        // this.page.totalNotApplicable = pageReport.totalNotApplicable;


        //this.rules = page.rules ?? [];
        this.rules = this.mockRules;
        console.log("this.rules[0].elementsAffected[0].verdict: " + this.rules[0].elementsAffected[0].verdict);
        this.filterRules();

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

  modules = ['act', 'wcag'];
  results = ['Passed', 'Warning', 'Failed', 'Not applicable'];
  levels = ['A', 'AA', 'AAA'];

  selectedModules: String[] = this.modules;
  selectedResults: String[] = this.results;
  selectedLevels: String[] = this.levels;

  filteredRules: QWAssertion[] = [];

  setFilter(event:MatChipListboxChange, filterType: string) {
    var listbox: MatChipOption | MatChipOption[] = event.source.selected;

    let chipOpts : MatChipOption[];
    if (listbox instanceof MatChipOption)
      chipOpts = [listbox];
    else
      chipOpts = listbox;

    const values : String[] = chipOpts.map((opt) => opt.value);
    if (filterType === 'module')
      this.selectedModules = values;
    else if (filterType === 'result')
      this.selectedResults = values;
    else if (filterType === 'level')
      this.selectedLevels = values;

    this.filterRules();
  }

  filterRules() {
    this.filteredRules = this.rules.filter(rule => {
      return this.selectedModules.includes(rule.module) &&
        this.selectedResults.includes(rule.outcome) &&
        rule.levels.some(level => this.selectedLevels.includes(level));
    });
  }

  
}