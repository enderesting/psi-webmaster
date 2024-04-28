import { DataSource } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { map } from 'rxjs/operators';
import { Observable, of as observableOf, merge } from 'rxjs';
import { Website, RatingStatus, RatingResult, Page } from '../website';

// TODO: replace this with real data from your application
const TIME_1 = new Date('December 15, 2024 04:28:00');	
const TIME_2 = new Date('December 16, 2024 04:28:00');	
const TIME_3 = new Date('December 17, 2024 04:28:00');	
const EXAMPLE_PAGES: Page[] = [
  {_id: "1", websiteURL: "https://www.w3schools.com/nodejs",
    lastEvalDate: TIME_1, ratingResult: RatingResult.NONE},
  {_id: "2", websiteURL: 'https://www.w3schools.com/angular', 
    lastEvalDate: TIME_2, ratingResult: RatingResult.COMPLIANT},
  {_id: "3", websiteURL: 'https://www.w3schools.com/typescript', 
    lastEvalDate: TIME_3, ratingResult: RatingResult.NON_COMPLIANT},
];

/**
 * Data source for the SiteList view. This class should
 * encapsulate all logic for fetching and manipulating the displayed data
 * (including sorting, pagination, and filtering).
 */
export class PageListDataSource extends DataSource<Page> {
  data: Page[] = EXAMPLE_PAGES;
  paginator: MatPaginator | undefined;
  sort: MatSort | undefined;

  constructor() {
    super();
  }

  /**
   * Connect this data source to the table. The table will only update when
   * the returned stream emits new items.
   * @returns A stream of the items to be rendered.
   */
  connect(): Observable<Page[]> {
    if (this.paginator && this.sort) {
      // Combine everything that affects the rendered data into one update
      // stream for the data-table to consume.
      return merge(observableOf(this.data), this.paginator.page, this.sort.sortChange)
        .pipe(map(() => {
          return this.getPagedData(this.getSortedData([...this.data ]));
        }));
    } else {
      throw Error('Please set the paginator and sort on the data source before connecting.');
    }
  }

  /**
   *  Called when the table is being destroyed. Use this function, to clean up
   * any open connections or free any held resources that were set up during connect.
   */
  disconnect(): void {}

  /**
   * Paginate the data (client-side). If you're using server-side pagination,
   * this would be replaced by requesting the appropriate data from the server.
   */
  private getPagedData(data: Page[]): Page[] {
    if (this.paginator) {
      const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
      return data.splice(startIndex, this.paginator.pageSize);
    } else {
      return data;
    }
  }

  /**
   * Sort the data (client-side). If you're using server-side sorting,
   * this would be replaced by requesting the appropriate data from the server.
   */
  private getSortedData(data: Page[]): Page[] {
    if (!this.sort || !this.sort.active || this.sort.direction === '') {
      return data;
    }

    return data.sort((a, b) => {
      const isAsc = this.sort?.direction === 'asc';
      switch (this.sort?.active) {
        case 'lastEvalDate': return compare(+a.lastEvalDate, +b.lastEvalDate, isAsc);
        default: return 0;
      }
    });
  }
}

/** Simple sort comparator for example ID/Name columns (for client-side sorting). */
function compare(a: string | number, b: string | number, isAsc: boolean): number {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
