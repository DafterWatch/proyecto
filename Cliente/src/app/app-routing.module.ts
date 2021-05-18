import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DemoComponent } from './demo/demo.component';

import { HomeComponent } from './home/home.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

const routes: Routes = [
  // Con este hacemos q al ir a Localhost:4200 lo envie al home
  { path: '', redirectTo: 'home', pathMatch: 'full'},
  { path: 'home', component: HomeComponent },
  //componente de pruebas - Jose
  { path: 'demo', component: DemoComponent },
  // Esto manda a un componente si no hiso match
  { path: '**', component: PageNotFoundComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
