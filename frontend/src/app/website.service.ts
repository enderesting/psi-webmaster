import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, of, tap } from 'rxjs';
import { Page, Website } from './website';
import { EXAMPLE_SITES } from './MOCKSITES';


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
    return this.http.get<Website>(url)
          .pipe(
            catchError(this.handleError<Website>('getWebsite'))
            );
  }

  getWebsites(): Observable<Website[]> {
    // hopefully we wont need these
    // const sites = of(EXAMPLE_SITES);
    // return sites;
    return this.http.get<Website[]>(this.websiteURL)
          .pipe(
            catchError(this.handleError<Website[]>('getWebsites'))
            );
  }

  addWebsite(website: Website): Observable<Website> {
    return this.http.post<Website>(this.websitesURL, website, this.httpOptions);
  }

  addPageToWebsite(page: Page, websiteId: string) {
    const url = `${this.websiteURL}/${websiteId}`;
    return this.http.post<Page>(url, page, this.httpOptions);
  }

  /* dw about this until sprint 2 */
  deleteWebsite(){}

  deletePageToWebsite(){}


  /** error handling */
  private handleError<T>(operation = 'operation', result?: T) {
		return (error: any): Observable<T> => {

		// TODO: send the error to remote logging infrastructure
		console.error(error); // log to console instead
		// Let the app keep running by returning an empty result.
		return of(result as T);
		};
	}
}
