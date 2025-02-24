import { AfterViewInit, Component, ViewChild, ElementRef, OnInit, ChangeDetectorRef, HostListener } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Shop } from 'src/app/models/shop';
import { MyDataService } from 'src/app/services/my-data.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedDataService } from '../../services/shared-data.service';
import { ThemePalette } from '@angular/material/core';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../../components/confirmation-dialog/confirmation-dialog.component';

type allowedColumns = 'fantasyName' | 'address' | 'billingType' | 'mail' | 'usualPaymentForm' | 'type';
@Component({
  selector: 'app-nuevo-comercio',
  templateUrl: './nuevo-comercio.component.html',
  styleUrls: ['./nuevo-comercio.component.scss'],
  animations: [
    trigger('rotateArrow', [
      state('down', style({transform: 'rotate(0deg)'})),
      state('up', style({transform: 'rotate(180deg)'})),
      transition('down <=> up', animate('0.2s ease-in-out')),
    ]),
  ],
})

export class NuevoComercioComponent implements OnInit {
  @ViewChild('fantasyNameInput', { static: false })
  fantasyNameInputRef!: ElementRef;

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

  shops: Shop[] = [];
  allShops: Shop[] = [];

  band: boolean = true;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  shopForm: FormGroup;
  titulo = 'Crear Comercio';
  id: string | null;

  cuit: string;
  businessName: string;
  fiscalCondition: string;
  fantasyName: string = '';
  coloring: ThemePalette = 'primary';
  fantasyNameInvalid: boolean = false;
  isButtonDisabled: boolean = true;
  message: string = '';
  messageAboutShops: string = "No hay comercios para mostrar.";

  showingNewShop = false;
  continueNewShop = false;

  visibleContent: { [key: string]: boolean } = {};

  sortColumnKey: string = '';
  sortOrder: 'asc' | 'desc' = 'asc';

  rotationAngle: number = 0;
  rotationAngles: { [key: string]: number } = {};

  rotateIcon() {
    this.rotationAngle += 180;
  }

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private _shopService: MyDataService,
    private aRouter: ActivatedRoute,
    private sharedDataService: SharedDataService,
    private cdRef: ChangeDetectorRef,
    public dialog: MatDialog
  ) {
    this.shopForm = this.fb.group({
      fantasyName: ['', Validators.required],
      address: ['', Validators.required],
      billingType: ['', Validators.required],
      mail: ['', [Validators.required, Validators.email]],
      usualPaymentForm: ['', Validators.required],
      type: ['', Validators.required],
    });

    this.id = this.aRouter.snapshot.paramMap.get('id');

    this.cuit = this.sharedDataService.getCuit();
    this.businessName = this.sharedDataService.getbusinessName();
    this.fiscalCondition = this.sharedDataService.getfiscalCondition();
  }

  ngOnInit(): void {
    this.obtenerComercios();
  }

  // lógica transición flecha y ordenamiento
  click: number = 0;
  salb: boolean = false;
  entb: boolean = false;
  enter: boolean = true;
  column!: allowedColumns;


  

  marcarNegrita(key: allowedColumns) {

    if(!(this.column === key)) {
      this.click = 0;
    }

    this.click = this.click + 1;

    if(this.click == 3) {
      this.enter = false;
      this.click = 0;
    };

    this.column = key;
    this.sortColumn(key);
    
  }

  output() {
    if(this.click == 0){
      this.entb = false;
      this.salb = true;
      

      // Restablecer posición inicial después de un tiempo suficiente para que termine la transición
      setTimeout(() => {
        this.salb = false;
      }, 200); // 300ms es la duración de la transición
    }
  }

  input() {
    if(this.click ==0){
      this.enter = true;
      this.entb = true;
    }
  }

confirmDelete(shop: Shop): void {

  const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
    width: '250px',
    data: { name: shop.fantasyName }
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result) {
      this._shopService.deleteShop(shop).subscribe({
        next: (response: any) => {
          this.obtenerComercios();
        },
        error: (error: any) => {
          //console.log(error); caombiar por un pomnpout de error
          console.log(error)
        },
      });
    }
  });
}
  getMailErrorMessage() {
    if (this.shopForm.get('mail')?.hasError('required')) {
      return '*Este campo es obligatorio.';
    }

    return this.shopForm.get('mail')?.hasError('email') ? 'Email inválido.' : '';
  }

  noShops: boolean = false;

  filterTable() {
    const filterValue = this.normalizeString(
      this.inputfilter.toLowerCase().trim()
    );

    if (!filterValue) {
      this.shops = [...this.allShops];
    } else {
      this.shops = this.allShops.filter((Shop) =>
        Object.values(Shop).some(
          (value) =>
            value &&
            this.normalizeString(value.toString().toLowerCase()).includes(
              filterValue
            )
        )
      );
    }

    if (this.shops.length === 0) {
      this.messageAboutShops = "No coincide con la búsqueda.";
    }
  }

  normalizeString(str: string): string {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }

  sortColumn(columnKey: string) {
    if (this.sortColumnKey === columnKey) {
      this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';

      if (this.sortOrder === 'asc') {
        this.shops = this.allShops.slice();
        this.sortColumnKey = '';
      }
    } else {
      this.sortOrder = 'asc';
      this.sortColumnKey = columnKey; // sortColumnKey = 'fantasyName'
    }

    this.sortTable();
  }

  sortTable() {
    if (this.sortColumnKey) {
      const compareFunction = (a: Shop, b: Shop, key: keyof Shop) => {
        const valueA = (a[key] || '').toString().toLowerCase();
        const valueB = (b[key] || '').toString().toLowerCase();
        return this.sortOrder === 'asc'
          ? valueA.localeCompare(valueB)
          : valueB.localeCompare(valueA);
      };

      if (Object.keys(this.shops[0]).includes(this.sortColumnKey)) {
        // Object.keys(obj) devuelve un array de strings que representan los nombres de las propiedades del objeto en el argumento
        this.shops.sort((a, b) =>
          compareFunction(a, b, this.sortColumnKey as keyof Shop)
        );
      }
    }
  }

  getComercios() {
    if (this.cuit) {
      this._shopService.getShopsByCuit(this.cuit).subscribe({
        next: (response: any) => {
          this.allShops = response.data.slice();
          this.shops = response.data;
        },
        error: (error: any) => {
          console.log(error);
        },
      });
    } else {
      console.error('Cuit no proporcionado.');
    }
  }

  obtenerComercios() {

    if (this.cuit) {
      this._shopService.getShopsByCuit(this.cuit).subscribe({
        next: (response: any) => {
          this.allShops = response.data.slice();
          this.shops = response.data;
        },
        error: (error: any) => {
          console.log(error);
        },
      });
    } else {
      console.error('Cuit no proporcionado.');
    }
  }

  toggleCardContent(shop: Shop) {
    this.rotationAngles[shop.fantasyName] =
      (this.rotationAngles[shop.fantasyName] || 0) + 180;
    this.visibleContent[shop.fantasyName] =
      !this.visibleContent[shop.fantasyName];
  }

  isScreenSmall(): boolean {
    // Verificar si el tamaño de la pantalla es 'sm' o menor
    return window.innerWidth <= 640; // Ajusta según tus necesidades
  }

  addShop() {
    if (this.cuit) {
      this._shopService.getOwnerByCuit(this.cuit).subscribe({
        next: (ownerId: any) => {
          const Shop: Shop = {
            regDate: this.shopForm.get('regDate')?.value,
            fantasyName: this.shopForm.get('fantasyName')?.value,
            address: this.shopForm.get('address')?.value,
            billingType: this.shopForm.get('billingType')?.value,
            mail: this.shopForm.get('mail')?.value,
            usualPaymentForm: this.shopForm.get('usualPaymentForm')?.value,
            type: this.shopForm.get('type')?.value,
            owner: ownerId,
            contact: this.shopForm.get('contact')?.value,
            contracts: [],
          };

          this.createShop(Shop);
        },
        error: (error) => {
          console.error(error);
        },
      });
    } else {
      console.error('El CUIT no está definido.');
    }
  }

  createShop(SHOP: Shop) {
    this._shopService.createShop(SHOP).subscribe({
      next: (data) => {
        this.obtenerComercios();
      },
      error: (error) => {
        //console.log(error); caombiar por un pomnpout de error
        this.shopForm.reset();
      },
    });
  }

  showNewShop() {
    this.showingNewShop = true;
  }

  continueWithNewShop() {
    this.continueNewShop = true;
  }

  alertUser() {
    return '*Este campo es obligatorio.';
  }

  alertUserAboutError(mess: string) {
    this.fantasyNameInvalid = true;
    this.coloring = 'warn';
    this.message = mess;

    const cuitInputElement = this.fantasyNameInputRef.nativeElement;
    cuitInputElement.click();
    cuitInputElement.focus();
  }

  verifyNameFantasy() {
    this.fantasyName = this.fantasyNameInputRef.nativeElement.value;
    if (this.fantasyName && this.cuit) {
      this._shopService
        .getShopsByCuitAndFantasyName(this.fantasyName, this.cuit)
        .subscribe({
          next: (shops: Shop[]) => {
            if (
              shops &&
              shops.some((Shop) => Shop.fantasyName === this.fantasyName)
            ) {
              this.alertUserAboutError(
                'Nombre de fantasía <strong>repetido</strong>'
              );
            } else {
              this.addShop();
              this.continueWithNewShop();
              alert('Comercio añadido exitosamente');
            }
          },
          error: (error: any) => {
            console.error('Error en la solicitud:', error);
            this.alertUserAboutError(
              'Error al verificar el nombre de fantasía.'
            );
          },
        });
    } else {
      console.error('Nombre de fantasía o cuit no proporcionados.');
    }
  }
}
