import { NgModule } from '@angular/core';
import { BlockComponent } from './pages/block/block.component';
import { Route, RouterModule, Routes, UrlSegment } from '@angular/router';
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
import  {isLoggedInGuard} from './guards/is-logged-in.guard';
import  {hasRoleGuardGuard,canActivateWithRoles} from './guards/has-role-guard.guard';
const routes: Routes = [
  { path: '', component: WelcomePageComponent, pathMatch: 'full' }, // Solo para "/"
  { path: 'login', component: UserLoginComponent },

  // Rutas con menú
  { 
    path: '',
     canMatch: [
      isLoggedInGuard
    ], 
    component: HomeComponent, 
    children: [
    { path: 'inicio', component: InicioPageComponent },
{ path: 'perfil', component: PerfilComponent, canActivate: [hasRoleGuardGuard], data: { roles: ['admin'] } },

// Páginas principales
{ path: 'asuncion', component: AsuncionPageComponent, canActivate: [hasRoleGuardGuard], data: { roles: ['admin'] } },
{ path: 'comercios/categories', component: ComerciosPageComponent, canActivate: [hasRoleGuardGuard], data: { roles: ['admin'] } },
{ path: 'contrataciones/categories', component: ContratacionesPageComponent, canActivate: [hasRoleGuardGuard], data: { roles: ['admin'] } },
{ path: 'pagos/categories', component: PagosPageComponent, canActivate: [hasRoleGuardGuard], data: { roles: ['admin'] } },
{ path: 'publicidades/categories', component: PublicidadesPageComponent, canActivate: [hasRoleGuardGuard], data: { roles: ['admin'] } },
{ path: 'bloques/categories', component: BloquesPageComponent, canActivate: [hasRoleGuardGuard], data: { roles: ['admin'] } },
{ path: 'titulares/categories', component: TitularesPageComponent, canActivate: [hasRoleGuardGuard], data: { roles: ['admin'] } },
{ path: 'contactos/categories', component: ContactosPageComponent, canActivate: [hasRoleGuardGuard], data: { roles: ['admin'] } },

// Categorías específicas
{ path: 'comercios/alta-comercio', component: AltaComercioCategoryComponent, canActivate: [hasRoleGuardGuard], data: { roles: ['admin'] } },
{ path: 'comercios/listado-comercios', component: ListadoComerciosCategoryComponent, canActivate: [hasRoleGuardGuard], data: { roles: ['admin'] } },
{ path: 'comercios/edicion-comercio', component: EdicionComercioCategoryComponent, canActivate: [hasRoleGuardGuard], data: { roles: ['admin'] } },
{ path: 'contrataciones/alta-contratacion', component: AltaContratacionCategoryComponent, canActivate: [hasRoleGuardGuard], data: { roles: ['admin'] } },
{ path: 'contrataciones/edicion-contratacion', component: EdicionContratacionCategoryComponent, canActivate: [hasRoleGuardGuard], data: { roles: ['admin'] } },
{ path: 'pagos/registro-pago', component: RegistroPagoCategoryComponent, canActivate: [hasRoleGuardGuard], data: { roles: ['admin'] } },
{ path: 'pagos/informe-falta-pago', component: InformeFaltaPagoCategoryComponent, canActivate: [hasRoleGuardGuard], data: { roles: ['admin'] } },
{ path: 'publicidades/emision-ordenes', component: EmisionOrdenesCategoryComponent, canActivate: [hasRoleGuardGuard], data: { roles: ['admin'] } },
{ path: 'publicidades/listado-publicitario', component: ListadoPublicitarioCategoryComponent, canActivate: [hasRoleGuardGuard], data: { roles: ['admin', 'user'] } },
{ path: 'publicidades/edicion-spot', component: EdicionSpotCategoryComponent, canActivate: [hasRoleGuardGuard], data: { roles: ['admin'] } },
{ path: 'bloques/listado-bloques', component: ListadoBloquesCategoryComponent, canActivate: [hasRoleGuardGuard], data: { roles: ['admin'] } },
{ path: 'bloques/edicion-bloque', component: EdicionBloqueCategoryComponent, canActivate: [hasRoleGuardGuard], data: { roles: ['admin'] } },
{ path: 'titulares/alta-titular', component: AltaTitularCategoryComponent, canActivate: [hasRoleGuardGuard], data: { roles: ['admin'] } },
{ path: 'titulares/consulta-titular', component: ConsultaTitularCategoryComponent, canActivate: [hasRoleGuardGuard], data: { roles: ['admin'] } },
{ path: 'titulares/edicion-titular', component: EdicionTitularCategoryComponent, canActivate: [hasRoleGuardGuard], data: { roles: ['admin'] } },
{ path: 'titulares/baja-titular', component: BajaTitularCategoryComponent, canActivate: [hasRoleGuardGuard], data: { roles: ['admin'] } },
{ path: 'contactos/alta-contacto', component: AltaContactoCategoryComponent, canActivate: [hasRoleGuardGuard], data: { roles: ['admin'] } },
{ path: 'contactos/consulta-contacto', component: ConsultaContactoCategoryComponent, canActivate: [hasRoleGuardGuard], data: { roles: ['admin'] } },
{ path: 'contactos/edicion-contacto', component: EdicionContactoCategoryComponent, canActivate: [hasRoleGuardGuard], data: { roles: ['admin'] } },
{ path: 'contactos/baja-contacto', component: BajaContactoCategoryComponent, canActivate: [hasRoleGuardGuard], data: { roles: ['admin'] } },

// Comercios
{ path: 'listaComercios', component: AltaComercioComponent, canActivate: [hasRoleGuardGuard], data: { roles: ['admin'] } },
{ path: 'altaComercio', component: NewOwnerContactShopComponent, canActivate: [hasRoleGuardGuard], data: { roles: ['admin'] } },
{ path: 'altaComercio/listaComercios', component: ShopListComponent, canActivate: [hasRoleGuardGuard], data: { roles: ['admin'] } },
{ path: 'altaComercio/nuevoComercio', component: NuevoComercioComponent, canActivate: [hasRoleGuardGuard], data: { roles: ['admin'] } },
{ path: 'actualizacionComercio', component: ActualizacionComercioComponent, canActivate: [hasRoleGuardGuard], data: { roles: ['admin'] } },

// Contrataciones
{ path: 'altaContratacion', component: NuevoContratoComponent, canActivate: [hasRoleGuardGuard], data: { roles: ['admin'] } },
{ path: 'actualizacionContratacion', component: InicioPageComponent, canActivate: [hasRoleGuardGuard], data: { roles: ['admin'] } },

// Bloques e Historial
{ path: 'actualizacionBloque', component: BlockComponent, canActivate: [hasRoleGuardGuard], data: { roles: ['admin'] } },
{ path: 'blockList', component: BlockListComponent, canActivate: [hasRoleGuardGuard], data: { roles: ['admin'] } },

// Propietarios
{ path: 'addOwner', component: OwnerComponent, canActivate: [hasRoleGuardGuard], data: { roles: ['admin'], crud: 'create' } },
{ path: 'updateOwner', component: OwnerComponent, canActivate: [hasRoleGuardGuard], data: { roles: ['admin'], crud: 'update' } },
{ path: 'deleteOwner', component: OwnerComponent, canActivate: [hasRoleGuardGuard], data: { roles: ['admin'], crud: 'delete' } },

// Contactos
{ path: 'addContact', component: ContactComponent, canActivate: [hasRoleGuardGuard], data: { roles: ['admin'], crud: 'create' } },
{ path: 'updateContact', component: ContactComponent, canActivate: [hasRoleGuardGuard], data: { roles: ['admin'], crud: 'update' } },
{ path: 'deleteContact', component: ContactComponent, canActivate: [hasRoleGuardGuard], data: { roles: ['admin'], crud: 'delete' } }
  ]
   
  },

  // Redirección si la ruta no existe
  { path: '**', redirectTo: '/', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
