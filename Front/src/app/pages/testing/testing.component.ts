import { Component } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MyDataService } from 'src/app/services/my-data.service';

@Component({
  selector: 'app-testing',
  templateUrl: './testing.component.html',
  styleUrl: './testing.component.scss',
})
export class TestingComponent {

  cuit_form: FormGroup;
  cuit: string = '';
  correctCuit: string[] = ['1234567890'];

  constructor(
    public dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private myDataService: MyDataService
  ) {
    this.cuit_form = new FormGroup({
      cuit: new FormControl('', [
        Validators.required,
        this.verifyCuit()
      ]),
    });
  }

  verifyCuit(): ValidatorFn {
    return (control: AbstractControl) : ValidationErrors | null => {
      const value = control.value;

      if (!this.correctCuit.includes(value)) {
        return {verifyCuit:true};
      } else {
        return null;
      }


    }

  }

  get cuitControl(): FormControl {
    return this.cuit_form.get('cuit') as FormControl;
  }

}