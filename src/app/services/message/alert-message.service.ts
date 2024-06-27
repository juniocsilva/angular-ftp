import { ALERT_MESSAGE_ERROR, ALERT_MESSAGE_INFO, ALERT_MESSAGE_WARNING, ALERT_MESSAGE_SUCCESS } from './../../constants/constants';
import { EventEmitter, Output } from '@angular/core';

export interface AlertMessageI {
  msg?: string;
  msgs?: string[];
  type: number;
}

export abstract class AlertMessageService {
  @Output() onMessageLaunch: EventEmitter<AlertMessageI> = new EventEmitter<AlertMessageI>();

  messagesSuccess: string[];
  messagesInfo: string[];
  messagesError: string[];
  messagesWarning: string[];

  constructor() {
    this.messagesSuccess = [];
    this.messagesInfo = [];
    this.messagesError = [];
    this.messagesWarning = [];
  }

  receiveMessage(data: AlertMessageI) {
    if (data.type === ALERT_MESSAGE_ERROR) {
      if (data.msgs) {
        for (const item of data.msgs) {
          this.messagesError.push(item);
        }
      }
      this.messagesError.push(data.msg);
    }

    if (data.type === ALERT_MESSAGE_INFO) {
      if (data.msgs) {
        for (const item of data.msgs) {
          this.messagesInfo.push(item);
        }
      }
      this.messagesInfo.push(data.msg);
    }

    if (data.type === ALERT_MESSAGE_WARNING) {
      if (data.msgs) {
        for (const item of data.msgs) {
          this.messagesWarning.push(item);
        }
      }
      this.messagesWarning.push(data.msg);
    }

    if (data.type === ALERT_MESSAGE_SUCCESS) {
      if (data.msgs) {
        for (const item of data.msgs) {
          this.messagesSuccess.push(item);
        }
      }
      this.messagesSuccess.push(data.msg);
    }
  }

  sendMessage(data: AlertMessageI) {
    this.onMessageLaunch.emit(data);
  }

  addMessageSuccess(msg: string) {
    this.messagesSuccess.push(msg);
  }

  addMessageInfo(msg: string) {
    this.messagesInfo.push(msg);
  }

  addMessageError(msg: string) {
    this.messagesError.push(msg);
  }

  addMessageWarning(msg: string) {
    this.messagesWarning.push(msg);
  }

  onCloseMessageSuccess() {
    this.messagesSuccess = [];
  }

  onCloseMessageInfo() {
    this.messagesInfo = [];
  }

  onCloseMessageError() {
    this.messagesError = [];
  }

  onCloseMessageWarning() {
    this.messagesWarning = [];
  }

  clearAllMessages () {
    this.messagesError = [];
    this.messagesInfo = [];
    this.messagesSuccess = [];
    this.messagesWarning = [];
  }
}
