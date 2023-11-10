import { Component, inject, Input  } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';


@Component({
  selector: 'main-nav',
  templateUrl: './main-nav.component.html',
  styleUrls: ['./main-nav.component.scss']
})
export class MainNavComponent {
  private breakpointObserver = inject(BreakpointObserver);
  @Input() lateral: boolean = true;
  
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  isDisplayComercios= true;
  isDisplayPublicistas= true;
  isDisplayContrataciones= true;
  isDisplayPagos= true;
  isDisplayPublicidades= true;
  isDisplayBloques= true;
  toggleDisplayComercios(){
    this.isDisplayComercios = !this.isDisplayComercios;
  }
  toggleDisplayPublicistas(){ 
    this.isDisplayPublicistas = !this.isDisplayPublicistas;
  }
  toggleDisplayContrataciones(){
    this.isDisplayContrataciones = !this.isDisplayContrataciones;
  }
  toggleDisplayPagos(){
    this.isDisplayPagos = !this.isDisplayPagos;
  }
  toggleDisplayPublicidades(){
    this.isDisplayPublicidades = !this.isDisplayPublicidades;
  }
  toggleDisplayBloques(){
    this.isDisplayBloques = !this.isDisplayBloques;
  }
  isLoggedIn= false;
}
