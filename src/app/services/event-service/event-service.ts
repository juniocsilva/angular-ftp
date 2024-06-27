import {Injectable} from '@angular/core';
import { Subject } from 'rxjs';


/**
 * Cadastra e emite eventos globais. Pare ser usado como $rootScope.$broadcast e $rootScope.$on do angularJS
 */

@Injectable()
export class EventService {
  private listeners: any;
  private eventsSubject: any;
  private events: any;

  constructor() {
    this.listeners = {};
    this.eventsSubject = new Subject<any>();

    this.events = this.eventsSubject.asObservable();

    this.events.subscribe(
      ({name, args}: any) => {
        if (this.listeners[name]) {
          for (let i = 0 ; i < this.listeners[name].length; i++) {
            this.listeners[name][i].listerner(...args);
            if (this.listeners[name][i].oneTime) {
              this.listeners[name].splice(i , 1);
            }
          }
        }
      });
  }

  on(name, listener, oneTime = false) {
    if (!this.listeners[name]) {
      this.listeners[name] = [];
    }

    this.listeners[name].push({ listerner : listener , oneTime : oneTime } );
  }

  broadcast(name, ...args) {
    this.eventsSubject.next({name, args});
  }

}
