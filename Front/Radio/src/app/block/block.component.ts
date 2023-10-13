import { Component } from '@angular/core';
import { MyDataService } from '../services/my-data.service';
import { OnInit } from '@angular/core';
import { take ,tap} from 'rxjs/operators';
import { Router } from '@angular/router';
@Component({
  selector: 'app-block',
  templateUrl: './block.component.html',
  styleUrls: ['./block.component.scss']
})
export class BlockComponent implements OnInit{
  blocks: any
  blocks$: any
  selectedValue: any
  last: any
  nuevoPrecio: any
  isBlocksEmpty: boolean = true; // Inicialmente, asumimos que blocks está vacío
  constructor(private myDataService: MyDataService,private router: Router) { }
  toadd=[{
  "startTime": "12:30:00",
   "number": 30
  
}]

  redirectToHome() {
    this.router.navigate(['/']);
  }

  ngOnInit() {
    this.getBlocks();

  }
  getBlocks() {
    this.myDataService.getBlocks().pipe(take(1)).subscribe(data => {
      this.blocks = data;
      this.blocks = this.blocks.data;
       this.isBlocksEmpty = !this.blocks || this.blocks.length === 0;
      console.log(this.blocks);
    } );
    
  }
   getHistory() {  
  this.myDataService.getHistory().pipe(take(1)).subscribe((response: any) => {
    // Verifica si la propiedad 'data' es un arreglo
    if (Array.isArray(response.data)) {
      // El resto del código para procesar la respuesta
      let lastHistory = null;

      // Obtén la fecha de hoy
      const today = new Date();

      for (const history of response.data) {
        // Convierte la fecha del historial a un objeto de fecha
        const historyDate = new Date(history.startTime);

        if (historyDate < today && history.idBlock === this.selectedValue.id) {
          // Si la fecha del historial es anterior a hoy y el idBlock coincide con selectedValue.id
          // verifica si es la más reciente
          if (!lastHistory || historyDate > new Date(lastHistory.startTime)) {
            lastHistory = history;
          }
        }
      }

      // Ahora, lastHistory contiene el último historial válido

      this.last = lastHistory;
    } else {
      console.error('La propiedad "data" no es un arreglo en la respuesta.');
    }
  });
}
 createBlocks() {
    this.toadd.forEach((block) => {
      // Realiza la solicitud POST para cada bloque
      this.myDataService.createBlock(block).subscribe(
        (response) => {
          console.log('Bloque creado:', response);
          // Puedes realizar acciones adicionales después de crear un bloque
          this.getBlocks();
        },
        (error) => {
          console.error('Error al crear bloque:', error);
          // Maneja los errores aquí
        }
      );
    });
  }
  
createHistory() {
    // Obtén la fecha de hoy en el formato "yyyy-MM-dd"
    const today = new Date(); // Esto ya incluirá la hora actual, minutos y segundos
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const hours = String(today.getHours()).padStart(2, '0');
    const minutes = String(today.getMinutes()).padStart(2, '0');
    const seconds = String(today.getSeconds()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    // Obten el valor del precio desde el input (debes almacenar esto en una propiedad del componente)
    const precio = this.nuevoPrecio;
    console.log(precio);

    // Obtén el id del bloque seleccionado (asumiendo que este valor se almacena en selectedValue.id)
    const idBlock = this.selectedValue.id;

    // Crea el objeto newHistory con los valores requeridos
    const newHistory = {
      startTime: formattedDate,
      precio: precio,
      idBlock: idBlock
    };

    // Ahora puedes usar newHistory como necesites, por ejemplo, enviarlo a tu servicio para crear un historial
    this.myDataService.createHistory(newHistory).subscribe(
      (response) => {
        console.log('Historial creado:', response);
        // Puedes realizar acciones adicionales después de crear un historial
        this.getHistory();
      },
      (error) => {
        console.error('Error al crear historial:', error);
        // Maneja los errores aquí
      }
    );
  }
}

