import { NgModule } from '@angular/core';
import { DummyComponent } from './dummy/dummy.component';
import { BlockComponent } from './block/block.component';
import { RouterModule, Routes } from '@angular/router';
import { UserLoginComponent } from './user-login/user-login.component';
import { AltaComercioComponent } from './alta-comercio/alta-comercio.component';
import { NuevoComercioComponent } from './nuevo-comercio/nuevo-comercio.component';
import { NuevoContratoComponent } from './nuevo-contrato/nuevo-contrato.component';
import { NuevaOrdenComponent } from './nueva-orden/nueva-orden.component';

const routes: Routes = [
  { path:'', component: UserLoginComponent },
  { path:'login', component: UserLoginComponent  },
  { path:'altaComercio', component: AltaComercioComponent },
  { path:'altaComercio/nuevoComercio', component: NuevoComercioComponent },
  { path:'actualizacionComercio', component: DummyComponent },
  { path:'altaPublicista', component: DummyComponent },
  { path:'liquidacionPublicistas', component: DummyComponent },
  { path:'listadoLiquidaciones', component: DummyComponent },
  { path:'registroPagoPub', component: DummyComponent },
  { path:'actualizacionPublicista', component: DummyComponent },
  { path:'altaContratacion', component: NuevoContratoComponent },
  { path:'actualizacionContratacion', component: DummyComponent },
  { path:'registroPago', component: DummyComponent },
  { path:'informeFaltaPago', component: DummyComponent },
  { path:'emisionOrdenes', component: NuevaOrdenComponent },
  { path:'listadoPublicitario', component: DummyComponent },
  { path:'actualizacionSpot', component: BlockComponent },
  { path: '**', redirectTo: '', pathMatch: 'full'} // cuando el usuario pone una ruta inexistente redirige a http://localhost:4200

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
