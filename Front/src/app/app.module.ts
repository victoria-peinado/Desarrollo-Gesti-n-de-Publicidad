import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MaterialModule } from './material/material.module';
import { MainNavComponent } from './main-nav/main-nav.component';
import { BlockComponent } from './block/block.component';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { UserLoginComponent } from './user-login/user-login.component';
import { AltaComercioComponent } from './alta-comercio/alta-comercio.component';
import { NuevoComercioComponent } from './nuevo-comercio/nuevo-comercio.component';
import { BtnDegradeComponent } from './btn-degrade/btn-degrade.component';
import { NuevoContratoComponent } from './nuevo-contrato/nuevo-contrato.component';
import { NuevaOrdenComponent } from './nueva-orden/nueva-orden.component';
import { OrdenFechaComponent } from './orden-fecha/orden-fecha.component';
import { OrdenBLoqueComponent } from './orden-bloque/orden-bloque.component';
import { ActualizacionComercioComponent } from './actualizacion-comercio/actualizacion-comercio.component';
import { InicioComponent } from './inicio/inicio.component';
import { NewOwnerContactShopComponent } from './alta-titular-contacto-comercio/alta-titular-contacto-comercio.component';
import { ShopListComponent } from './shop-list/shop-list.component';
import { OwnerComponent } from './owner/owner.component';
import { ContactComponent } from './contact/contact.component';
import { ShopComponent } from './shop/shop.component';
import { BlockListComponent } from './block-list/block-list.component';
import { ConfirmationDialogComponent } from './confirmation-dialog/confirmation-dialog.component';
import { EditShopComponent } from './edit-shop/edit-shop.component';
import { FeedbackNotificationComponent } from './feedback-notification/feedback-notification.component';
import { InputFieldComponent } from './input-field/input-field.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';


@NgModule({ declarations: [
        AppComponent,
        MainNavComponent,
        BlockComponent,
        UserLoginComponent,
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
        InputFieldComponent
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    bootstrap: [AppComponent], imports: [BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        MaterialModule,
        FormsModule,
        ReactiveFormsModule], providers: [provideHttpClient(withInterceptorsFromDi()), provideAnimationsAsync()] })
export class AppModule { }
