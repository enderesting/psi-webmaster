import { AfterViewInit, Component, ViewChild, Input } from '@angular/core';
import { MatTable } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { PageListDataSource } from './page-list-datasource';
import { Website, RatingStatus, RatingResult, Page } from '../website';

@Component({
  selector: 'app-page-list',
  templateUrl: './page-list.component.html',
  styleUrls: ['./page-list.component.css']
})
export class PageListComponent implements AfterViewInit {
  @Input() monitoredPages: Page[] = [];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<Page>;

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['websiteURL','lastEvalDate','ratingResult'];

  ngAfterViewInit(): void {
    this.table.dataSource = this.monitoredPages;
  }
}
