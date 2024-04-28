import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Website } from './website';

@Injectable({
  providedIn: 'root'
})
export class WebsiteService {

  private url = 'api/website';

  constructor(private http: HttpClient) {}

  getWebsiteById(id: string): Observable<Website> {
    const url = `${this.url}/${id}`;
    return this.http.get<Website>(url)
  }
}
