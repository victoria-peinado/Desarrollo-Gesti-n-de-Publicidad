import { Component, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { MyDataService } from '../../services/my-data.service';
import { User } from '../../models/user';


@Component({
  selector: 'app-welcome-page',
  templateUrl: './welcome-page.component.html',
  styleUrls: ['./welcome-page.component.scss'],
})
export class WelcomePageComponent implements AfterViewInit {
  @ViewChild('container', { static: false }) container!: ElementRef;

  login_form: FormGroup;
  reg_form: FormGroup;
  u: string = 'admin';
  p: string = 'admin';

  constructor(private myDataService: MyDataService, private _snackBar: MatSnackBar, private router: Router) {
    this.login_form = new FormGroup({
      username: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
    });
    this.reg_form = new FormGroup({
      username: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
      // rol: new FormControl('user', Validators.required),
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

  get rUsernameControl(): FormControl {
    return this.reg_form.get('username') as FormControl;
  }

  get rPasswordControl(): FormControl {
    return this.reg_form.get('password') as FormControl;
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
    const newUser: User = {
      username: this.reg_form.get('username')?.value,
      password: this.reg_form.get('password')?.value,
      role: 'user'
    };
    console.log(newUser);
    this.myDataService.register(newUser).subscribe({
      next: (response: any) => {
        console.log('Usuario creado:', response);
        this.openSnackBar('Registro exitoso', 'Cerrar', 5000, 'success-snackbar');
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('role', response.data.user.role)
        this.router.navigate(['/inicio']);
      },
      error: (error: any) => {
        console.error('Error al registrar usuario:', error);
        this.openSnackBar('Error al registrarse', 'Cerrar', 5000, 'unsuccess-snackbar');
      }
    });
  }

   login() {
    const newUser: User = {
      username: this.login_form.get('username')?.value,
      password: this.login_form.get('password')?.value,
      role: 'user'
    };
    console.log(newUser);
    this.myDataService.login(newUser).subscribe({
      next: (response: any) => {
        console.log('Usuario logeado:', response);
        this.openSnackBar('Logueo exitoso', 'Cerrar', 5000, 'success-snackbar');
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('role', response.data.user.role)
        this.router.navigate(['/inicio']);
      },
      error: (error: any) => {
        console.error('Error al loguear usuario:', error);
        this.openSnackBar('Error al registrarse', 'Cerrar', 5000, 'unsuccess-snackbar');
      }
    });
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
