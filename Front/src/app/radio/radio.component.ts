import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-radio',
  templateUrl: './radio.component.html',
  styleUrl: './radio.component.scss'
})
export class RadioComponent {
  menuOpen = false;
  selectedOption: string | null = null;
  selectedSubOption: string | null = null;
  isSmallScreen = window.innerWidth < 1024;

  options = ['Comercios', 'Publicistas', 'Contrataciones', 'Pagos', 'Publicidades', 'Bloques', 'Titulares', 'Contactos'];

  subOptions: Record<string, string[]> = {
    'Comercios': ['Alta Comercios', 'Lista Comercios', 'Edición Comercio'],
    'Publicistas': ['A', 'B', 'C'],
    'Contrataciones': ['Alta Contratación', 'Edición Contratación'],
    'Pagos': ['Registrar Pago', 'Informe Falta Pago'],
    'Publicidades': ['Emisión Órdenes', 'Listado Publicitario', 'Edición Spot'],
    'Bloques': ['Edición Bloque', 'Listado Bloques'],
    'Titulares': ['A', 'B', 'C'],
    'Contactos': ['A', 'B', 'C']
  };

  constructor(private router: Router) {}

  toggleHeader(option: string) {
    this.selectedOption = option;
    this.menuOpen = true;
    this.selectedSubOption = null;
    const route = `/${option.toLowerCase()}/categories`;
    this.router.navigate([route]);
  }

  toggleRadioFM() {
    this.menuOpen = false;
    this.selectedOption = null;
    this.selectedSubOption = null;
    this.router.navigate(['/asuncion']);
  }

  toggleFullScreenMenu() {
    this.menuOpen = !this.menuOpen;
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.isSmallScreen = event.target.innerWidth < 1024;
  }
  
}
