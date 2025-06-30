import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WelcomeComponent } from './welcome/welcome.component';
import { ClientsListComponent } from './clients-list/clients-list.component';

const routes: Routes = [
  { path: '', component: WelcomeComponent },
  { path: 'clients-list', component: ClientsListComponent },
  { path: '**', redirectTo: '' }
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }