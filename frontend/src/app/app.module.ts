import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SiteListComponent } from './site-list/site-list.component';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { WebsiteComponent } from './website/website.component';
import { StatusFilterComponent } from './status-filter/status-filter.component';
import { CommonModule } from '@angular/common';
import { MatChipsModule } from '@angular/material/chips';

@NgModule({
    declarations: [
        AppComponent,
        SiteListComponent,
        WebsiteComponent,
    ],
    providers: [],
    bootstrap: [AppComponent],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        MatTableModule,
        MatPaginatorModule,
        MatSortModule,
        MatChipsModule,
        StatusFilterComponent,
        CommonModule,
        
    ]
})
export class AppModule { }
