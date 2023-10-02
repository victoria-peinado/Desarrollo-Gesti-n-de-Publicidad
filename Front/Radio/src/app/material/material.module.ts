import { NgModule } from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import{MatFormFieldModule} from '@angular/material/form-field';
import{MatInputModule} from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import {MatCardModule} from '@angular/material/card';


const MaterialComponents = [  
  MatButtonModule,
  MatToolbarModule,
  MatSidenavModule,
  MatIconModule,
  MatListModule,
  MatFormFieldModule,
  MatInputModule,
  MatSelectModule,
  MatCardModule
  

]

@NgModule({
  imports: [MaterialComponents    
  ],
  exports: [MaterialComponents 
  ]
})
export class MaterialModule { }
