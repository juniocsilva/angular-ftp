


import { environment } from '../../environments/environment';
import { EntidadeFtp } from '../model/entidade-ftp';

import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';


@Injectable()
export class FtpService {


  urlBase: string = environment.serverPath;

  constructor(private http: HttpClient ) { }

  get(): Observable<any>  {
    return this.http.get(this.urlBase + '/ftp');

  }// FIM METODO

  getById(id: string): Observable<any>  {
    return this.http.get(this.urlBase + '/ftp/' + id);

  }// FIM METODO

  save(entidade: EntidadeFtp): Observable<any> {

    return this.http.post(this.urlBase + '/ftp', entidade);
  }// FIM METODO

  update(entidade: EntidadeFtp): Observable<any> {

    return this.http.put(this.urlBase + '/ftp', entidade);
  }// FIM METODO

  delete(id: string): Observable<any> {
    return this.http.delete(this.urlBase + '/ftp/' + id);
  }


}
