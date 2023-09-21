import { NgModule } from '@angular/core';
import { DummyComponent } from './dummy/dummy.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
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
  { path:'actualizacionSpot', component: DummyComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
