import { Injectable } from '@angular/core';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { z } from 'zod';

@Injectable({
  providedIn: 'root',
})
export class SharedDataService {
  private cuit: string = '';
  private businessName: string = '';
  private fiscalCondition: string = '';

  setCuit(cuit: string) {
    this.cuit = cuit;
  }

  setBusinessName(businessName: string) {
    this.businessName = businessName;
  }

  setFiscalCondition(fiscalCondition: string) {
    this.fiscalCondition = fiscalCondition;
  }

  getCuit(): string {
    return this.cuit;
  }

  getbusinessName(): string {
    return this.businessName;
  }

  getfiscalCondition(): string {
    return this.fiscalCondition;
  }

  verifyCuit(): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
          const schema = z
          .string()
          .length(11, 'El CUIT debe tener exactamente 11 dígitos')
          .refine((cuit) => {
            const base = [5, 4, 3, 2, 7, 6, 5, 4, 3, 2];
            const total = cuit
              .split('')
              .slice(0, 10)
              .reduce((acc, digit, index) => acc + Number(digit) * base[index], 0);
            const mod11 = 11 - (total % 11);
            return mod11 === 11 ? cuit[10] === '0' : mod11 === 10 ? false : cuit[10] === mod11.toString();
          }, 'CUIT inválido');
          const result = schema.safeParse(control.value);
      
          return result.success ? null : { invalidCuit: true };
        };
      }

      verifyAddress(): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
          const schema = z.string().regex(/^.*\s\d+$/, { message: 'Address must contain a space followed by a number' });
          const result = schema.safeParse(control.value);
      
          return result.success ? null : { invalidAddress: true };
        };
      }
  
}
