import { Component } from '@angular/core';

@Component({
  selector: 'app-data-selection-table',
  templateUrl: './data-selection-table.component.html',
  styleUrl: './data-selection-table.component.scss'
})
export class DataSelectionTableComponent {

  contrataciones = [
    { numero: 1, fechaDesde: '2024-01-01', fechaHasta: '2024-01-15', fechaRealizacion: '2024-01-10', observaciones: 'Contrato inicial' },
    { numero: 2, fechaDesde: '2024-02-01', fechaHasta: '2024-02-10', fechaRealizacion: '2024-02-05', observaciones: '' },
    { numero: 3, fechaDesde: '2024-03-01', fechaHasta: '2024-03-10', fechaRealizacion: '2024-03-07', observaciones: 'Firma electrónica' },
    { numero: 4, fechaDesde: '2024-04-01', fechaHasta: '2024-04-12', fechaRealizacion: '2024-04-08', observaciones: 'Renovación' },
    { numero: 5, fechaDesde: '2024-05-01', fechaHasta: '2024-05-05', fechaRealizacion: '2024-05-03', observaciones: '' },
    { numero: 6, fechaDesde: '2024-06-01', fechaHasta: '2024-06-15', fechaRealizacion: '2024-06-10', observaciones: 'Urgente' },
    { numero: 7, fechaDesde: '2024-07-01', fechaHasta: '2024-07-10', fechaRealizacion: '2024-07-05', observaciones: 'Contratación final' },
    { numero: 8, fechaDesde: '2024-08-01', fechaHasta: '2024-08-10', fechaRealizacion: '2024-08-07', observaciones: '' },
    { numero: 9, fechaDesde: '2024-09-01', fechaHasta: '2024-09-15', fechaRealizacion: '2024-09-10', observaciones: '' },
    { numero: 10, fechaDesde: '2024-10-01', fechaHasta: '2024-10-15', fechaRealizacion: '2024-10-12', observaciones: 'Nuevo acuerdo' },
  ];

  selectedContratacion: number | null = null;
  currentPage: number = 1;
  totalPages: number = 3;  // Example with 3 pages
  pages: number[] = [1, 2, 3];

  goToPage(page: any): void {
    if (page === 'prev' && this.currentPage > 1) {
      this.currentPage--;
    } else if (page === 'next' && this.currentPage < this.totalPages) {
      this.currentPage++;
    } else if (typeof page === 'number') {
      this.currentPage = page;
    }
  }

}
