import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {
  MatDialog,
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
  MatDialogClose,
} from '@angular/material/dialog';
import { DialogComponent } from 'src/app/components/dialog/dialog.component';

@Component({
  selector: 'app-publicidades-edicion-spot-page',
  templateUrl: './publicidades-edicion-spot-page.component.html',
  styleUrls: ['./publicidades-edicion-spot-page.component.scss']
})
export class PublicidadesEdicionSpotPageComponent {
  nroOrden_form: FormGroup;
  audioFile: File | null = null;
  audioURL: string | null = null;
  duracionSpot: string = 'Calculando...';
  spot_form: FormGroup;
  animal: string = '';
  name: string = '';

  constructor(public dialog: MatDialog) {
    this.nroOrden_form = new FormGroup({
      nroOrden: new FormControl('', Validators.required)
    });
    this.spot_form = new FormGroup({
      spot: new FormControl('', Validators.required)
    });
  }

  get send() {
    return !this.nroOrden_form.invalid;
  }

  next() {
    console.log('Formulario enviado:', this.nroOrden_form.value);
  }

  finalizar() {
    console.log('Mensaje confirmación');
  }

  get nroOrdenControl(): FormControl {
    return this.nroOrden_form.get('nroOrden') as FormControl;
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.audioFile = input.files[0];
      this.audioURL = URL.createObjectURL(this.audioFile);
      this.spot_form.get('spot')?.setValue(this.audioFile.name);
      this.spot_form.updateValueAndValidity()
      this.calcularDuracion(this.audioURL);
    }
  }

  calcularDuracion(audioSrc: string) {
    const audio = new Audio(audioSrc);
    audio.addEventListener('loadedmetadata', () => {
      const minutos = Math.floor(audio.duration / 60);
      const segundos = Math.floor(audio.duration % 60);
      this.duracionSpot = `${minutos}:${segundos.toString().padStart(2, '0')} seg`;
    });
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogComponent, {
      data: {name: this.name, animal: this.animal},
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.animal = result;
    });
  }
}
