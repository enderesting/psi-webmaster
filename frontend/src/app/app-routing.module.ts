import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { WebsiteComponent } from './website/website.component';
import { SiteListComponent } from './site-list/site-list.component';

const routes: Routes = [
  { path: 'website/:id', component: WebsiteComponent },
  { path: 'websites', component: SiteListComponent },
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}