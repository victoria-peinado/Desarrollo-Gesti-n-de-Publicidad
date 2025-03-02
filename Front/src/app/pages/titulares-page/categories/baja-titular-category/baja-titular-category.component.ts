import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DialogComponent } from 'src/app/components/dialog/dialog.component';
import { MyDataService } from 'src/app/services/my-data.service';

@Component({
  selector: 'app-baja-titular-category',
  templateUrl: './baja-titular-category.component.html',
  styleUrl: './baja-titular-category.component.scss'
})
export class BajaTitularCategoryComponent {

  cuit_form: FormGroup;
      errorMessage: string | null = null;
      cuit: string = '';
      ownerFounded: boolean = false;
      bussinessName: string = '';
      fiscalCondition: string = '';
      cargando: boolean = false;
      ownerId: string = '';
  
      constructor(public dialog: MatDialog,
          private _snackBar: MatSnackBar, private myDataService: MyDataService) {
        this.cuit_form = new FormGroup({
          cuit: new FormControl('', [
            Validators.required,
            Validators.maxLength(11),
            Validators.minLength(11),
            Validators.pattern(/^[0-9]+$/),
          ])
        });
  
      }
    
      findOwner() {
        this.cuit = this.cuitControl.value.trim();
    
        if(!this.cuit) return;
        this.cargando = true;
        this.myDataService.getOwnerByCuit(this.cuit).subscribe({
          next: (response) => {
            this.ownerFounded = true;
            this.ownerId = response.data.id;
            this.cuit = response.data.cuit;
            this.bussinessName = response.data.businessName;
            this.fiscalCondition = response.data.fiscalCondition;
            this.errorMessage = null;
          },
          error: (error) => {
            console.log(error);
            this.ownerFounded = false;
            this.cargando = false;
            this.errorMessage = 'Titular inexistente.';
          },
        });

      }
    
      get cuitControl(): FormControl {
        return this.cuit_form.get('cuit') as FormControl;
      }

      deleteOwner() {
        this.myDataService.deleteOwner(this.ownerId).subscribe({
          next: () => {
            this.openSnackBar('Titular dado de baja', 'Cerrar');
          },
          error: (error) => {
            console.log(error);
            this.openSnackBar('Error al dar de baja el titular', 'Cerrar');
          },
        });
      }


      openDialog(): void {
          const dialogRef = this.dialog.open(DialogComponent, {
            data: {
              text: `<p>¿Seguro que desea eliminar el Titular de CUIT <strong>${this.cuit}</strong>?</p>`,
            },
          });
      
          dialogRef.afterClosed().subscribe((result) => {
            if (result) {
              this.deleteOwner();
            }
          });
        }
      
        openSnackBar(message: string, action: string) {
          this._snackBar.open(message, action, {
            duration: 5000,
          });
        }
}
