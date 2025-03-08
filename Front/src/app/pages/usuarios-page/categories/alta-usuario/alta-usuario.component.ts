import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { MyDataService } from '../../../../services/my-data.service'
import { User } from '../../../../models/user';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import {
  USER_ROLES
} from 'src/app/constants/constants';

@Component({
  selector: 'app-alta-usuario',
  templateUrl: './alta-usuario.component.html',
  styleUrls: ['./alta-usuario.component.scss']
})

export class AltaUsuarioComponent {
  reg_form: FormGroup;
  userRoles:string[]  = USER_ROLES;
  constructor(private myDataService: MyDataService,private _snackBar: MatSnackBar, private router: Router) {
    this.reg_form = new FormGroup({
      username: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
      rol: new FormControl('admin', Validators.required), // Establecer el rol por defecto como 'admin'
    });
  }
  get roleControl(): FormControl {
    return this.reg_form.get('rol') as FormControl;
  }
  get rUsernameControl(): FormControl {
    return this.reg_form.get('username') as FormControl;
  }

  get rPasswordControl(): FormControl {
    return this.reg_form.get('password') as FormControl;
  }

registration() {
  const newUser: User = {
    username: this.reg_form.get('username')?.value,
    password: this.reg_form.get('password')?.value,
    role: this.reg_form.get('rol')?.value // Obtener el rol seleccionado
  };
  this.myDataService.register(newUser).subscribe({
    next: (response: any) => {
      console.log('Usuario creado:', response);
      this.openSnackBar('Registro exitoso', 'Cerrar', 5000, 'success-snackbar');
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('role', response.data.user.role);
      this.router.navigate(['/inicio']);
    },
    error: (error: any) => {
      console.error('Error al registrar usuario:', error);
      if (error.error && error.error.messages) {
        this.openSnackBar(error.error.messages[0], 'Cerrar', 5000, 'unsuccess-snackbar');
      } else {
        this.openSnackBar('Error al registrarse', 'Cerrar', 5000, 'unsuccess-snackbar');
      }
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