import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-radio',
  templateUrl: './radio.component.html',
  styleUrl: './radio.component.scss',
})
export class RadioComponent {
  menuOpen: boolean;
  selectedOption: string | null;
  selectedSubOption: string | null;
  isSmallScreen: boolean;
  options: string[];
  subOptions: Record<string, string[]>;

  constructor(private router: Router) {
    this.menuOpen = true;
    this.selectedOption = null;
    this.selectedSubOption = null;
    this.isSmallScreen = window.innerWidth < 1024;

    this.options = [
      'Comercios',
      'Contrataciones',
      'Pagos',
      'Publicidades',
      'Bloques',
      'Titulares',
      'Contactos',
    ];

    this.subOptions = {
      Comercios: ['Alta Comercio', 'Listado Comercios', 'Edición Comercio'],
      Contrataciones: ['Alta Contratación', 'Edición Contratación'],
      Pagos: ['Registro Pago', 'Informe Falta Pago'],
      Publicidades: ['Emisión Órdenes', 'Listado Publicitario', 'Edición Spot'],
      Bloques: ['Listado Bloques', 'Edición Bloque'],
      Titulares: ['Alta Titular', 'Consulta Titular', 'Edición Titular', 'Baja Titular'],
      Contactos: ['Alta Contacto', 'Consulta Contacto', 'Edición Contacto', 'Baja Contacto'],
    };
  }

  normalizeText(text: string): string {
    return text
      .toLowerCase()
      .normalize('NFD') // Descompone los caracteres en su base + tilde
      .replace(/[\u0300-\u036f]/g, '') // Elimina las tildes
      .replace(/\s+/g, '-'); // Reemplaza espacios por guiones
  }

  toggleHeader(option: string): void {
    this.selectedOption = option;
    this.menuOpen = true;
    this.selectedSubOption = null;

    const route: string = `/${this.normalizeText(option)}/categories`;
    this.router.navigate([route]);
  }

  toggleMenu(subOption: string): void {
    if (!this.selectedOption) return;

    this.selectedSubOption = subOption;
    const route: string = `/${this.normalizeText(this.selectedOption)}/${this.normalizeText(subOption)}`;
    console.log(route);
    this.router.navigate([route]);
  }

  toggleRadioFM(): void {
    this.menuOpen = false;
    this.selectedOption = null;
    this.selectedSubOption = null;
    this.router.navigate(['/asuncion']);
  }

  toggleFullScreenMenu(): void {
    this.menuOpen = !this.menuOpen;
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: UIEvent): void {
    const target = event.target as Window;
    this.isSmallScreen = target.innerWidth < 1024;
  }
}
