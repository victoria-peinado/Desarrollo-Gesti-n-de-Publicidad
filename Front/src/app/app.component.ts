import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  /*constructor(private router: Router) { }
  title = 'Radio';
  isInicioRoute: boolean = false;
  ngOnInit(): void {
    // Suscribirse a los eventos de navegación
  this.router.events.pipe(
    filter((event: any) => event instanceof NavigationEnd)
  ).subscribe((event: NavigationEnd) => {
    // Verifica la ruta actual
    if (event.url === '/') {
      // Si la ruta es /inicio, oculta el menú lateral
      this.isInicioRoute = true;
    } else {
      // En otras rutas, muestra el menú lateral
      this.isInicioRoute= false;
  }
});
  }*/
}
