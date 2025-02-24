import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from 'src/app/components/dialog/dialog.component';
import { MyDataService } from 'src/app/services/my-data.service';

@Component({
  selector: 'app-edicion-spot-category',
  templateUrl: './edicion-spot-category.component.html',
  styleUrl: './edicion-spot-category.component.scss'
})
export class EdicionSpotCategoryComponent {
nroOrden_form: FormGroup;
  audioFile: File | null = null;
  audioURL: string | null = null;
  duracionSpot: string = 'Calculando...';
  spot_form: FormGroup;
  animal: string = '';
  name: string = '';

  cargando: boolean = false;

  orderFounded: boolean = false;

  orderId: string = '';
  contractId: string = '';
  fantasyName: string = '';
  businessName: string = '';

  errorMessage: string | null = null;

  constructor(public dialog: MatDialog, private myDataService: MyDataService) {
    this.nroOrden_form = new FormGroup({
      nroOrden: new FormControl('', [Validators.required]),
    });
    this.spot_form = new FormGroup({
      spot: new FormControl('', Validators.required),
    });
  }

  get send() {
    return !this.nroOrden_form.invalid;
  }

  get nroOrdenControl(): FormControl {
    return this.nroOrden_form.get('nroOrden') as FormControl;
  }

  // publicidades-edición-spot-page.component.ts
  siguiente() {
    this.orderId = this.nroOrdenControl.value.trim();

    if (!this.orderId) return;

    this.cargando = true;
    this.myDataService.getOrderById(this.orderId).subscribe({
      next: (response: any) => {
        if (response && response.data) {
          this.orderFounded = true;
          this.errorMessage = null;
          const contractId = response.data.contract;

          this.myDataService.getContractById(contractId).subscribe({
            next: (contractResponse: any) => {
              if (contractResponse && contractResponse.data) {
                const shop = contractResponse.data.shop;
                const ownerId = shop.owner;

                this.myDataService.getOwnerById(ownerId).subscribe({
                  next: (ownerResponse: any) => {
                    if (ownerResponse && ownerResponse.data) {
                      this.contractId = contractId;
                      this.fantasyName = shop.fantasyName;
                      this.businessName = ownerResponse.data.businessName;
                    }
                    this.cargando = false;
                  },
                  error: () => {
                    this.errorMessage =
                      'Error al obtener datos del dueño del comercio.';
                    this.cargando = false;
                  },
                });
              }
            },
            error: () => {
              this.errorMessage = 'Error al obtener datos del contrato.';
              this.cargando = false;
            },
          });
        } else {
          this.orderFounded = false;
          this.errorMessage = 'Orden no encontrada.';
          this.cargando = false;
        }
      },
      error: () => {
        this.orderFounded = false;
        this.errorMessage = 'Orden no encontrada.';
        this.cargando = false;
      },
    });
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.audioFile = input.files[0];
      this.audioURL = URL.createObjectURL(this.audioFile);
      this.spot_form.get('spot')?.setValue(this.audioFile.name);
      this.spot_form.updateValueAndValidity();
      this.calcularDuracion(this.audioURL);
    }
  }

  calcularDuracion(audioSrc: string) {
    const audio = new Audio(audioSrc);
    audio.addEventListener('loadedmetadata', () => {
      const minutos = Math.floor(audio.duration / 60);
      const segundos = Math.floor(audio.duration % 60);
      this.duracionSpot = `${minutos}:${segundos
        .toString()
        .padStart(2, '0')} seg`;
    });
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogComponent, {
      data: {
        text: `<p>¿Seguro que desea actualizar el Spot de la Orden <strong>${this.orderId}</strong>?</p>`,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed');
    });
  }
}
