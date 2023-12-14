import { NgModule } from '@angular/core';
import { BlockComponent } from './block/block.component';
import { RouterModule, Routes } from '@angular/router';
import { UserLoginComponent } from './user-login/user-login.component';
import { AltaComercioComponent } from './alta-comercio/alta-comercio.component';
import { NuevoComercioComponent } from './nuevo-comercio/nuevo-comercio.component';
import { NuevoContratoComponent } from './nuevo-contrato/nuevo-contrato.component';
import { NuevaOrdenComponent } from './nueva-orden/nueva-orden.component';
import { ActualizacionComercioComponent } from './actualizacion-comercio/actualizacion-comercio.component';
import { InicioComponent } from './inicio/inicio.component';

const routes: Routes = [
  { path:'', component: InicioComponent },
  { path:'inicio', component: InicioComponent  },
  { path:'login', component: UserLoginComponent  },
  { path:'altaComercio', component: AltaComercioComponent },
  { path:'altaComercio/nuevoComercio', component: NuevoComercioComponent },
  { path:'actualizacionComercio', component: ActualizacionComercioComponent },
  { path:'altaPublicista', component: InicioComponent },
  { path:'liquidacionPublicistas', component: InicioComponent },
  { path:'listadoLiquidaciones', component: InicioComponent },
  { path:'registroPagoPub', component: InicioComponent },
  { path:'actualizacionPublicista', component: InicioComponent },
  { path:'altaContratacion', component: NuevoContratoComponent },
  { path:'actualizacionContratacion', component: InicioComponent },
  { path:'registroPago', component: InicioComponent },
  { path:'informeFaltaPago', component: InicioComponent },
  { path:'emisionOrdenes', component: NuevaOrdenComponent },
  { path:'listadoPublicitario', component: InicioComponent },
  { path:'actualizacionBLoque', component: BlockComponent },
  { path: '**', redirectTo: '', pathMatch: 'full'} // cuando el usuario pone una ruta inexistente redirige a http://localhost:4200

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
