import { NgModule } from '@angular/core';
import { ModuleWithProviders } from '@angular/core'
import { RouterModule, Routes } from '@angular/router';
import { WelcomeComponent } from './view/welcome/welcome.component';
import { FtpComponent } from './ftp/ftp.component';




const routes: Routes = [


      { path: '', component: WelcomeComponent },
      { path: 'ftp', component: FtpComponent },
   

      // otherwise redirect to home
      { path: '**', redirectTo: '' }
];

export const routing: ModuleWithProviders  = RouterModule.forRoot(routes);
