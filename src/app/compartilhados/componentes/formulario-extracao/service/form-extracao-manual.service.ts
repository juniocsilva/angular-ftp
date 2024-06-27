import { Injectable, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
import { ARQUITETURA_SERVICOS } from '../../../../constants/constants';


import { QuestionBase } from '../model/question-base';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { DocumentoPatch } from '../model/documento-patch';

@Injectable({
  providedIn: 'root'
})
export class FormExtracaoManualService {
  
  @Output() cancelamentoCompleto: EventEmitter<any> = new EventEmitter<any>();
  @Output() salvoComSucesso:  EventEmitter<any> = new EventEmitter<any>();

  urlBase: string  = environment.serverPath;
  codigoIntegracao = String(environment.integrationCode);
  httpOptions = {
    headers: new HttpHeaders({
      'integracao': String(environment.integrationCode)
    })
  };
  constructor(private http: HttpClient) { }

  //obterTipoDocumento(idTipoDoc: Number) : Observable<any> {
  //  return this.http.get(environment.serverPath + ARQUITETURA_SERVICOS.cadastro + '/tipo-documento/' + idTipoDoc + '?atributos=true');
  //}
  
  patchDocumento(codigo_controle, documento: DocumentoPatch): Observable<any> {
    return this.http.patch(environment.serverPath + ARQUITETURA_SERVICOS.extracaoDados + '/resultado/' + codigo_controle, JSON.stringify(documento),  this.httpOptions );
  }

  cancelarDocumento(codigo_controle) :  Observable<any> {
    return this.http.delete(environment.serverPath + ARQUITETURA_SERVICOS.extracaoDados + '/controle/' + codigo_controle );
  }
  toFormGroup(questions: QuestionBase<any>[] ) {
    let group: any = {};

    questions.forEach(question => {
      group[question.key] = question.required ? new FormControl(question.value || '', Validators.required)
                                              : new FormControl(question.value || '');
    });
    return new FormGroup(group);
  }

  retornaDocumentoPost(idDocumento: string):Observable<any>{
    return this.http.post(environment.serverPath + ARQUITETURA_SERVICOS.extracaoDadosRetornaDocumentoPost +  idDocumento, this.httpOptions);
  }

}
