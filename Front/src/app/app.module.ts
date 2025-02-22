import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MaterialModule } from './material/material.module';
import { BlockComponent } from './pages/block/block.component';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AltaComercioComponent } from './pages/alta-comercio/alta-comercio.component';
import { NuevoComercioComponent } from './pages/nuevo-comercio/nuevo-comercio.component';
import { BtnDegradeComponent } from './components/btn-degrade/btn-degrade.component';
import { NuevoContratoComponent } from './pages/nuevo-contrato/nuevo-contrato.component';
import { NuevaOrdenComponent } from './pages/nueva-orden/nueva-orden.component';
import { OrdenFechaComponent } from './orden-fecha/orden-fecha.component';
import { OrdenBLoqueComponent } from './pages/orden-bloque/orden-bloque.component';
import { ActualizacionComercioComponent } from './pages/actualizacion-comercio/actualizacion-comercio.component';
import { InicioComponent } from './pages/inicio/inicio.component';
import { NewOwnerContactShopComponent } from './pages/alta-titular-contacto-comercio/alta-titular-contacto-comercio.component';
import { ShopListComponent } from './shop-list/shop-list.component';
import { OwnerComponent } from './pages/owner/owner.component';
import { ContactComponent } from './pages/contact/contact.component';
import { ShopComponent } from './shop/shop.component';
import { BlockListComponent } from './pages/block-list/block-list.component';
import { ConfirmationDialogComponent } from './components/confirmation-dialog/confirmation-dialog.component';
import { EditShopComponent } from './pages/edit-shop/edit-shop.component';
import { FeedbackNotificationComponent } from './components/feedback-notification/feedback-notification.component';
import { InputFieldComponent } from './components/input-field/input-field.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { RadioComponent } from './radio/radio.component';
import { ComerciosPageComponent } from './pages/comercios-page/comercios-page.component';
import { ContratacionesPageComponent } from './pages/contrataciones-page/contrataciones-page.component';
import { PagosPageComponent } from './pages/pagos-page/pagos-page.component';
import { PublicidadesPageComponent } from './pages/publicidades-page/publicidades-page.component';
import { BloquesPageComponent } from './pages/bloques-page/bloques-page.component';
import { TitularesPageComponent } from './pages/titulares-page/titulares-page.component';
import { ContactosPageComponent } from './pages/contactos-page/contactos-page.component';
import { AsuncionPageComponent } from './pages/asuncion-page/asuncion-page.component';
import { TitleAndSubtitleComponent } from './components/title-and-subtitle/title-and-subtitle.component';
import { DatosAsociadosComponent } from './components/datos-asociados/datos-asociados.component';
import { DialogComponent } from './components/dialog/dialog.component';
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
import { MainNavComponent } from './components/main-nav/main-nav.component';
import { UserLoginComponent } from './pages/user-login/user-login.component';


@NgModule({ declarations: [
        AppComponent,
        MainNavComponent,
        BlockComponent,
        AltaComercioComponent,
        NewOwnerContactShopComponent,
        NuevoComercioComponent,
        BtnDegradeComponent,
        NuevoContratoComponent,
        NuevaOrdenComponent,
        OrdenFechaComponent,
        OrdenBLoqueComponent,
        ActualizacionComercioComponent,
        InicioComponent,
        ShopListComponent,
        OwnerComponent,
        ContactComponent,
        ShopComponent,
        BlockListComponent,
        ConfirmationDialogComponent,
        EditShopComponent,
        FeedbackNotificationComponent,
        InputFieldComponent,
        RadioComponent,
        ComerciosPageComponent,
        ContratacionesPageComponent,
        PagosPageComponent,
        PublicidadesPageComponent,
        BloquesPageComponent,
        TitularesPageComponent,
        ContactosPageComponent,
        AsuncionPageComponent,
        TitleAndSubtitleComponent,
        DatosAsociadosComponent,
        DialogComponent,
        AltaComercioCategoryComponent,
        ListadoComerciosCategoryComponent,
        EdicionComercioCategoryComponent,
        AltaContratacionCategoryComponent,
        EdicionContratacionCategoryComponent,
        RegistroPagoCategoryComponent,
        InformeFaltaPagoCategoryComponent,
        EmisionOrdenesCategoryComponent,
        ListadoPublicitarioCategoryComponent,
        EdicionSpotCategoryComponent,
        AltaTitularCategoryComponent,
        ConsultaTitularCategoryComponent,
        EdicionTitularCategoryComponent,
        BajaTitularCategoryComponent,
        AltaContactoCategoryComponent,
        ConsultaContactoCategoryComponent,
        EdicionContactoCategoryComponent,
        BajaContactoCategoryComponent,
        ListadoBloquesCategoryComponent,
        EdicionBloqueCategoryComponent,
        UserLoginComponent
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    bootstrap: [AppComponent], imports: [BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        MaterialModule,
        FormsModule,
        ReactiveFormsModule], providers: [provideHttpClient(withInterceptorsFromDi()), provideAnimationsAsync()] })
export class AppModule { }
