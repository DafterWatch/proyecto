import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccountRecoveryComponent } from './account-recovery/account-recovery.component';
import { CalenderComponent } from './calender/calender.component';
import { CalificarTareaComponent } from './calificar-tarea/calificar-tarea.component';
import { CrearFormularioComponent } from './crear-formulario/crear-formulario.component';
import { CrearComponent } from './crear/crear.component';
import { DemoComponent } from './demo/demo.component';
import { EntregarComponent } from './entregar/entregar.component';
import { FormularioComponent } from './formulario/formulario.component';
import { GroupMenuComponent } from './group-menu/group-menu.component';

import { HomeComponent } from './home/home.component';
import { InicioComponent } from './inicio/inicio.component';
import { ListaTareas1Component } from './lista-tareas1/lista-tareas1.component';
import { ListaTareas2Component } from './lista-tareas2/lista-tareas2.component';
import { LoginComponent } from './login/login.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { PerfilComponent } from './perfil/perfil.component';
import { RegisterComponent } from './register/register.component';

const routes: Routes = [
  // Con este hacemos q al ir a Localhost:4200 lo envie al login - a la primera pantalla q deseamos q vea
  { path: '', redirectTo: 'inicio', pathMatch: 'full'},
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'recovery', component: AccountRecoveryComponent },
  { path: 'calender', component: CalenderComponent },
  { path: 'homework1', component: ListaTareas1Component },
  { path: 'homework2', component: ListaTareas2Component },
  { path: 'assign', component: CalificarTareaComponent },
  { path: 'create', component: CrearComponent },
  { path: 'send', component: EntregarComponent },
  { path: 'perfil', component: PerfilComponent },
  { path: 'inicio', component: InicioComponent },  
  { path: 'form', component: CrearFormularioComponent },
  { path: 'formulario', component: FormularioComponent },
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
