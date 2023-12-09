import {
  AfterViewInit,
  Component,
  ViewChild,
  ElementRef,
  OnInit,
  ChangeDetectorRef,
  HostListener
} from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Trade } from 'src/app/models/trade';
import { MyDataService } from 'src/app/services/my-data.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedDataService } from '../services/shared-data.service';
import { ThemePalette } from '@angular/material/core';
import { MatSort, MatSortModule } from '@angular/material/sort';

@Component({
  selector: 'app-nuevo-comercio',
  templateUrl: './nuevo-comercio.component.html',
  styleUrls: ['./nuevo-comercio.component.scss'],
})
export class NuevoComercioComponent implements OnInit {
  @ViewChild('nombreFantasiaInput', { static: false }) nombreFantasiaInputRef!: ElementRef;

  @HostListener('window:resize', ['$event'])
  onResize(event: any): void {
    this.band = window.innerWidth > 640;
  }

  inputfilter: string = '';

  displayedColumns: string[] = [
    'fantasyName',
    'address',
    'billingType',
    'mail',
    'usualPaymentForm',
    'type',
  ];


  trades: Trade[] = [];
  allTrades: Trade[] = [];

  band: boolean = true;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  tradeForm: FormGroup;
  titulo = 'Crear Comercio';
  id: string | null;

  cuit: string;
  razonSocial: string;
  condicionFinal: string;
  nombreFantasia: string = '';
  coloring: ThemePalette = 'primary';
  nombreFantasiaInvalid: boolean = false;
  isButtonDisabled: boolean = true;
  message: string = '';

  mostrarNuevoComercio = false;
  continuarNuevoComercio = false;

  visibleContent: { [key: string]: boolean } = { };

  sortColumnKey: string = '';
  sortOrder: 'asc' | 'desc' = 'asc';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private _tradeService: MyDataService,
    private aRouter: ActivatedRoute,
    private sharedDataService: SharedDataService,
    private cdRef: ChangeDetectorRef,
  ) {
    this.tradeForm = this.fb.group({
      fantasyName: ['', Validators.required],
      address: ['', Validators.required],
      billingType: ['', Validators.required],
      mail: ['', [Validators.required, Validators.email]],
      usualPaymentForm: ['', Validators.required],
      type: ['', Validators.required],
    });

    this.id = this.aRouter.snapshot.paramMap.get('id');

    this.cuit = this.sharedDataService.getCuit();
    this.razonSocial = this.sharedDataService.getRazonSocial();
    this.condicionFinal = this.sharedDataService.getCondicionFinal();
  }

  ngOnInit(): void {
    this.obtenerComercios();
  }

  getMailErrorMessage() {
    if (this.tradeForm.get('mail')?.hasError('required')) {
      return '*Este campo es obligatorio.';
    }

    return this.tradeForm.get('mail')?.hasError('email') ? 'Email inválido.' : '';
  }

  filterTable() {
    const filterValue = this.normalizeString(this.inputfilter.toLowerCase().trim());
  
    if (!filterValue) {
      this.trades = [...this.allTrades];
    } else {
      this.trades = this.allTrades.filter((trade) =>
        Object.values(trade).some(
          (value) =>
            value &&
            this.normalizeString(value.toString().toLowerCase()).includes(filterValue)
        )
      );
    }
  
    if (this.trades.length === 0) {
      this.trades = [
        {
          fantasyName: 'no coincide con la búsqueda',
          address: '',
          billingType: '',
          mail: '',
          usualPaymentForm: '',
          type: '',
          billingHolderId: '',
        },
      ];
    }
  }

  normalizeString(str: string): string {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }
  
  sortColumn(columnKey: string) {

    if (this.sortColumnKey === columnKey) {
        this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';

        if (this.sortOrder === 'asc') {
          this.trades = this.allTrades.slice()
          this.sortColumnKey = '';
        }

    } else {
        this.sortOrder = 'asc';
        this.sortColumnKey = columnKey; // sortColumnKey = 'fantasyName'
    }

    this.sortTable();
}

sortTable() {
  if(this.sortColumnKey) {
      const compareFunction = (a: Trade, b: Trade, key: keyof Trade) => {
          const valueA = (a[key] || '').toString().toLowerCase();
          const valueB = (b[key] || '').toString().toLowerCase();
          return this.sortOrder === 'asc' ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
      };


      if (Object.keys(this.trades[0]).includes(this.sortColumnKey)) { // Object.keys(obj) devuelve un array de strings que representan los nombres de las propiedades del objeto en el argumento
          this.trades.sort((a, b) => compareFunction(a, b, this.sortColumnKey as keyof Trade));
      }
    }
}




  

  obtenerComercios() {
    if (this.cuit) {
      this._tradeService.getTradesByCuit(this.cuit).subscribe(
        (data) => {
          this.allTrades = data.slice();
          this.trades = data;
        },
        (error) => {
          console.log(error);
        }
      );
    } else {
      console.error('Cuit no proporcionado.');
    }
  }
  

  toggleCardContent(trade: Trade) {
    this.visibleContent[trade.fantasyName] = !this.visibleContent[trade.fantasyName];
}

isScreenSmall(): boolean {
  // Verificar si el tamaño de la pantalla es 'sm' o menor
  return window.innerWidth <= 640; // Ajusta según tus necesidades
}
  
  addTrade() {
    if (this.cuit) {
      this._tradeService.getBillingHolderByCUIT(this.cuit).subscribe(
        (billingHolderId: any) => {
          const TRADE: Trade = {
            fantasyName: this.tradeForm.get('fantasyName')?.value,
            address: this.tradeForm.get('address')?.value,
            billingType: this.tradeForm.get('billingType')?.value,
            mail: this.tradeForm.get('mail')?.value,
            usualPaymentForm: this.tradeForm.get('usualPaymentForm')?.value,
            type: this.tradeForm.get('type')?.value,
            billingHolderId: billingHolderId,
          };

          this.createTrade(TRADE);
        },
        (error) => {
          console.error(error);
        }
      );
    } else {
      console.error('El CUIT no está definido.');
    }
  }

  createTrade(TRADE: Trade) {
    this._tradeService.createTrade(TRADE).subscribe(
      (data) => {
        this.obtenerComercios();
      },
      (error) => {
         //console.log(error); caombiar por un pomnpout de error
        this.tradeForm.reset();
      }
    );
  }

  showNewTrade() {
    this.mostrarNuevoComercio = true;
  }

  continueWithNewTrade() {
    this.continuarNuevoComercio = true;
  }

  alertUser() {
    return '*Este campo es obligatorio.'
  }

  alertUserAboutError(mess: string) {
    this.nombreFantasiaInvalid = true;
    this.coloring = 'warn';
    this.message = mess;

    const cuitInputElement = this.nombreFantasiaInputRef.nativeElement;
    cuitInputElement.click();
    cuitInputElement.focus();
  }

  verifyNameFantasy() {
    this.nombreFantasia = this.nombreFantasiaInputRef.nativeElement.value;
    if (this.nombreFantasia && this.cuit) {
      
      this._tradeService.getTradesByFantasyNameAndCUIT(this.nombreFantasia, this.cuit).subscribe(
          (trades: Trade[]) => {
            if (
              trades &&
              trades.some((trade) => trade.fantasyName === this.nombreFantasia)
            ) {
              this.alertUserAboutError(
                'Nombre de fantasía <strong>repetido</strong>'
              );
            } else {
              this.addTrade();
              this.continueWithNewTrade();
              alert('Comercio añadido exitosamente');
            }
          },
          (error: any) => {
            console.error('Error en la solicitud:', error);
            this.alertUserAboutError(
              'Error al verificar el nombre de fantasía.'
            );
          }
        );
    } else {
      console.error('Nombre de fantasía o cuit no proporcionados.');
    }
  }
}
