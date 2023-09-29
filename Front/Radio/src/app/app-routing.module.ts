import { NgModule } from '@angular/core';
import { DummyComponent } from './dummy/dummy.component';
import { BlockComponent } from './block/block.component';
import { RouterModule, Routes } from '@angular/router';
import { UserLoginComponent } from './user-login/user-login.component';

const routes: Routes = [
  { path:'', component: UserLoginComponent },
  { path:'login', component: DummyComponent },
  { path:'altaComercio', component: DummyComponent },
  { path:'actualizacionComercio', component: DummyComponent },
  { path:'altaPublicista', component: DummyComponent },
  { path:'liquidacionPublicistas', component: DummyComponent },
  { path:'listadoLiquidaciones', component: DummyComponent },
  { path:'registroPagoPub', component: DummyComponent },
  { path:'actualizacionPublicista', component: DummyComponent },
  { path:'altaContratacion', component: DummyComponent },
  { path:'actualizacionContratacion', component: DummyComponent },
  { path:'registroPago', component: DummyComponent },
  { path:'informeFaltaPago', component: DummyComponent },
  { path:'emisionOrdenes', component: DummyComponent },
  { path:'listadoPublicitario', component: DummyComponent },
  { path:'actualizacionSpot', component: BlockComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
