import { Component } from '@angular/core';

interface Card {
  title: string;
  summary: string;
  imagePath: string;
  options: string[];
  routerLinks: string[];
}

@Component({
  selector: 'app-inicio-page',
  templateUrl: './inicio-page.component.html',
  styleUrls: ['./inicio-page.component.scss'],
})
export class InicioPageComponent {
  searchTerm: string = '';

  cards: Card[] = [
    {
      title: 'Comercios',
      summary: 'Gestiona el registro, edición y consulta de comercios.',
      imagePath: 'assets/img/comercios.png',
      options: ['Alta Comercio', 'Listado Comercios', 'Edición Comercio'],
      routerLinks: ['/comercios/alta-comercio', '/comercios/listado-comercios', '/comercios/edicion-comercio']
    },
    {
      title: 'Contrataciones',
      summary: 'Administra las contrataciones de publicidad con opciones de alta y edición.',
      imagePath: 'assets/img/contrataciones.png',
      options: ['Alta Contratación', 'Edición Contratación'],
      routerLinks: ['/contrataciones/alta-contratacion', '/contrataciones/edicion-contratacion']
    },
    {
      title: 'Pagos',
      summary: 'Registra pagos y consulta informes sobre cuentas pendientes.',
      imagePath: 'assets/img/pagos.png',
      options: ['Registro Pago', 'Informe Falta Pago'],
      routerLinks: ['/pagos/registro-pago', '/pagos/informe-falta-pago']
    },
    {
      title: 'Publicidades',
      summary: 'Controla la emisión de órdenes publicitarias y la gestión de spots.',
      imagePath: 'assets/img/publicidades.png',
      options: ['Emisión Órdenes', 'Listado Publicitario', 'Edición Spot'],
      routerLinks: ['/publicidades/emision-ordenes', '/publicidades/listado-publicitario', '/publicidades/edicion-spot']
    },
    {
      title: 'Bloques',
      summary: 'Organiza y edita los bloques publicitarios según la programación.',
      imagePath: 'assets/img/bloques.png',
      options: ['Listado Bloques', 'Edición Bloque'],
      routerLinks: ['/bloques/listado-bloques', '/bloques/edicion-bloque']
    },
    {
      title: 'Titulares',
      summary: 'Administra la información de los titulares con funciones de alta, baja, consulta y modificación.',
      imagePath: 'assets/img/titulares.png',
      options: ['Alta Titular', 'Consulta Titular', 'Edición Titular', 'Baja Titular'],
      routerLinks: ['/titulares/alta-titular', '/titulares/consulta-titular', '/titulares/edicion-titular', '/titulares/baja-titular']
    },
    {
      title: 'Contactos',
      summary: 'Administra la información de los contactos con funciones de alta, baja, consulta y modificación.',
      imagePath: 'assets/img/contactos.png',
      options: ['Alta Contacto', 'Consulta Contacto', 'Edición Contacto', 'Baja Contacto'],
      routerLinks: ['/contactos/alta-contacto', '/contactos/consulta-contacto', '/contactos/edicion-contacto', '/contactos/baja-contacto']
    }
  ];

  filteredCards: Card[] = [...this.cards];

  filterCards(): void {
    const term = this.searchTerm.toLowerCase().trim();

    this.filteredCards = this.cards.filter(card =>
      card.title.toLowerCase().includes(term) ||
      card.summary.toLowerCase().includes(term) ||
      card.options.some(option => option.toLowerCase().includes(term))
    );
  }
}
