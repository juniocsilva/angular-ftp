import { Injectable } from '@angular/core';

@Injectable()
export class UtilService {

  constructor() { }

  public consisteCpf(cpf: string): boolean {
    let cpfInfo: string;
    let dvInfo: string;
    let i: number;
    let fator = 2;
    let soma = 0;
    let resto = 0;
    let dv1 = 0;
    let dv2 = 0;
    if (cpf.length !== 14) {
      return false;
    }
    cpfInfo = cpf.replace(/\./g, '');
    cpfInfo = cpfInfo.replace(/\-/g, '');
    cpfInfo = cpfInfo.substr(0, 9);
    dvInfo = cpf.substr(12, 2);

    for (i = cpfInfo.length - 1; i >= 0 ; i--) {
      soma += Number(cpfInfo[i]) * fator;
      fator += 1;
    }
    resto = soma % 11;
    if (resto === 0 || resto === 1) {
      dv1 = 0;
    } else {
        dv1 = 11 - resto;
    }
    cpfInfo += dv1;
    fator = 2;
    soma = 0;
    for (i = cpfInfo.length - 1; i >= 0 ; i--) {
      soma += Number(cpfInfo[ i ]) * fator;
      fator += 1;
    }
    resto = soma % 11;
    if (resto === 0 || resto === 1) {
      dv2 = 0;
    } else {
        dv2 = 11 - resto;
    }

    if ( Number(dvInfo[0]) !== dv1 || Number(dvInfo[1]) !== dv2 ) {
      return false;
    }
    return true;
  }
}
