import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from 'src/app/components/dialog/dialog.component';
import { BLOCK_TYPES } from 'src/app/constants/constants';
import { MyDataService } from 'src/app/services/my-data.service';

@Component({
  selector: 'app-edicion-bloque-category',
  templateUrl: './edicion-bloque-category.component.html',
  styleUrl: './edicion-bloque-category.component.scss',
})
export class EdicionBloqueCategoryComponent {
  block_form: FormGroup;
  newBlock_form: FormGroup;
  blockTypes: string[] = BLOCK_TYPES;
  errorMessageBlock: string | null = null;
  cargando: boolean = false;
  constructor(public dialog: MatDialog, private myDataService: MyDataService) {
    this.block_form = new FormGroup({
      numBlock: new FormControl('', Validators.required)
    });
    this.newBlock_form = new FormGroup({
      price: new FormControl('', Validators.required),
      effectiveDate: new FormControl('', Validators.required)
    })
  }



  get numBlockControl(): FormControl {
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
}
