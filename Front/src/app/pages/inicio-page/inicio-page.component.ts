import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-inicio-page',
  templateUrl: './inicio-page.component.html',
  styleUrl: './inicio-page.component.scss'
})
export class InicioPageComponent {

  constructor(private router: Router) {}
  
    redirectToLogin() {
      this.router.navigate(['/login']);
    }
  

}
