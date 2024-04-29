import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Website, RatingStatus, RatingResult, Page } from '../website';
import { FormControl } from '@angular/forms';
import { MatChipListboxChange, MatChipSelectionChange } from '@angular/material/chips';
import { EXAMPLE_SITES } from '../MOCKSITES';
import { WebsiteService } from '../website.service';
import { map } from 'rxjs';

@Component({
  selector: 'app-site-list',
  templateUrl: './site-list.component.html',
  styleUrls: ['./site-list.component.css']
})
export class SiteListComponent implements AfterViewInit {
  displayedColumns = ['websiteURL','addedDate','lastEvalDate','ratingStatus'];
  dataSource: MatTableDataSource<Website>;
  websites: Website[] = []

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private webService:WebsiteService) {
    this.dataSource = new MatTableDataSource<Website>(this.websites); //hook to db instead
  }


  getWebsites():void{
    this.webService.getWebsites()
      .subscribe((res: Website[]) => {
        this.websites = res;
        this.dataSource = new MatTableDataSource<Website>(this.websites);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        // console.log(this.dataSource.data);
      });
  }

  ngAfterViewInit() {
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
  }

  // generate predicate used to filter
  ngOnInit(): void {
      this.getWebsites();
        this.dataSource.filterPredicate = function (site: Website, filter: string) {
        const rowRating = site.ratingStatus;
        const ratings: RatingStatus[] = JSON.parse(filter).ratingStatus;
        return ratings.some((rating) => RatingStatus[rating as unknown as keyof typeof RatingStatus]===rowRating);
      }
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
}
