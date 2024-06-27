import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import { SidebarDireitaComponent } from './view/sidebar-direita/sidebar-direita.component';
import { SidebarDireitaMenusComponent } from './view/sidebar-direita-menus/sidebar-direita-menus.component';
import { RodapeComponent } from './view/rodape/rodape.component';
import { CabecalhoComponent } from './view/cabecalho/cabecalho.component';
import { SidebarEsquerdaComponent } from './view/sidebar-esquerda/sidebar-esquerda.component';
import { WelcomeComponent } from './view/welcome/welcome.component';
import { TemplateComponent } from './view/template/template.component';
import { FtpModule } from './ftp/ftp.module';
import { UtilService } from './services/util.service';
import { routing } from './app.routing';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoaderService, LoaderComponent } from './services';
import { Ng4LoadingSpinnerModule } from 'ng4-loading-spinner';


@NgModule({
  declarations: [
    SidebarDireitaComponent,
    SidebarDireitaMenusComponent,
    RodapeComponent,
    CabecalhoComponent,
    SidebarEsquerdaComponent,
    WelcomeComponent,
    TemplateComponent,
    LoaderComponent,
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,    
    routing,
    FtpModule,
    Ng4LoadingSpinnerModule.forRoot()
  ],
  providers: [
    UtilService,
    LoaderService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
