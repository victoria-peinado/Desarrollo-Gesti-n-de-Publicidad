import {
  AfterViewInit,
  Component,
  ViewChild,
  ElementRef,
  OnInit,
  ChangeDetectorRef,
  HostListener,
} from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { Trade } from 'src/app/models/trade';
import { MyDataService } from 'src/app/services/my-data.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedDataService } from '../services/shared-data.service';
import { ThemePalette } from '@angular/material/core';
import { MatSort, MatSortModule } from '@angular/material/sort';
import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';
@Component({
  selector: 'app-alta-titular-contacto-comercio',
  templateUrl: './alta-titular-contacto-comercio.component.html',
  styleUrls: ['./alta-titular-contacto-comercio.component.scss'],
})
export class NewOwnerContactShopComponent  {
 
}
