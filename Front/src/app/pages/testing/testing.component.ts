import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-testing',
  templateUrl: './testing.component.html',
  styleUrl: './testing.component.scss',
})
export class TestingComponent {

  message: string = 'Credenciales incorrectas.'
  action: string = 'Cerrar'

  constructor(private _snackBar: MatSnackBar) {}

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 5000,
      panelClass: ['unsuccess-snackbar']
    });
  }
  
  
}
