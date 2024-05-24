import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Website, RatingStatus, RatingResult, Page, ErrorElement, QWAssertion} from '../website';
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

  mockRules: QWAssertion[] = [
    {
      code: 'rule1',
      outcome: 'Passed',
      description: 'Description for rule1',
      levels: ['A'],
      elementsAffected: ['element1', 'element2'],
      module: 'act',
      page: this.page
    },
    {
      code: 'rule2',
      outcome: 'Failed',
      description: 'Description for rule2',
      levels: ['AA', 'AAA'],
      elementsAffected: ['element3'],
      module: 'wcag',
      page: this.page
    }
  ];

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
        //this.rules = page.rules ?? [];
        this.rules = this.mockRules;

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
