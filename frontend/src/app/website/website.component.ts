import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Website, RatingStatus, RatingResult, Page } from '../website';
import { WebsiteService } from '../website.service';
import { Location } from '@angular/common';
import { AbstractControl, FormControl, Validators } from '@angular/forms';



@Component({
  selector: 'app-website',
  templateUrl: './website.component.html',
  styleUrls: ['./website.component.css']
})
export class WebsiteComponent {
  constructor(
    private route: ActivatedRoute,
    private websiteService: WebsiteService,
    private location: Location
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.websiteService.getWebsiteById(id)
      .subscribe(website => {
        this.website = website
        this.websitePattern = `^${this.website.websiteURL.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`;
        // console.log(this.websitePattern);
        console.log("ngOnInit: " + website.moniteredPages[0]._id + " "+ website.moniteredPages[0].pageURL);
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

  //called by emiter
  deleteSelected(selection:Page[]):void{
    for (const eachPage of selection){
      this.deleteSelectedPage(eachPage);
    }
  }

  deleteSelectedPage(page:Page):void{
    const index = this.website.moniteredPages.indexOf(page);
    this.websiteService.deletePageFromWebsite(page).subscribe(() => {
      this.website.moniteredPages.splice(index);
    });
  }


  checkForErrorsIn(formControl: AbstractControl) {
    throw new Error('Method not implemented.');
  }

  goBack(): void {
    this.location.back();
  }
}
