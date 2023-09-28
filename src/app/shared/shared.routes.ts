
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegistrarComponent } from './registrar/registrar.component';


const sharedRoutes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'registrar', component: RegistrarComponent },
  //{ path: '**', pathMatch: 'full', redirectTo: '' }
];

//export const SHARED_ROUTES = RouterModule.forChild(sharedRoutes);
export const SHARED_ROUTES = RouterModule.forRoot(sharedRoutes, {useHash: true});
