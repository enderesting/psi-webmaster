import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Website, RatingStatus, RatingResult, Page } from '../website';
import { WebsiteService } from '../website.service';
import { Location } from '@angular/common';
import { AbstractControl, FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../dialog/dialog.component';


@Component({
  selector: 'app-website',
  templateUrl: './website.component.html',
  styleUrls: ['./website.component.css']
})
export class WebsiteComponent {
  constructor(
    private route: ActivatedRoute,
    private websiteService: WebsiteService,
    private location: Location,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.websiteService.getWebsiteById(id)
      .subscribe(website => {
        this.website = website
        this.websitePattern = `^${this.website.websiteURL.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`;
        // console.log(this.websitePattern);
        // console.log("ngOnInit: " + website.moniteredPages[0]._id + " "+ website.moniteredPages[0].pageURL);
      });
  }

  website!: Website;
  input: string = '';
  websitePattern:string = '';
  siteFormControl = new FormControl('', [Validators.required]);


  submit(input : string) {
    if(input.startsWith(this.website.websiteURL)) {
      var newPage : Page = {
        _id: '',
        websiteURL: this.website.websiteURL,
        pageURL: input,
        ratingResult: RatingResult.NONE,
      };
      this.websiteService.addPageToWebsite(newPage,this.website._id).subscribe((page: Page) => {
        newPage._id = page._id;
      });
      console.log(this.website.moniteredPages);
      this.website.moniteredPages.push(newPage); // if this isnt pushed, its not triggered
    }
  }
  
  delete() {
    if(this.website.moniteredPages.length > 0) {
      const dialogRef = this.dialog.open(DialogComponent);
      dialogRef.afterClosed().subscribe(() => {
        this.deleteSelected(this.website.moniteredPages);
      });
    }
    this.websiteService.deleteWebsite(this.website).subscribe();
  }

  //called by emiter
  deleteSelected(selection:Page[]):void{
    this.websiteService.deletePages(this.website,selection).subscribe((pages: Page[]) => {
      pages.forEach(page => {
        const index = this.website.moniteredPages.indexOf(page);
        this.website.moniteredPages.splice(index);
      })
    });
  }

  evaluateSelected(selection: Page[]) {
    this.websiteService.evaluatePages(this.website,selection).subscribe(() => {
      // do anything else?
    });
  }

  checkForErrorsIn(formControl: AbstractControl) {
    throw new Error('Method not implemented.');
  }

  goBack(): void {
    this.location.back();
  }
}
