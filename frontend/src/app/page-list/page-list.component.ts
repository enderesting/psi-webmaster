import { AfterViewInit, Component, ViewChild, Input } from '@angular/core';
import { MatTable } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Website, RatingStatus, RatingResult, Page } from '../website';
import { SelectionModel } from '@angular/cdk/collections';

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
  displayedColumns = ['select','websiteURL','lastEvalDate','ratingResult'];
  clickedRows = new Set<Page>();
  selection = new SelectionModel<Page>(true, []);

  ngAfterViewInit(): void {
    this.table.dataSource = this.monitoredPages;
  }

  ngAfterViewChecked(): void {
    this.table.renderRows();
  }

  deleteSelectedPages(): void{
    for (const eachPage of this.selection.selected){
      this.deleteSelectedPage(eachPage);
    }
  }

  deleteSelectedPage(page:Page):void{
    console.log("delete:" + page.pageURL);
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.monitoredPages.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.monitoredPages);
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: Page): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'}`; //row ${row.position + 1}`;
  }
}
