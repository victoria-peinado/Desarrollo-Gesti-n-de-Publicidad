import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class SnackbarService {
  action: string = 'Cerrar';
  panelClass: string = 'success-snackbar'; // alt: unsuccess-snackbar
  duration: number = 5000;

  constructor(private _snackBar: MatSnackBar) {}

  openSnackBar(
    message: string,
    panelClass: string,
  ) {
    this._snackBar.open(message, this.action, {
      duration: this.duration,
      panelClass: [panelClass],
    });
  }
}
