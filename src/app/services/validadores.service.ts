import { Injectable } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { resolve } from 'url';

interface ErrorValidate{
  [s:string]: boolean
}

@Injectable({
  providedIn: 'root'
})
export class ValidadoresService {

  constructor() { }

  existeUsuario( control: FormControl ):Promise<ErrorValidate> | Observable<ErrorValidate>{

    if ( !control.value ){
      return Promise.resolve(null);
    }

    return  new Promise((resolve, reject)=>{
      setTimeout(() => {
        if ( control.value === 'ADMIN'){
          resolve({ existe: true })
        }else{
          resolve( null )
        }
      }, 2000);
    });

  }

  passwordsIguales( pass1Name: string, pass2Name: string){

    return (formGroup: FormGroup) =>{

      const pass1Control = formGroup.controls[pass1Name];
      const pass2Control = formGroup.controls[pass2Name];

      if ( pass1Control.value === pass2Control.value ){
        pass2Control.setErrors(null);
      }else{
        pass2Control.setErrors({ noEsIgual: true });
      }

    }

  }

}
