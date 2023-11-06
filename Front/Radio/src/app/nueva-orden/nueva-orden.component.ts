import { Component ,ViewChild, ElementRef } from '@angular/core';
import { MyDataService } from '../services/my-data.service';
import { OnInit } from '@angular/core';
import { take ,tap} from 'rxjs/operators';
import { Router } from '@angular/router';
import { ThemePalette } from '@angular/material/core/index.js';

@Component({
  selector: 'app-nueva-orden',
  templateUrl: './nueva-orden.component.html',
  styleUrls: ['./nueva-orden.component.scss']
})
export class NuevaOrdenComponent implements OnInit{;
  numero:any =null
  inValido: boolean= false
  coloring: ThemePalette = "primary";
  dataSource : any|null
  clickedRows : any
 picker:any
 fecha:any|null
 matDatepicker:any

  displayedColumns: string[] = ['Bloque', 'Lunes', 'Martes', 'Miercoles','Jueves','Viernes','Sabado','Domingo'];
  constructor(private myDataService: MyDataService,private router: Router) { }

  redirectToHome() {
    this.router.navigate(['/']);
  }
  ngOnInit() {
    this.getBLoques();
  }
  getBLoques() {
    this.myDataService.getBlocks().pipe(take(1)).subscribe(data => {
      let blocks :any
      blocks = data;
      blocks = blocks.data;
      this.dataSource = blocks;
    } );
    console.log(this.dataSource);
  }
  onCheckboxChange(index: number, day: string) {
  // Aquí puedes registrar las celdas tildadas en un array o realizar otras acciones.
  if (this.dataSource[index][day]) {
    // La celda está tildada, realiza la lógica necesaria.
  } else {
    // La celda está destildada, realiza la lógica necesaria.
  }
}
  // verify() {
  //   console.log(this.selectedValue);
  //   console.log(this.nuevoPrecio);
  //   if (!this.isCreateHistoyDisabled() ) {
  //     this.inValido = false;
  //     this.createHistory();
     
  //   } else {
  //     this.inValido = true;
  //   this.coloring = "warn";
  //   if(!this.selectedValue){
  //    this.inputBloque.focus(); 
      
  //   }else{
  //     const precioInputElement = this.precioInputRef.nativeElement;
  //     precioInputElement.focus();
  //   }
    
  //   }
  // }  
isCreateContracDisabled() {
  return !this.numero || isNaN(this.numero);
}  
// createContrac() {
//     // Obtén la fecha de hoy en el formato "yyyy-MM-dd"
//     const today = new Date(); // Esto ya incluirá la hora actual, minutos y segundos
//     const year = today.getFullYear();
//     const month = String(today.getMonth() + 1).padStart(2, '0');
//     const day = String(today.getDate()).padStart(2, '0');
//     const hours = String(today.getHours()).padStart(2, '0');
//     const minutes = String(today.getMinutes()).padStart(2, '0');
//     const seconds = String(today.getSeconds()).padStart(2, '0');
//     const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
//     // Obten el valor del precio desde el input (debes almacenar esto en una propiedad del componente)
//     const precio = this.nuevoPrecio;
//     console.log(precio);

//     // Obtén el id del bloque seleccionado (asumiendo que este valor se almacena en selectedValue.id)
//     const idBlock = this.selectedValue.id;

//     // Crea el objeto newHistory con los valores requeridos
//     const newHistory = {
//       startTime: formattedDate,
//       precio: precio,
//       idBlock: idBlock
//     };

//     // Ahora puedes usar newHistory como necesites, por ejemplo, enviarlo a tu servicio para crear un historial
//     this.myDataService.createHistory(newHistory).subscribe(
//       (response) => {
//         console.log('Historial creado:', response);
//         // Puedes realizar acciones adicionales después de crear un historial
//         this.getHistory();
//       },
//       (error) => {
//         console.error('Error al crear historial:', error);
//         // Maneja los errores aquí
//       }
//     );
//   }

}
