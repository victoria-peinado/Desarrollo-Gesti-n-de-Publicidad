import { Component, Input } from '@angular/core';

interface ColumnConfig {
  key: string;
  label: string;
  type?: 'text' | 'email' | 'badge';
}

@Component({
  selector: 'app-data-table',
  templateUrl: './data-table.component.html',
  styleUrl: './data-table.component.scss'
})
export class DataTableComponent {
  @Input() title: string = '';
  @Input() data: any[] = [];
  @Input() columns: ColumnConfig[] = [];
  @Input() noDataMessage: string = 'No hay datos disponibles.';

  filterText: string = '';
  sortedColumn: string = '';
  sortOrder: 'asc' | 'desc' = 'asc';
  filteredData: any[] = [];

  ngOnInit(): void {
    this.filteredData = [...this.data];
  }

  filterTable(): void {
    this.filteredData = this.data.filter(row =>
      this.columns.some(col => 
        row[col.key]?.toString().toLowerCase().includes(this.filterText.toLowerCase())
      )
    );
  }

  sortColumn(column: string): void {
    if (this.sortedColumn === column) {
      this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortedColumn = column;
      this.sortOrder = 'asc';
    }
    this.filteredData.sort((a, b) => 
      this.sortOrder === 'asc' 
        ? (a[column] > b[column] ? 1 : -1) 
        : (a[column] < b[column] ? 1 : -1)
    );
  }

  getBadgeClass(type: string): string {
    return {
      'Empresa': 'bg-violet-400 text-violet-800',
      'PyME': 'bg-green-400 text-green-800',
      'Otro': 'bg-gray-400 text-black'
    }[type] || '';
  }

  deleteRow(row: any): void {
    console.log('Eliminar:', row);
  }
}
