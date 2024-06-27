import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { ARQUITETURA_SERVICOS } from '../../../constants/constants';
import { PaeContratoPost } from './../../model/pae-contrato-post';
import { PaeContratoPatch } from './../../model/pae-contrato-patch';
import { PaeDocumentoGet } from '../../model/pae-documento-get';
import { PaeDocumentoPatch } from '../../model/pae-documento-patch';

@Injectable()

export class PaeDocsService {
  
  urlBase: string  = environment.serverPath + '/processoadministrativo/v1';
  codigoIntegracao = String(environment.integrationCode);
  httpOptions = {
    headers: new HttpHeaders({
      'integracao': this.codigoIntegracao
    })
  };
  constructor(private http: HttpClient) { }

  obterProcessoPorId( id: string): Observable<any> {
    return this.http.get(environment.serverPath + ARQUITETURA_SERVICOS.processoAdministrativo + '/processo/' + id);
  }

  obterDocumentoPorId( id: string): Observable<any> {
    return this.http.get(environment.serverPath + ARQUITETURA_SERVICOS.processoAdministrativo + '/documento/' + id);
  }

  incluirDocumento(nrProcesso: string, documento: PaeDocumentoGet) : Observable<any> {
    return this.http.post(environment.serverPath + ARQUITETURA_SERVICOS.processoAdministrativo + '/processo/' + nrProcesso + '/documento', JSON.stringify(documento), this.httpOptions);
  }

  incluirDocumentoContrato(nrContrato: string, documento: PaeDocumentoGet) : Observable<any> {
    return this.http.post(environment.serverPath + ARQUITETURA_SERVICOS.processoAdministrativo + '/contrato/' + nrContrato + '/documento', JSON.stringify(documento), this.httpOptions);
  }

  incluirDocumentoApenso(nrApenso: string, documento: PaeDocumentoGet) : Observable<any> {
    return this.http.post(environment.serverPath + ARQUITETURA_SERVICOS.processoAdministrativo + '/apenso/' + nrApenso + '/documento', JSON.stringify(documento), this.httpOptions);
  }

  alterarDocumento(idDocumento: string, documento: PaeDocumentoPatch) : Observable<any> {
    return this.http.patch(environment.serverPath + ARQUITETURA_SERVICOS.processoAdministrativo + '/documento/' + idDocumento, JSON.stringify(documento), this.httpOptions);
  }

  downloadDocumento(idDocumento: string) : Observable<any> {
    return this.http.get(environment.serverPath + ARQUITETURA_SERVICOS.processoAdministrativo + '/documento/' + idDocumento + '/exportar');
  }


  obterContratoPorId(idContrato: string) : Observable<any> {
    return this.http.get(environment.serverPath + ARQUITETURA_SERVICOS.processoAdministrativo + '/contrato/' + idContrato);
  }

  obterApensoPorId(idApenso: string) : Observable<any> {
    return this.http.get(environment.serverPath + ARQUITETURA_SERVICOS.processoAdministrativo + '/apenso/' + idApenso);
  }

  obterTiposDocumentos() : Observable<any> {
    return this.http.get(environment.serverPath + ARQUITETURA_SERVICOS.processoAdministrativo + '/tiposdocumento/');
  }

  deletarDocumentoPorId(idDocumento: string, justificativa: string) : Observable<any> {
      return this.http.delete(environment.serverPath + ARQUITETURA_SERVICOS.processoAdministrativo + '/documento/' + idDocumento + '/' + justificativa);
  }

} //FIM CLASSE