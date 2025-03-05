import { CanMatchFn } from '@angular/router';
import { MyDataService } from '../services/my-data.service';
import { combineLatest } from 'rxjs';
import { inject } from '@angular/core';
import { is } from 'date-fns/locale';

export const isLoggedInGuard: CanMatchFn = (route, segments) => {
 const myDataService = inject(MyDataService);
 const isLogged = myDataService.islogged();

  return isLogged;
};
