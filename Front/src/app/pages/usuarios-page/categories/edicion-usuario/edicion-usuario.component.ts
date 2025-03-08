import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { MyDataService } from '../../../../services/my-data.service'
import { User } from '../../../../models/user';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { MatStepper } from '@angular/material/stepper';
import { USER_ROLES } from 'src/app/constants/constants';
import { ViewChild } from '@angular/core';
@Component({
  selector: 'app-edicion-usuario',
  templateUrl: './edicion-usuario.component.html',
  styleUrl: './edicion-usuario.component.scss'
})
export class EdicionUsuarioComponent {
  search_form: FormGroup;
  edit_form: FormGroup;
  userRoles: string[] = USER_ROLES;
  usuarioEncontrado: boolean = false;
  usuario: User | null = null;
  @ViewChild('stepper') stepper!: MatStepper;
  constructor(private myDataService: MyDataService, private _snackBar: MatSnackBar, private router: Router) {
    this.search_form = new FormGroup({
      username: new FormControl('', Validators.required),
    });

    this.edit_form = new FormGroup({
      username: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
      rol: new FormControl('admin', Validators.required),
    });
  }

  get searchUsernameControl(): FormControl {
    return this.search_form.get('username') as FormControl;
  }

  get editUsernameControl(): FormControl {
    return this.edit_form.get('username') as FormControl;
  }

  get editPasswordControl(): FormControl {
    return this.edit_form.get('password') as FormControl;
  }

  get editRoleControl(): FormControl {
    return this.edit_form.get('rol') as FormControl;
  }
  buscarUsuarioAndNext(stepper: MatStepper) {
  this.buscarUsuario();
  console.log('Buscando usuario...');
  stepper.next();
  console.log('Siguiente paso...');
}

  buscarUsuario() {
    this.myDataService.getUserByUsername(this.search_form.get('username')?.value).subscribe({
      next: (response: any) => {
        console.log('Usuario encontrado:', response);
        this.usuarioEncontrado = true;
        this.usuario = response.data;
        this.edit_form.patchValue({
          username: this.usuario?.username,
          rol: this.usuario?.role,
        });
      },
      error: (error: any) => {
        console.error('Error al buscar usuario:', error);
        this.usuarioEncontrado = false;
        this.openSnackBar('Usuario no encontrado', 'Cerrar', 5000, 'unsuccess-snackbar');
      }
    });
  }

  editarUsuario() {
    const updatedUser: User = {
      id: this.usuario?.id,
      username: this.edit_form.get('username')?.value,
      password: this.edit_form.get('password')?.value,
      role: this.edit_form.get('rol')?.value,
    };
    this.myDataService.updateUser(updatedUser).subscribe({
      next: (response: any) => {
        console.log('Usuario actualizado:', response);
        this.openSnackBar('Edición exitosa', 'Cerrar', 5000, 'success-snackbar');
        this.router.navigate(['/inicio']);
      },
      error: (error: any) => {
        console.error('Error al editar usuario:', error);
        this.openSnackBar('Error al editar usuario', 'Cerrar', 5000, 'unsuccess-snackbar');
      }
    });
  }
  deleteUser() {
    if (this.usuario!==null){ 
      this.myDataService.deleteUser(this.usuario).subscribe({
        next: (response: any) => {
          console.log('Usuario eliminado:', response);
          this.openSnackBar('Usuario eliminado', 'Cerrar', 5000, 'success-snackbar');
          this.router.navigate(['/inicio']);
        },
        error: (error: any) => {
          console.error('Error al eliminar usuario:', error);
          this.openSnackBar('Error al eliminar usuario', 'Cerrar', 5000, 'unsuccess-snackbar');
        }
      });
    
  }
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