import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NotificationService } from '../services/notification.service';

@Component({
  selector: 'app-user-login',
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.scss']
})
export class UserLoginComponent {
  login_form: FormGroup;
  u: string = 'admin';
  p: string = 'admin';

  constructor(private notificationService: NotificationService) {
    this.login_form = new FormGroup({
      username: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required)
    });
  }

  login() {
    console.log(this.login_form.value);
    if (this.login_form.value.username === this.u && this.login_form.value.password === this.p) {
      this.notificationService.showNotification('Inicio de sesión satisfactorio', 'success');
    }
    else {
      this.notificationService.showNotification('Inicio de sesión fallido', 'error');
    }
  }

  get usernameControl(): FormControl {
    return this.login_form.get('username') as FormControl;
  }
  
  get passwordControl(): FormControl {
    return this.login_form.get('password') as FormControl;
  }
}
