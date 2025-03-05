import { NgModule } from '@angular/core';
import { BlockComponent } from './pages/block/block.component';
import { RouterModule, Routes } from '@angular/router';
import { AltaComercioComponent } from './pages/alta-comercio/alta-comercio.component';
import { NuevoComercioComponent } from './pages/nuevo-comercio/nuevo-comercio.component';
import { NuevoContratoComponent } from './pages/nuevo-contrato/nuevo-contrato.component';
import { NuevaOrdenComponent } from './pages/nueva-orden/nueva-orden.component';
import { ActualizacionComercioComponent } from './pages/actualizacion-comercio/actualizacion-comercio.component';
import { NewOwnerContactShopComponent } from './pages/alta-titular-contacto-comercio/alta-titular-contacto-comercio.component';
import { OwnerComponent } from './pages/owner/owner.component';
import { ContactComponent } from './pages/contact/contact.component';
import { BlockListComponent } from './pages/block-list/block-list.component';
import { ComerciosPageComponent } from './pages/comercios-page/comercios-page.component';
import { ContactosPageComponent } from './pages/contactos-page/contactos-page.component';
import { TitularesPageComponent } from './pages/titulares-page/titulares-page.component';
import { BloquesPageComponent } from './pages/bloques-page/bloques-page.component';
import { PublicidadesPageComponent } from './pages/publicidades-page/publicidades-page.component';
import { PagosPageComponent } from './pages/pagos-page/pagos-page.component';
import { ContratacionesPageComponent } from './pages/contrataciones-page/contrataciones-page.component';
import { AsuncionPageComponent } from './pages/asuncion-page/asuncion-page.component';
import { AltaComercioCategoryComponent } from './pages/comercios-page/categories/alta-comercio-category/alta-comercio-category.component';
import { ListadoComerciosCategoryComponent } from './pages/comercios-page/categories/listado-comercios-category/listado-comercios-category.component';
import { EdicionComercioCategoryComponent } from './pages/comercios-page/categories/edicion-comercio-category/edicion-comercio-category.component';
import { AltaContratacionCategoryComponent } from './pages/contrataciones-page/categories/alta-contratacion-category/alta-contratacion-category.component';
import { EdicionContratacionCategoryComponent } from './pages/contrataciones-page/categories/edicion-contratacion-category/edicion-contratacion-category.component';
import { RegistroPagoCategoryComponent } from './pages/pagos-page/categories/registro-pago-category/registro-pago-category.component';
import { InformeFaltaPagoCategoryComponent } from './pages/pagos-page/categories/informe-falta-pago-category/informe-falta-pago-category.component';
import { EmisionOrdenesCategoryComponent } from './pages/publicidades-page/categories/emision-ordenes-category/emision-ordenes-category.component';
import { ListadoPublicitarioCategoryComponent } from './pages/publicidades-page/categories/listado-publicitario-category/listado-publicitario-category.component';
import { EdicionSpotCategoryComponent } from './pages/publicidades-page/categories/edicion-spot-category/edicion-spot-category.component';
import { AltaTitularCategoryComponent } from './pages/titulares-page/categories/alta-titular-category/alta-titular-category.component';
import { ConsultaTitularCategoryComponent } from './pages/titulares-page/categories/consulta-titular-category/consulta-titular-category.component';
import { EdicionTitularCategoryComponent } from './pages/titulares-page/categories/edicion-titular-category/edicion-titular-category.component';
import { BajaTitularCategoryComponent } from './pages/titulares-page/categories/baja-titular-category/baja-titular-category.component';
import { AltaContactoCategoryComponent } from './pages/contactos-page/categories/alta-contacto-category/alta-contacto-category.component';
import { ConsultaContactoCategoryComponent } from './pages/contactos-page/categories/consulta-contacto-category/consulta-contacto-category.component';
import { EdicionContactoCategoryComponent } from './pages/contactos-page/categories/edicion-contacto-category/edicion-contacto-category.component';
import { BajaContactoCategoryComponent } from './pages/contactos-page/categories/baja-contacto-category/baja-contacto-category.component';
import { ListadoBloquesCategoryComponent } from './pages/bloques-page/categories/listado-bloques-category/listado-bloques-category.component';
import { EdicionBloqueCategoryComponent } from './pages/bloques-page/categories/edicion-bloque-category/edicion-bloque-category.component';
import { UserLoginComponent } from './pages/user-login/user-login.component';
import { ShopListComponent } from './pages/shop-list/shop-list.component';
import { InicioPageComponent } from './pages/inicio-page/inicio-page.component';
import { HomeComponent } from './home/home.component';
import { WelcomePageComponent } from './pages/welcome-page/welcome-page.component';
import { PerfilComponent } from './pages/perfil/perfil.component';


const routes: Routes = [
  { path: '', component: WelcomePageComponent, pathMatch: 'full' }, // Solo para "/"
  { path: 'login', component: UserLoginComponent },

  // Rutas con menú
  { 
    path: '', 
    component: HomeComponent, 
    children: [
      { path: 'inicio', component: InicioPageComponent },
      { path: 'perfil', component: PerfilComponent },

      // Páginas principales
      { path: 'asuncion', component: AsuncionPageComponent },
      { path: 'comercios/categories', component: ComerciosPageComponent },
      { path: 'contrataciones/categories', component: ContratacionesPageComponent },
      { path: 'pagos/categories', component: PagosPageComponent },
      { path: 'publicidades/categories', component: PublicidadesPageComponent },
      { path: 'bloques/categories', component: BloquesPageComponent },
      { path: 'titulares/categories', component: TitularesPageComponent },
      { path: 'contactos/categories', component: ContactosPageComponent },

      // Categorías específicas
      { path: 'comercios/alta-comercio', component: AltaComercioCategoryComponent },
      { path: 'comercios/listado-comercios', component: ListadoComerciosCategoryComponent },
      { path: 'comercios/edicion-comercio', component: EdicionComercioCategoryComponent },
      { path: 'contrataciones/alta-contratacion', component: AltaContratacionCategoryComponent },
      { path: 'contrataciones/edicion-contratacion', component: EdicionContratacionCategoryComponent },
      { path: 'pagos/registro-pago', component: RegistroPagoCategoryComponent },
      { path: 'pagos/informe-falta-pago', component: InformeFaltaPagoCategoryComponent },
      { path: 'publicidades/emision-ordenes', component: EmisionOrdenesCategoryComponent },
      { path: 'publicidades/listado-publicitario', component: ListadoPublicitarioCategoryComponent },
      { path: 'publicidades/edicion-spot', component: EdicionSpotCategoryComponent },
      { path: 'bloques/listado-bloques', component: ListadoBloquesCategoryComponent },
      { path: 'bloques/edicion-bloque', component: EdicionBloqueCategoryComponent },
      { path: 'titulares/alta-titular', component: AltaTitularCategoryComponent },
      { path: 'titulares/consulta-titular', component: ConsultaTitularCategoryComponent },
      { path: 'titulares/edicion-titular', component: EdicionTitularCategoryComponent },
      { path: 'titulares/baja-titular', component: BajaTitularCategoryComponent },
      { path: 'contactos/alta-contacto', component: AltaContactoCategoryComponent },
      { path: 'contactos/consulta-contacto', component: ConsultaContactoCategoryComponent },
      { path: 'contactos/edicion-contacto', component: EdicionContactoCategoryComponent },
      { path: 'contactos/baja-contacto', component: BajaContactoCategoryComponent },

      // Comercios
      { path: 'listaComercios', component: AltaComercioComponent },
      { path: 'altaComercio', component: NewOwnerContactShopComponent },
      { path: 'altaComercio/listaComercios', component: ShopListComponent },
      { path: 'altaComercio/nuevoComercio', component: NuevoComercioComponent },
      { path: 'actualizacionComercio', component: ActualizacionComercioComponent },

      // Contrataciones
      { path: 'altaContratacion', component: NuevoContratoComponent },
      { path: 'actualizacionContratacion', component: InicioPageComponent },

      // Bloques e Historial
      { path: 'actualizacionBloque', component: BlockComponent },
      { path: 'blockList', component: BlockListComponent },

      // Propietarios
      { path: 'addOwner', component: OwnerComponent, data: { crud: 'create' } },
      { path: 'updateOwner', component: OwnerComponent, data: { crud: 'update' } },
      { path: 'deleteOwner', component: OwnerComponent, data: { crud: 'delete' } },

      // Contactos
      { path: 'addContact', component: ContactComponent, data: { crud: 'create' } },
      { path: 'updateContact', component: ContactComponent, data: { crud: 'update' } },
      { path: 'deleteContact', component: ContactComponent, data: { crud: 'delete' } },

      // Publicistas y pagos
      { path: 'altaPublicista', component: InicioPageComponent },
      { path: 'liquidacionPublicistas', component: InicioPageComponent },
      { path: 'listadoLiquidaciones', component: InicioPageComponent },
      { path: 'registroPagoPub', component: InicioPageComponent },
      { path: 'actualizacionPublicista', component: InicioPageComponent },
      { path: 'registroPago', component: InicioPageComponent },
      { path: 'informeFaltaPago', component: InicioPageComponent },
      { path: 'emisionOrdenes', component: NuevaOrdenComponent },
      { path: 'listadoPublicitario', component: InicioPageComponent }
    ]
  },

  // Redirección si la ruta no existe
  { path: '**', redirectTo: 'inicio', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
