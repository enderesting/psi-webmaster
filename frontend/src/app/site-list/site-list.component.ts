import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Website, RatingStatus, RatingResult, Page } from '../website';
import { FormControl } from '@angular/forms';


// TODO: replace this with real data from your application
const TIME_1 = new Date('December 15, 2024 04:28:00');	
const TIME_2 = new Date('December 16, 2024 04:28:00');	
const TIME_3 = new Date('December 17, 2024 04:28:00');	
const EXAMPLE_PAGES: Page[] = [
  {_id: "1", websiteURL: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    lastEvalDate: TIME_3, ratingResult: RatingResult.NONE},
]
const EXAMPLE_SITES: Website[] = [
  {_id: "1", websiteURL: 'www.youtube.com', 
    addedDate: TIME_1, lastEvalDate: TIME_2,
    ratingStatus: RatingStatus.TO_BE_RATED,
    moniteredPages:EXAMPLE_PAGES},
  {_id: "2", websiteURL: 'https://www.w3schools.com/', 
    addedDate: TIME_2, lastEvalDate: TIME_3,
    ratingStatus: RatingStatus.BEING_RATED,
    moniteredPages:[]},
  {_id: "3", websiteURL: 'https://maia.crimew.gay/', 
    addedDate: TIME_2, lastEvalDate: TIME_3,
    ratingStatus: RatingStatus.RATED,
    moniteredPages:[]},
];


@Component({
  selector: 'app-site-list',
  templateUrl: './site-list.component.html',
  styleUrls: ['./site-list.component.css']
})
export class SiteListComponent implements AfterViewInit {
  displayedColumns = ['websiteURL','addedDate','lastEvalDate','ratingStatus'];
  dataSource: MatTableDataSource<Website>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor() {
    this.dataSource = new MatTableDataSource(EXAMPLE_SITES); //hook to db instead
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  /**URL input */
  input: string = '';

  /** Set up statuses ref for filter */
  ratingStatus = RatingStatus;
  statuses():Array<string>{
    var statuses = Object.keys(this.ratingStatus)
    return statuses;
  }

  /** Set up filters */
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  statusFilter = new FormControl('');
  filterValues: any = { //the filter that changes and tracks what data needs to be filtered
    ratingStatus: '',
  }
  private fieldListener() {
  this.statusFilter.valueChanges
    .subscribe(
      status => {
        this.filterValues.ratingStatus = status;
        this.dataSource.filter = JSON.stringify(this.filterValues);
      }
    ) // copy this block for other filters
  }
  private createFilter(): (site: Website, filter: string) => boolean {
    let filterFunction = function (site: Website, filter: string): boolean {
      let searchTerms = JSON.parse(filter);

      return site.ratingStatus.indexOf(searchTerms.status) !== -1;
    }

    return filterFunction;
  }
  clearFilter() {
    this.statusFilter.setValue('');
  }
}
