import { Component } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, NgForm, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MyDataService } from 'src/app/services/my-data.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { MatDialog } from '@angular/material/dialog';


interface Item {
  index: number;
  id: string;
  order: string;
  spotName: string;
  fantasyName: string;
}

interface GroupedItem {
  day: string;
  block: string;
  startTimeBlock: string;
  items: Item[];
}
@Component({
  selector: 'app-listado-publicitario-category',
  templateUrl: './listado-publicitario-category.component.html',
  styleUrl: './listado-publicitario-category.component.scss'
})
export class ListadoPublicitarioCategoryComponent {
  list_form: FormGroup;
      constructor(public dialog: MatDialog, private _snackBar: SnackbarService, private myDataService: MyDataService) {
        this.list_form = new FormGroup({
          dateFrom: new FormControl('', [Validators.required, this.verifyDate()]),
          dateTo: new FormControl('', Validators.required),
        });

      }
dateTo: Date | null = null;
dateFrom: Date | null = null;
groupedData: GroupedItem[] = [];

ngOnInit() {
      this.dateToControl.valueChanges.subscribe((valor) => {
        this.dateTo = valor;
        this.dateFromControl.updateValueAndValidity();

      });
    }
      verifyDate(): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
          const value = control.value;
      
    
        
            if (!this.dateTo) {
              return null;
            } else {
              if (value >= this.dateTo) {
                this.dateFrom= value
                return {dateToGreater:true};
              } else {

                return null;
              }
        
            }
        };
      }
      


      get dateFromControl(): FormControl {
        return this.list_form.get('dateFrom') as FormControl;
      }
    
      get dateToControl(): FormControl {
        return this.list_form.get('dateTo') as FormControl;
      }
  formatDateToYYYYMMDD(date: Date | string): string | undefined {
      if (!date) return undefined;
    
      const d = new Date(date);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0'); // sumamos 1 porque los meses empiezan en 0
      const day = String(d.getDate()).padStart(2, '0');
    
      return `${year}-${month}-${day}`;
    }
  // findList() {

  //   this.dateFrom = this.list_form.get('dateFrom')?.value;
  //   this.dateTo = this.list_form.get('dateTo')?.value;
  //   if (!this.dateFrom || !this.dateTo) return; // Asegúrate de que no sean null

  //   const formatdateF = this.formatDateToYYYYMMDD(this.dateFrom);
  //   const formatdateT = this.formatDateToYYYYMMDD(this.dateTo);

  //   if (!formatdateF || !formatdateT) return; // Asegúrate de que no sean undefined
  //   console.log(formatdateF);
  //   console.log(formatdateT);
  //   this.myDataService.getODBByDates(formatdateF, formatdateT).subscribe({
  //     next: (response: any) => {
  //       this._snackBar.openSnackBar(response.message, 'success-snackbar');
  //       console.log(response);
  //     },
  //     error: (error) => {
  //       let errorMessage = error.error.errors ? error.error.errors || error.error.messages : error.error.messages;
  //       this._snackBar.openSnackBar(errorMessage, 'unsuccess-snackbar');
  //     },
  //   }); 
  // }


findList() {
  this.dateFrom = this.list_form.get('dateFrom')?.value;
  this.dateTo = this.list_form.get('dateTo')?.value;
  if (!this.dateFrom || !this.dateTo) return; // Asegúrate de que no sean null

  const formatdateF = this.formatDateToYYYYMMDD(this.dateFrom);
  const formatdateT = this.formatDateToYYYYMMDD(this.dateTo);

  if (!formatdateF || !formatdateT) return; // Asegúrate de que no sean undefined

  this.myDataService.getODBByDates(formatdateF, formatdateT).subscribe({
    next: (response: any) => {
      this.groupedData = response.data.reduce((acc: GroupedItem[], current: any) => {
        const day = current.day.split('T')[0]; // Extrae solo la fecha del día
        const block = current.block;
        const startTimeBlock = current.startTimeBlock;

        if (!acc.find(item => item.day === day && item.block === block && item.startTimeBlock === startTimeBlock)) {
          acc.push({
            day: day,
            block: block,
            startTimeBlock: startTimeBlock,
            items: [
              {
                index: 0,
                id: current.id,
                order: current.order,
                spotName: current.spotName, // Agrega spotName
                fantasyName: current.fantasyName, // Agrega fantasyName
              },
            ],
          });
        } else {
          const existingItem = acc.find(item => item.day === day && item.block === block && item.startTimeBlock === startTimeBlock);
          if (existingItem) {
            existingItem.items.push({
              index: existingItem.items.length, // Asigna el índice automáticamente
              id: current.id,
              order: current.order,
              spotName: current.spotName, // Agrega spotName
              fantasyName: current.fantasyName, // Agrega fantasyName
            });
          }
        }

        return acc;
      }, []);

      // Ordena los datos por startTimeBlock
      this.groupedData.sort((a, b) => {
        if (a.startTimeBlock < b.startTimeBlock) return -1;
        if (a.startTimeBlock > b.startTimeBlock) return 1;
        return 0;
      });

      // No es necesario reordenar los índices ya que se asignan automáticamente
      console.log(this.groupedData);
    },
    error: (error) => {
      let errorMessage = error.error.errors ? error.error.errors || error.error.messages : error.error.messages;
      this._snackBar.openSnackBar(errorMessage, 'unsuccess-snackbar');
    },
  });
}

}
