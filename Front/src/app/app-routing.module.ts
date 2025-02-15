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
import { NewOwnerContactShopComponent } from './alta-titular-contacto-comercio/alta-titular-contacto-comercio.component';
import { ShopListComponent } from './shop-list/shop-list.component';
import { OwnerComponent } from './owner/owner.component';
import { ContactComponent } from './contact/contact.component';
import { BlockListComponent } from './block-list/block-list.component';
import { ComerciosPageComponent } from './pages/comercios-page/comercios-page.component';
import { PublicistasPageComponent } from './pages/publicistas-page/publicistas-page.component';
import { ContactosPageComponent } from './pages/contactos-page/contactos-page.component';
import { TitularesPageComponent } from './pages/titulares-page/titulares-page.component';
import { BloquesPageComponent } from './pages/bloques-page/bloques-page.component';
import { PublicidadesPageComponent } from './pages/publicidades-page/publicidades-page.component';
import { PagosPageComponent } from './pages/pagos-page/pagos-page.component';
import { ContratacionesPageComponent } from './pages/contrataciones-page/contrataciones-page.component';
import { AsuncionPageComponent } from './pages/asuncion-page/asuncion-page.component';

const routes: Routes = [
  { path:'', component: InicioComponent },
  { path:'inicio', component: InicioComponent  },
  { path:'login', component: UserLoginComponent  },
  // pages
  { path: 'asuncion', component: AsuncionPageComponent },
  { path: 'comercios/categories', component: ComerciosPageComponent },
  { path: 'publicistas/categories', component: PublicistasPageComponent },
  { path: 'contrataciones/categories', component: ContratacionesPageComponent },
  { path: 'pagos/categories', component: PagosPageComponent },
  { path: 'publicidades/categories', component: PublicidadesPageComponent },
  { path: 'bloques/categories', component: BloquesPageComponent },
  { path: 'titulares/categories', component: TitularesPageComponent },
  { path: 'contactos/categories', component: ContactosPageComponent },
  // shop ruting
  { path:'listaComercios', component: AltaComercioComponent},
  { path:'altaComercio/listaComercios', component: ShopListComponent},
  { path:'altaComercio', component: NewOwnerContactShopComponent},
  { path:'altaComercio/nuevoComercio', component: NuevoComercioComponent },
  { path:'actualizacionComercio', component: ActualizacionComercioComponent },
  // contracit ruting
  { path:'altaContratacion', component: NuevoContratoComponent },
  { path:'actualizacionContratacion', component: InicioComponent },
  //blocks and history ruting
  { path:'actualizacionBLoque', component: BlockComponent },
  {path:'bolockList', component: BlockListComponent},
  //owner ruting
  { path: 'addOwner', component: OwnerComponent, data: { crud: 'create' } },
  { path: 'updateOwner', component: OwnerComponent, data: { crud: 'update' } },
  { path: 'deleteOwner', component: OwnerComponent, data: { crud: 'delete' } },
  //contact ruting
  { path: 'addContact', component: ContactComponent, data: { crud: 'create' } },
  { path: 'updateContact', component: ContactComponent, data: { crud: 'update' } },
  { path: 'deleteContact', component: ContactComponent, data: { crud: 'delete' } },


  { path:'altaPublicista', component: InicioComponent },
  { path:'liquidacionPublicistas', component: InicioComponent },
  { path:'listadoLiquidaciones', component: InicioComponent },
  { path:'registroPagoPub', component: InicioComponent },
  { path:'actualizacionPublicista', component: InicioComponent },
  { path:'registroPago', component: InicioComponent },
  { path:'informeFaltaPago', component: InicioComponent },
  { path:'emisionOrdenes', component: NuevaOrdenComponent },
  { path:'listadoPublicitario', component: InicioComponent },

  { path: '**', redirectTo: '', pathMatch: 'full'} // cuando el usuario pone una ruta inexistente redirige a http://localhost:4200

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
