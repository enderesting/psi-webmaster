import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Website, RatingStatus, RatingResult, Page } from '../website';
import { FormControl } from '@angular/forms';
import { MatChipListboxChange, MatChipSelectionChange } from '@angular/material/chips';
import { WebsiteService } from '../website.service';


// TODO: replace this with real data from your application
/*const TIME_1 = new Date('December 15, 2024 04:28:00');	
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
];*/


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

  constructor(private websiteService: WebsiteService) {
    this.dataSource = new MatTableDataSource<Website>([]);
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.websiteService.getWebsites().subscribe(data => {
      this.dataSource.data = data;
    });
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
  statusFilter = new FormControl('');
  filterValues: any = { //the filter that changes and tracks what data needs to be filtered
    ratingStatus: '',
  }
  
  // generate predicate used to filter
  ngOnInit(): void {
    this.dataSource.filterPredicate = function (site: Website, filter: string) {
      const rowRating = site.ratingStatus;
      const ratings: RatingStatus[] = JSON.parse(filter).ratingStatus;
      return ratings.some((rating) => RatingStatus[rating as unknown as keyof typeof RatingStatus]===rowRating);
    }
}

  // TODO: one button clear all
  clearFilter() {
    this.statusFilter.setValue('');
  }

  // when any of the buttons are pressed, apply filter once more
	applyFilter(event: MatChipListboxChange) {
    this.filterValues.ratingStatus = event.value;
    this.dataSource.filter = JSON.stringify(this.filterValues);
    // console.log(event.value);
    // console.log(this.dataSource.filter);
	}

  submit(input: string) {
    if(input.startsWith("https://") || input.startsWith("http://")) {
      var newSite : Website = {
        _id: '',
        websiteURL: input,
        addedDate: new Date(),
        lastEvalDate: new Date(),
        ratingStatus: RatingStatus.TO_BE_RATED,
        moniteredPages: []
      };
      this.websiteService.addWebsite(newSite).subscribe((site: Website) => {
          newSite._id = site._id;
        });
      this.dataSource.data.push(newSite);
      this.dataSource.data = this.dataSource.data;
      this.dataSource.connect();
    }
  }
}
