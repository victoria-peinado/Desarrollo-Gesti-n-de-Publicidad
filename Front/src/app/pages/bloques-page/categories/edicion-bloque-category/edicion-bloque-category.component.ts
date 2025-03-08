import { Component, OnInit  } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from 'src/app/components/dialog/dialog.component';
import { BLOCK_TYPES } from 'src/app/constants/constants';
import { MyDataService } from 'src/app/services/my-data.service';
import { take, tap } from 'rxjs/operators';
import { ApiResponse } from '../../../../models/api_response.js';
import { Block } from '../../../../models/block';
import { Price } from '../../../../models/price';
import { MatSnackBar } from '@angular/material/snack-bar';
import { th } from 'date-fns/locale';

@Component({
  selector: 'app-edicion-bloque-category',
  templateUrl: './edicion-bloque-category.component.html',
  styleUrl: './edicion-bloque-category.component.scss',
})
export class EdicionBloqueCategoryComponent implements OnInit {
  block_form: FormGroup;
  newBlock_form: FormGroup;
  blockTypes: string[] = BLOCK_TYPES; //sacar 
  blocks: Block[] = [];// array of blocks
  selectedValue: Block | null = null;
  errorMessageBlock: string | null = null;
  cargando: boolean = false;
  last: Price | any = null;
  
  constructor(public dialog: MatDialog, private myDataService: MyDataService, private _snackBar: MatSnackBar) {
    this.block_form = new FormGroup({
      numBlock: new FormControl('', Validators.required),
    });
    this.newBlock_form = new FormGroup({
      price: new FormControl('', [
        Validators.required,
        Validators.maxLength(11),
        Validators.minLength(1),
        Validators.min(1),
        Validators.pattern(/^[0-9]+$/),
      ]),
      effectiveDate: new FormControl('', [
        Validators.required,
        Validators.maxLength(10),
        Validators.minLength(8),
        
      ])
    })
  }
  
  ngOnInit() {
    this.getBlocks(); // get the blocks when the component is loaded

  }

  //get the blocks of the database
  getBlocks() {
    this.myDataService
      .getBlocks()
      .pipe(take(1))
      .subscribe({
        next: (data: ApiResponse<Block[]>) => {
          console.log(data.data);
          this.blocks = data.data.sort((a, b) => {
            const numBlockA = parseInt(a.numBlock);
            const numBlockB = parseInt(b.numBlock);
            return numBlockA - numBlockB;
          });
        },
        error: (error: any) => {
          console.error('Error fetching blocks:', error);
        },
      } as any);
  }


  get numBlockControl(): FormControl {
    console.log(this.block_form.get('numBlock'));
    return this.block_form.get('numBlock') as FormControl;
  }

  get priceControl(): FormControl {
    return this.newBlock_form.get('price') as FormControl;
  }

  get effectiveDateControl(): FormControl {
    return this.newBlock_form.get('effectiveDate') as FormControl;
  }


  siguiente() {


    this.cargando = true;

  }
  //gets the last hitory, set the selected block and focus on the next input
  selectedBlock() {
    this.selectedValue = this.block_form.get('numBlock')?.value;
    this.getHistory();

  }
getHistory() {
  this.myDataService.getLastHistoryByBlock(this.selectedValue!).subscribe({
    next: (response: ApiResponse<any>) => {
      if (response.data) {
        let last = response.data;

        // Formatear la fecha
        if (last.regDate) {
          last.formattedDate = new Date(last.regDate).toLocaleDateString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
          });
        }

        this.last = last;
        console.log(this.last);
      } else {
        console.error('No se encontró historia para el bloque seleccionado.');
      }
    },
    error: (error: any) => {
      console.error('Error fetching history:', error);
    },
  });
}
  openDialog(): void {
      const dialogRef = this.dialog.open(DialogComponent, {
        data: {
          text: `<p>¿Seguro que desea actualizar el Bloque #45?</p>`,
        },
      });
  
      dialogRef.afterClosed().subscribe((result) => {
        console.log('The dialog was closed');
      });
    }
  submit() {
    console.log('submit');
    this.createHistory();
  }

createHistory() {
  const today = new Date();
  const regDate = this.newBlock_form.get('effectiveDate')?.value;

  // Convertir el valor a un objeto Date
  const dateObject = new Date(regDate);

  // Verificar si la fecha es válida
  if (isNaN(dateObject.getTime())) {
    console.error('Fecha inválida:', regDate);
    return;
  }

  // Establecer la hora actual en el objeto dateObject
  dateObject.setHours(today.getHours());
  dateObject.setMinutes(today.getMinutes());
  dateObject.setSeconds(today.getSeconds());

  const price = parseFloat(this.newBlock_form.get('price')?.value || '0');
  const block = this.selectedValue!.id;

  const newHistory = {
    regDate: dateObject, // Ahora incluye la hora actual
    value: price,
    block: block,
  };

  console.log(newHistory);

  this.myDataService.createHistory(newHistory).subscribe({
    next: (response) => {
      this.getHistory();
      this.openSnackBar('Registro exitoso', 'Cerrar', 5000, 'success-snackbar');
    },
    error: (error) => {
      console.error('Error creating history:', error);
      this.openSnackBar(error.error.messages[0], 'Cerrar', 5000, 'unsuccess-snackbar');
    },
  });
}
    openSnackBar(
      message: string,
      action: string,
      duration: number,
      panelClass: string
    ) {
      this._snackBar.open(message, action, {
        duration: duration,
        panelClass: [panelClass],
      });
    }
  
}
