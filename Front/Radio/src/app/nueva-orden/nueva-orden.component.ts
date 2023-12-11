import { Component, ViewChild, ElementRef, ViewContainerRef } from '@angular/core';
import { MyDataService } from '../services/my-data.service';
import { OnInit } from '@angular/core';
import { take, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { ThemePalette } from '@angular/material/core/index.js';
import { OrdenFechaComponent } from '../orden-fecha/orden-fecha.component';

@Component({
  selector: 'app-nueva-orden',
  templateUrl: './nueva-orden.component.html',
  styleUrls: ['./nueva-orden.component.scss']
})
export class NuevaOrdenComponent implements OnInit {
  @ViewChild('container', { read: ViewContainerRef }) container!: ViewContainerRef;
  number: any = null;
  isInvalid: boolean = false;
  colorPalette: ThemePalette = "primary";
  data: any | null = null;
  date: any | null = null;
  same: any = true;

  displayedColumns: string[] = ['Bloque', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

  constructor(private myDataService: MyDataService, private router: Router) { }

  redirectToHome() {
    this.router.navigate(['/']);
  }

  ngOnInit() {
    this.getBlocks();
  }

  getBlocks() {
    this.myDataService.getBlocks().pipe(take(1)).subscribe({
      next: data => {
      let blocks: any;
      blocks = data;
      blocks = blocks.data;
      this.data = blocks;
    }});
  }

  onCheckboxChange(index: number, day: string) {
    // Aquí puedes registrar las celdas tildadas en un array o realizar otras acciones.
    if (this.data[index][day]) {
      // La celda está tildada, realiza la lógica necesaria.
    } else {
      // La celda está destildada, realiza la lógica necesaria.
    }
  }

  createDate() {
    this.container.createComponent(OrdenFechaComponent);
  }

  isCreateContractDisabled() {
    return !this.number || isNaN(this.number);
  }
}