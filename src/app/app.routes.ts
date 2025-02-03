import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { IntegrationComponent } from './components/integration/integration.component';
import { DataBrowserComponent } from './components/data-browser/data-browser.component';
import { FindUserComponent } from './components/find-user/find-user.component';

export const routes: Routes = [{
    path: '', redirectTo: '/home', pathMatch: 'full'
},
{ path: 'home', component: HomeComponent },
{ path: 'integration', component: IntegrationComponent },
{ path: 'data-browser', component: DataBrowserComponent },
{ path: "find-user", component: FindUserComponent },
];
