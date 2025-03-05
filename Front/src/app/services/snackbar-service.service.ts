import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar/index.js';

@Injectable({
  providedIn: 'root'
})
export class SnackbarServiceService {

  action: string = 'Cerrar';
  panelClass: string = 'success-snackbar'; // alt: unsuccess-snackbar
  duration: number = 5000;

  constructor(private _snackBar: MatSnackBar) { }

  openSnackBar(
    message: string,
    duration?: number,
    panelClass?: string,
    action?: string
  ) {
    this._snackBar.open(message, action ? action : this.action, {
      duration: duration ? duration : this.duration,
      panelClass: [panelClass ? panelClass : this.panelClass],
    });
  }
}
