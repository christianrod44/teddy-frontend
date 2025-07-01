import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WelcomeComponent } from './welcome/welcome.component';
import { ClientsListComponent } from './clients-list/clients-list.component';
import { ClientsSelectedComponent } from './clients-selected/clients-selected.component';

const routes: Routes = [
  { path: '', component: WelcomeComponent },
  { path: 'clients-list', component: ClientsListComponent },
  { path: 'clients-selected', component: ClientsSelectedComponent },
  { path: '**', redirectTo: '' }
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }