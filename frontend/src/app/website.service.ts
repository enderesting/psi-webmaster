import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Page, Website } from './website';

@Injectable({
  providedIn: 'root'
})
export class WebsiteService {

  private websiteURL = 'api/website';
  private websitesURL = 'api/websites';

  httpOptions = {
    headers: new HttpHeaders({'Content-Type': 'application/json'})
  };

  constructor(private http: HttpClient) {}

  getWebsiteById(id: string): Observable<Website> {
    const url = `${this.websiteURL}/${id}`;
    return this.http.get<Website>(url);
  }

  getWebsites(): Observable<Website[]> {
    return this.http.get<Website[]>(this.websitesURL);
  }

  addWebsite(website: Website): Observable<Website> {
    return this.http.post<Website>(this.websitesURL, website, this.httpOptions);
  }

  addPageToWebsite(page: Page, websiteId: string) {
    const url = `${this.websiteURL}/${websiteId}`;
    return this.http.post<Page>(url, page, this.httpOptions);
  }
}
