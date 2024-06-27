import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { InputMaskModule } from "primeng/primeng";
import { NgModule } from "@angular/core";
import { DocumentoModule } from "src/app/documento";
import { TemplateModule } from "src/app/template/template.module";
import { FormExtracaoManualComponent } from "./view/form-extracao-manual.component";
import { FormExtracaoManualService } from "./service/form-extracao-manual.service";
import { FormataData } from "src/app/extracao-manual/pipes/formata-data/formata-data.pipe";
import { FormataCpfCnpj } from "src/app/extracao-manual/pipes/formata-cpf-cnpj/formata-cpf-cnpj.pipe";
import { FormataCpf } from "src/app/extracao-manual/pipes/formata-cpf/formata-cpf.pipe";
import { FormataCnpj } from "src/app/extracao-manual/pipes/formata-cnpj/formata-cnpj.pipe";
import { FormataTelefoneDDD } from "src/app/extracao-manual/pipes/formata-telefone-ddd/formata-telefone-ddd.pipe";
import { AnalyticsModule } from "src/app/shared/analytics.module";
import { CompartilhadodModule } from "src/app/shared/modulos/compartilhado.module";
import { UtilsCompartilhado } from "./utilidades/utils-compartilhado";

@NgModule({
  imports: [
    AnalyticsModule,
    CommonModule,
    InputMaskModule,
    CompartilhadodModule,
    FormsModule,
    ReactiveFormsModule,
    DocumentoModule,
    TemplateModule
  ],
  declarations: [     
    FormExtracaoManualComponent,
    FormataData,
    FormataCpfCnpj,
    FormataCpf,
    FormataCnpj,
    FormataTelefoneDDD
    ] ,
  entryComponents : [
    FormExtracaoManualComponent
  ]
  ,
  exports : [   
    FormExtracaoManualComponent
    ],
  providers :[
    /*{
      provide: HTTP_INTERCEPTORS,
      useClass: HttpInterceptorService,
      multi: true
    },*/
    UtilsCompartilhado,
    FormExtracaoManualService
  ]
})
export class FormularioExtracaoManualModule { }
