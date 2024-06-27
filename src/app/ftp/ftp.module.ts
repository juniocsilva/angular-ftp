import { NgModule } from '@angular/core';
import { Injectable } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {PanelModule, DataTableModule, SpinnerModule, DropdownModule} from 'primeng/primeng';
import {SharedModule, MessagesModule} from 'primeng/primeng';
import {ConfirmDialogModule, ConfirmationService, InputMaskModule} from 'primeng/primeng';
import { FtpComponent } from './ftp.component';
import { FtpService } from './ftp.service';
import { FileUploadModule } from 'ng2-file-upload';


@NgModule({
  imports: [
    FileUploadModule,
    CommonModule,
    FormsModule,
    PanelModule,
    DataTableModule,
    InputMaskModule,
    ConfirmDialogModule,
    SpinnerModule,
    MessagesModule
    
  
  ],
  exports: [
    FtpComponent

  ],
  declarations: [
    FtpComponent
  ],
  providers: [
    FtpService,
    ConfirmationService
  ]
})
export class FtpModule { }
