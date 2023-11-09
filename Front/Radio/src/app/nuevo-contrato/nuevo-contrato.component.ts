import { Component ,ViewChild, ElementRef } from '@angular/core';
import { MyDataService } from '../services/my-data.service';
import { OnInit } from '@angular/core';
import { take ,tap} from 'rxjs/operators';
import { Router } from '@angular/router';
import { ThemePalette } from '@angular/material/core/index.js';
import { Validator } from '@angular/forms';
@Component({
  selector: 'app-nuevo-contrato',
  templateUrl: './nuevo-contrato.component.html',
  styleUrls: ['./nuevo-contrato.component.scss']
})
export class NuevoContratoComponent implements OnInit{
  @ViewChild('inputBloque') inputBloque: any;
  @ViewChild('inputPrecio', { static: false }) precioInputRef!: ElementRef;
  @ViewChild('inputCuit', { static: false }) cuitInputRef!: ElementRef;
  nombre: string | any =null
  cuit:any =null
  inValido: boolean= false
  coloring: ThemePalette = "primary";
  tutular:any =null
  comercio:any =null
  comercios:any =new Set()
  fechaIn:Date|null=null
  fechaFin:Date|null=null
  fecehaR:Date|null=null
  obs:string|null=null    

  constructor(private myDataService: MyDataService,private router: Router) { }
  ngOnInit(){
    // const today = new Date(); 
    // const year = today.getFullYear();
    // const month = String(today.getMonth() + 1).padStart(2, '0');
    // const day = String(today.getDate()).padStart(2, '0');
    // const formattedDate = `${year}-${month}-${day}`;
    this.fecehaR= new Date()

  }
  redirectToHome() {
    this.router.navigate(['/']);
  }

  getTitular(){
    if(this.cuit!=null){
  
      this.myDataService.getBillingHolderByCUIT(this.cuit).subscribe(
        (result: any) => {
          if (result) {
            this.tutular = result
            console.log(this.tutular)
          } 
          
        },
        (error: any) => {
          console.log('7')
          this.titularValido()
           console.log('6')
        }

      );
    }
    
  }
  getComers() {
  if(this.nombre!=null){
    this.myDataService.getTrades().pipe(take(1)).subscribe((response: any) => {


      if (Array.isArray(response)&& this.tutular!=null) {
        // El objeto de respuesta ya es un arreglo, no necesitas acceder a la propiedad 'data'.
        for (const tit of response) {

          if (tit.fantasyName === this.nombre && tit.billingHolderId===this.tutular._id) {
            this.comercio= tit
          }
        }
        console.log(this.comercio)
      } else {
        console.error('La respuesta no es un arreglo.');
      }
    });
  }

}
  // getComer(){
  //   //Rocorre comercios y poner en comercio el que tiene el mismo nombre que this.nnombre
  //   for (const c of this.comercios){
  //     if(c.fantasyName==this.nombre)
  //         this.comercio=c
  //       console.log(this.comercio)
  //   }
  // }
titularValido() {
// console.log('5',this.tutular)
//   if (!this.tutular ) {
//     // const cinput = this.cuitInputRef.nativeElement;
//     // cinput.focus();
    
//      this.coloring = "warn";
//     console.log('coloring')
//   }
 console.log('5')
}
fechaIValida(){
  return this.fechaIn !== null && this.fechaIn >= new Date();
}
fechaOValida(){
  return !(this.fechaFin === null || this.fechaIn !== null && this.fechaFin > this.fechaIn) 
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
  return !this.tutular || !this.comercio||!this.fechaOValida()||!this.fechaIValida();
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
