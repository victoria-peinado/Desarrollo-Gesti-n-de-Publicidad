import { Component, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-welcome-page',
  templateUrl: './welcome-page.component.html',
  styleUrls: ['./welcome-page.component.scss'],
})
export class WelcomePageComponent implements AfterViewInit {
  @ViewChild('container', { static: false }) container!: ElementRef;

  login_form: FormGroup;
  u: string = 'admin';
  p: string = 'admin';

  constructor(private _snackBar: MatSnackBar, private router: Router) {
    this.login_form = new FormGroup({
      username: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
    });
  }

  ngAfterViewInit(): void {
    const signInBtn = document.querySelector('#sign-in-btn');
    const signUpBtn = document.querySelector('#sign-up-btn');

    signUpBtn?.addEventListener('click', () => {
      this.container.nativeElement.classList.add('sign-up-mode');
    });

    signInBtn?.addEventListener('click', () => {
      this.container.nativeElement.classList.remove('sign-up-mode');
    });
  }

  get usernameControl(): FormControl {
    return this.login_form.get('username') as FormControl;
  }

  get passwordControl(): FormControl {
    return this.login_form.get('password') as FormControl;
  }

  validateCredentials() {
    if (
      this.usernameControl.value === this.u &&
      this.passwordControl.value === this.p
    ) {
      this.openSnackBar(
        'Credenciales correctas',
        'Cerrar',
        5000,
        'success-snackbar'
      );

      this.router.navigate(['/inicio']);

    } else {
      this.openSnackBar(
        'Credenciales incorrectas',
        'Cerrar',
        5000,
        'unsuccess-snackbar'
      );
    }
  }

  registration() {
    console.log('registrado');
  }

  openSnackBar(
    message: string,
    action: string,
    duration: number,
    panelClass: string
  ) {
    this._snackBar.open(message, action, {
      duration: duration,
      panelClass: [panelClass],
    });
  }
}
