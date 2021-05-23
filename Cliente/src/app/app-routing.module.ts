import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DemoComponent } from './demo/demo.component';
import { GroupMenuComponent } from './group-menu/group-menu.component';

import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { RegisterComponent } from './register/register.component';

const routes: Routes = [
  // Con este hacemos q al ir a Localhost:4200 lo envie al login - a la primera pantalla q deseamos q vea
  { path: '', redirectTo: 'login', pathMatch: 'full'},
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  //componente de pruebas - Jose
  //{ path: 'demo', component: DemoComponent },
  //{ path: 'group-menu', component: GroupMenuComponent },
  // Esto manda a un componente si no hiso match
  { path: '**', component: PageNotFoundComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
