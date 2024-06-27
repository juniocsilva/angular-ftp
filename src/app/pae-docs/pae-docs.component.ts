import { PaeUtils } from './../../utils/utilidades/pae-utils';
import { LOCAL_STORAGE_CONSTANTS } from './../../../constants/constants';
import {
  Component,
  ViewEncapsulation,
  Input,
  ElementRef,
  ViewChild,
  Renderer2,
  AfterViewInit,
  DoCheck
} from '@angular/core';


import { ApplicationService, LoaderService, AlertMessageService } from './../../../services/index';
import { HttpClient } from '@angular/common/http';
import { FileUploader } from 'ng2-file-upload';
import { ARQUITETURA_SERVICOS } from '../../../constants/constants';
import { environment } from './../../../../environments/environment';
import { PaeDocumentoGet } from './../../model/pae-documento-get';

import { SelectItem, DataTable, ConfirmationService } from 'primeng/primeng';

import {PaeDocsService} from './pae-docs.service'
import { Combo } from './../../model/combo';
import * as PDFJS from 'pdfjs-dist/build/pdf';
import { PaeContratacao } from '../../model/pae-contratacao';
import { PaeDocumentoPatch } from './../../model/pae-documento-patch';
//import { JwtHelper } from '../../../../../node_modules/angular2-jwt';
import {JwtHelper} from 'angular2-jwt';

declare var $: any;

@Component({
  selector: 'pae-docs',
  templateUrl: './pae-docs.component.html',
  styleUrls: ['./pae-docs.component.css'],
  encapsulation: ViewEncapsulation.None
  
})
export class PaeDocsComponent extends AlertMessageService implements DoCheck {
  @Input() processo: PaeContratacao;
  @Input() objeto: any;
  @Input() docPara: string;
  @ViewChild('thumbs') item: ElementRef;
  @ViewChild('f') frm: ElementRef;
  @ViewChild('dt') datatable: DataTable;
  
  messagesSuccess: string[];
  messagesInfo: string[];
  messagesError: string[];
  messagesWarning: string[];

  uploader: FileUploader = new FileUploader(null);
  currentImage;
  URLImage: string;
 
  apensos: SelectItem[];
  documentoSelecionado: any;
  saidaB64: string;
  
  entidade: PaeDocumentoGet;
  entidadePatch: PaeDocumentoPatch;

  useBase64 = false;
  larguraTabela = 'col-md-6 no-padding'
  title;
  divCanvas;
  showPrevious = false;
  showNext = false;
  diminuiu = true;
  
  rotacaoImg = 0;
  escalaImg = 0.4;
  exibirImg = false;
  ehPdf = false;
  paginaCorrente = 1;
  paginaFinal: number;
  paginasPdf: any = [];
  thumbs: any = [];
  
  pdfCarregado;
  labelIncAlt = 'INCLUIR'
  categorizar = true;  
  atributos: any = [];

  tiposConfidencial: any = [
    {'label': 'Não', 'value': false},
    {'label': 'Sim', 'value': true}
  ]
  origensDocumento: any = [
    {'label': 'Cópia Autenticada Adminsitrativamente', 'value': 'A'},
    {'label': 'Cópia Autenticada Cartório', 'value': 'C'},
    {'label': 'Cópia Simples', 'value': 'S'},
    {'label': 'Original', 'value': 'O'}
  ]
  icInativo: any = [
    {'label': 'Não', 'value': false},
    {'label': 'Sim', 'value': true}
  ]


  tiposDocumento:Combo[] = [];
  docsCadastrados:Combo[] = [];
  objTiposDocumento: any = [];
  atualizou = false;
  mensagem = '';
  mensagemAcesso = null
  tipoMensagem = 'success'
  idDocumento: string;
  tipoDocSelecionado;
  origemDocSelecionado;
  confidencialSelecionado;
  inativoSelecionado;
  docSubstituto = false;
  idDocSubstituicao: string;
  alteracao = false;
  exibirBotao = false;
  documentos: any = [];
  descDocumento = '';
  justificativaSubs = '';
  justSubs = false;
  sortOrder = 1;
  novoDoc = false;
  campoSort = 'id';
  itensDisplay = 10;
  indexTipoDoc = 0;
  tipoDocInvalido = true;
  justDel = '';
  excDisplay = false;
  idToken : any;
  token : any;
  acesso: number;
  permissoes = [];
  semPerfil = false;
  perfilSig = false
  perfilLeitura = false
  perfilEscrita = false
  infoRegistros = ''
  objPaginar;

  constructor(
    
    private loadService: LoaderService,
    private applicationService: ApplicationService,
    private service: PaeDocsService,
    private util: PaeUtils

  ) {
    super();
    this.URLImage = environment.serverPath + ARQUITETURA_SERVICOS.image + '/uploadTemporario';
    
    this.perfilSig = this.applicationService.verificarPerfil('MTRADM,MTRPAESIG')
    this.perfilEscrita = this.applicationService.verificarPerfil('MTRADM,MTRPAEOPE')
    this.perfilLeitura = this.applicationService.verificarPerfil('MTRADM,MTRPAEOPE,MTRTEC')
   
  }
  
  // tslint:disable-next-line:use-life-cycle-interface
  ngOnInit() {
    if (!this.perfilEscrita) {
      this.addMessageError('Você não tem permissão para dar carga em documentos.')
    }
    this.entidade = new PaeDocumentoGet;
      
    this.service.obterTiposDocumentos().subscribe( response => {
      this.tiposDocumento[0]  = {'value': '-1', 'label': 'SELECIONE O TIPO DE DOCUMENTO' }
      
      for (let i = 0; i < response.length; i++ ) {
        this.tiposDocumento[i+1]  = {'value': response[i].id, 'label': response[i].nome }
        this.objTiposDocumento[response[i].id] = this.tiposDocumento[i+1]
      }
      
      if (this.tiposDocumento.length > 0) {
        this.documentoSelecionado = this.tiposDocumento[0].value;
        this.tipoDocSelecionado = this.tiposDocumento[0].value;
        
        this.indexTipoDoc = 0;
      } else {
        this.indexTipoDoc = -1;
      }
      this.origemDocSelecionado = this.origensDocumento[3].value;
      this.confidencialSelecionado = this.tiposConfidencial[0].value;
      
    }, error => {
        this.exibeErro(error)
    });
   
    this.objeto.documentos = []
    this.documentoSelecionado = {}
    
  }

  ngDoCheck() {
    if (this.indexTipoDoc === -1) {
      this.mensagem = 'Situação inesperada: Não foi possível carregar os tipos de documento.'
      this.tipoMensagem = 'error';
      this.perfilEscrita = false;
      //this.atualizou = true;
      this.addMessageError(this.mensagem)
    }

    if (this.objPaginar == null && this.documentos) {
        const x = {
        first: 0,
        rows: this.itensDisplay
      }
      this.paginar(x)
    }
  }
  // tslint:disable-next-line:use-life-cycle-interface
  ngOnChanges() {
    this.objPaginar = null;
    this.infoRegistros = ''
    if (this.processo === undefined || this.processo.id == null) {
      this.limparImagem();
      this.exibirBotao = false
      this.documentos = []
      this.objeto = {}
    }     

    if (this.docPara === 'CTR' || this.docPara === 'APSP' || this.docPara === 'APSC' ) {
      this.processaObjeto()  
    } else {
        if (this.docPara === 'PRC') {
          this.processaProcesso()
        }
      }

  }
 
  processaObjeto() {
    
    if (this.objeto === undefined) {
      this.limparImagem();
      this.exibirBotao = false;
      return;
    }
    if (this.objeto.id == null) {
      this.limparImagem();
      this.exibirBotao = false
    } else {
        this.limparImagem();
        
        this.exibirBotao = true
        this.documentos = this.objeto.documentos
        this.classificaDocs();
      }
  }

  processaProcesso() {
    if (this.processo === undefined) {
      return;
    }
    if (this.processo.id == null) {
      this.limparImagem();
      this.exibirBotao = false
    } else {
        this.exibirBotao = true;
        //this.dt.value = this.processo.documentos;
        this.documentos = this.processo.documentos;
        this.classificaDocs();
      }
  }


  classificaDocs() {
    if (this.objeto.documentos === undefined || this.objeto.documentos === null) {
      return;
    }
    this.objeto.documentos.sort((n1 , n2 ) : number => {
      if (n1.id < n2.id) return -1;
      if (n1.id > n2.id) return 1;
      return 0;
    });

  }

  fileChanged(evt) {
    this.atualizou = false
    const files = evt.target.files;
    this.limparImagem();
    for (let i = 0, f; f = files[i]; i++) {
      if (!this.consisteTipoArquivo(f)) {
        this.mensagem = 'Documento não condizente com a extensão informada.';
        this.tipoMensagem = 'error'
        this.addMessageError(this.mensagem)
        //this.atualizou = true;
        return;
      }
      this.rotacaoImg = 0;
      this.alteracao = false;
    
      const reader = new FileReader();
   
      reader.onload = () => {
          this.documentos = this.objeto.documentos
          
          const dados = reader.result.toString().split(',')
          const mime_type0 = dados[0].split(':')
          const mime_type1 = mime_type0[1].split(';')
          this.entidade.mime_type = mime_type1[0];
          
          if(dados[0].indexOf('pdf') > 0) {
            const dataB = atob(dados[1])
            const ret = this.processaPdf(dataB)
            ret.then( () => {
              this.currentImage = dados[1]
              this.tipoDocSelecionado = this.tiposDocumento[this.indexTipoDoc].value;
              this.origemDocSelecionado = 'O' 
              

              this.ehPdf = true;
              this.useBase64 = false;
              this.escalaImg = 0.5
              
            }, error => {
                this.mensagem = 'Documento não condizente com a extensão informada.';
                this.tipoMensagem = 'error'
                //this.atualizou = true;
                this.addMessageError(this.mensagem)
            }) 
          } else {
              if(dados[0].indexOf('image') > 0) {
                /*
                this.currentImage = reader.result
                this.ehPdf = false;
                this.useBase64 = true;
                this.escalaImg = 0.4
                this.drawImage()
                */
               this.mensagem = 'Documento não condizente com a extensão informada.';
               this.tipoMensagem = 'error'
               //this.atualizou = true;
               this.addMessageError(this.mensagem)
               return
              }
          }

      };
  
      reader.readAsDataURL(f)
      
    }
  }

  consisteTipoArquivo(arquivo) {
    const dados = arquivo.name.split('.');
    const tipo = dados[dados.length - 1];
    if (tipo !== 'pdf') {
      return false;
    } else {
      return true;
    }
    
  }

  processaPdf(dataB): Promise<any> {
   
    PDFJS.disableWorker = true;

    const loadingTask = PDFJS.getDocument({data: dataB});
     return loadingTask.promise.then(pdf => {
      
      this.pdfCarregado = pdf;
      
      this.paginaCorrente = 1;
      this.paginaFinal = pdf.numPages;
      this.ehPdf = true;
      for (let i = 1; i <= pdf.numPages; i++) {
        pdf.getPage(i).then(page => {
          this.paginasPdf[i] = page;
        }).then (()=> {
            if (this.paginasPdf.length > pdf.numPages) {
              this.exibirPaginaPdf(this.paginasPdf[this.paginaCorrente])
            }
        })
      }
    });
  }

  insertDocuments(input) {
    if (input) {
      this.novoDoc = true;
      this.justSubs = false;
      this.justificativaSubs = '';
      input.click();
    }
  }
 
  getUnidadeUser() {
    const userSSO = JSON.parse(this.applicationService.getUserSSO());
    return userSSO['co-unidade'];
  }

  getMatriculaUser() {
    const userSSO = JSON.parse(this.applicationService.getUserSSO());
    let usuario;
    if(userSSO !== undefined) {
      usuario = userSSO.preferred_username;
    }else {
      usuario = 'c000001'
    }
    return usuario;
  }

  drawImage() {
    const uri = {
      url: this.currentImage,
      rotacao: this.rotacaoImg,
      escala: this.escalaImg

    }
    if (uri != null) {
      let url = '';
      let rotacao = 0;
      const escala = this.escalaImg
      let uriPrinc = '';
      
      if (typeof uri === 'string') {
        uriPrinc = uri;
        url = uri;
        rotacao = 0 || 0;
        
      } else {
        uriPrinc = uri.url;
        url = uri.url;
        rotacao = uri.rotacao || 0;
        
      }
      this.exibirImg = true
      const canvas: any = document.querySelector('#' + this.docPara);
      this.currentImage = uriPrinc;
  
  
      const img = new Image();
     
      img.src = this.useBase64 ? (uriPrinc) :uriPrinc;
      
      const cContext = canvas.getContext('2d');
      img.onload = function() {
        const w = img.width * escala,
        h = img.height * escala;
        let cw = w,
          ch = h,
          cx = 0,
          cy = 0;
  
        switch (rotacao) {
          case 90:
            cw = h;
            ch = w;
            cy = h * -1;
            break;
          case 180:
            cx = w * -1;
            cy = h * -1;
            break;
          case 270:
            cw = h;
            ch = w;
            cx = w * -1;
            break;
        }
        canvas.setAttribute('width', cw.toString());
        canvas.setAttribute('height', ch.toString());
        cContext.rotate(rotacao * Math.PI / 180);
        cContext.drawImage(img, cx, cy, w, h);
      };
    }
  }

  zoomUp() {
    let max = 0;
    if (this.ehPdf) {
      max = 1.3
    } else {
        max = 0.8
      }
    this.escalaImg += 0.1;
    if (this.escalaImg > max) {
      this.escalaImg = max;
    } else {

      }
    const img = {
      url: this.currentImage,
      rotacao: this.rotacaoImg,
      escala: this.escalaImg
    };
    if (this.ehPdf) {
      
      this.exibirPaginaPdf(this.paginasPdf[this.paginaCorrente])
    } else {
        this.drawImage();
      }
  }

  zoomDown() {
    let min = 0;
    if (this.ehPdf) {
      min = 0.6
    } else {
        min = 0.4
      }
    this.escalaImg -= 0.1;
    if (this.escalaImg < min) {
      this.escalaImg = min;
    }
    const img = {
      url: this.currentImage,
      rotacao: this.rotacaoImg,
      escala: this.escalaImg
    };
    if (this.ehPdf) {
      this.exibirPaginaPdf(this.paginasPdf[this.paginaCorrente])
    } else {
        this.drawImage();
      }
  }

  primeiraPagina() {
    this.paginaCorrente = 1
    this.mudouPaginaPdf();
  }

  ultimaPagina() {
    this.paginaCorrente = this.paginaFinal
    this.mudouPaginaPdf();
  }

  proximaPagina() {
    if (!this.ehPdf) {
      return;
    }
    this.paginaCorrente++
    if (this.paginaCorrente > this.paginaFinal) {
      this.paginaCorrente = 1
    }
    this.mudouPaginaPdf();
  }

  paginaAnterior() {
    if (!this.ehPdf) {
      return;
    }
    this.paginaCorrente--
    if (this.paginaCorrente < 1) {
      this.paginaCorrente = this.paginaFinal
    }
    this.mudouPaginaPdf();
  }

  turnRight() {
    this.rotacaoImg += 90;
    if (this.rotacaoImg >= 360) {
      this.rotacaoImg = 0;
    }
   
    const img = {
      url: this.currentImage,
      rotacao: this.rotacaoImg,
      escala: this.escalaImg
    };
    if (this.ehPdf) {
      this.exibirPaginaPdf(this.paginasPdf[this.paginaCorrente])
    } else {
        this.drawImage();
      }
   
  }

  turnLeft() {
    this.rotacaoImg -= 90;
    if (this.rotacaoImg <= -90) {
      this.rotacaoImg = 270;
    }
   
    const img = {
      url: this.currentImage,
      rotacao: this.rotacaoImg,
      escala: this.escalaImg
    };
    if (this.ehPdf) {
      this.exibirPaginaPdf(this.paginasPdf[this.paginaCorrente])
    } else {
        this.drawImage();
    }
   
  }

  showDefault() {
    this.categorizar = true;
    if (this.ehPdf) {
      this.escalaImg = 0.6;
    } else {
        this.escalaImg = 0.4;
    }
    this.rotacaoImg = 0;
    this.diminuiu = true
    this.larguraTabela = 'col-md-6 no-padding'
    const img = {
      url: this.currentImage,
      rotacao: this.rotacaoImg,
      escala: this.escalaImg
    };
    if (this.ehPdf) {
      this.exibirPaginaPdf(this.paginasPdf[this.paginaCorrente])
    } else {
        this.drawImage();
    }
  }

  limparCanvas() {
    const canvas: any = document.querySelector('#' + this.docPara);
    if (canvas) {
      const cContext = canvas.getContext('2d');
      cContext.clearRect(0, 0, canvas.width, canvas.height);
    }
  }

  limparImagem() {
    this.tipoDocInvalido = true;
    this.currentImage = null;
    this.diminuiu = true;
    this.larguraTabela =  'col-md-6 no-padding'
    this.limparCanvas()
    this.exibirImg = false;
    this.escalaImg = 0.5;
    this.paginasPdf = [];
    this.paginaCorrente = 1
    this.atualizou = false;
    this.labelIncAlt = 'INCLUIR'
    this.descDocumento = ''
    this.messagesError = []
    this.messagesInfo = []
    this.messagesSuccess = []
    this.messagesWarning = []
    this.origemDocSelecionado = this.origensDocumento[0].value;
    this.confidencialSelecionado = this.tiposConfidencial[0].value;
    if (this.tiposDocumento.length > 0) {
      this.documentoSelecionado = this.tiposDocumento[0].value;
      this.tipoDocSelecionado = this.tiposDocumento[0].value;
    }
  }

  clicouImagem() {
    
    if (this.larguraTabela === 'col-md-12 row' ) {
      this.larguraTabela =  'col-md-6 no-padding'
      this.diminuiu = true;
      this.categorizar = true;
    } else {
      this.larguraTabela =  'col-md-12 row'
      this.diminuiu = false;
      this.categorizar = false
    }
    
    if (this.ehPdf) {
      if (this.larguraTabela === 'col-md-12 row' ) {
        this.escalaImg = 1.3
      } else {
          this.escalaImg = 0.5
      }
      
      this.exibirPaginaPdf(this.paginasPdf[this.paginaCorrente])
    } else {
        if (this.larguraTabela === 'col-md-12 row') {
          this.escalaImg = 0.8
        } else {
          this.escalaImg = 0.4
        }
        this.drawImage()
      }
     
  }

  onRowSelect(event) {
    
    this.idDocumento = event.data.id
    this.loadService.show()
    this.service.obterDocumentoPorId(this.idDocumento).subscribe( response => {

      const dataB = atob(response.conteudos[0])
      this.limparImagem();
      this.ehPdf = true;
      this.useBase64 = false;
      this.escalaImg = 0.6;
      this.currentImage = response.conteudos[0];
      this.labelIncAlt = 'ALTERAR';
      this.tipoDocSelecionado = response.tipo_documento.id;
      
      if (this.tipoDocSelecionado !== '-1') {
        this.tipoDocInvalido = false;
      } else {
        this.tipoDocInvalido = true;
      }
      
      this.origemDocSelecionado = response.origem_documento;
      this.confidencialSelecionado = response.confidencial;
      this.inativoSelecionado = response.valido
      this.descDocumento = response.descricao_documento;
      this.entidade.justificativa_substituicao = response.justificativa_substituicao
      
      this.entidade.mime_type = response.mime_type;
      if (response.documento_substituto != null || (response.justificativa_substituicao !== '' && 
          response.justificativa_substituicao != null)) {
           this.justSubs = true
      } else {
        this.justSubs = false
      }
      
      this.alteracao = true;
      this.categorizar = true
      //if (this.semPerfil && this.confidencialSelecionado) {
      //  this.loadService.hide();
      //  return
      //}
      this.processaPdf(dataB)
      this.loadService.hide();
    }, error => {
      //this.mensagem = 'Erro ao carregar o Documento. Código = ' + error.status
      this.mensagem = error.error.mensagem;
      if (error.error.detalhe) {
        this.mensagem = this.mensagem + ' ' + error.error.detalhe
      }
      this.tipoMensagem = 'error';
      //this.atualizou = true;
      this.addMessageError(this.mensagem)
      this.limparCanvas()
      this.loadService.hide();
    });
  }
 
  mudouPaginaPdf() {
    if (this.paginaCorrente > this.paginaFinal) {
      this.paginaCorrente = this.paginaFinal;
    }
    if (this.paginaCorrente < 1 ) {
      this.paginaCorrente = 1;
    }

    this.exibirPaginaPdf(this.paginasPdf[this.paginaCorrente])
  }

  mudouConfidencial() {
    if (this.semPerfil && this.confidencialSelecionado ) {
      this.exibirImg = false
    } else {
      this.exibirImg = true;
    }

  }

  exibirPaginaPdf(page) {
    
    const scale = this.escalaImg;
    const viewport = page.getViewport(scale,this.rotacaoImg);

    const canvas: any = document.querySelector('#' + this.docPara);
    const context = canvas.getContext('2d');
    canvas.height = viewport.height;
    canvas.width = viewport.width;

    const renderContext = {
      canvasContext: context,
      viewport: viewport
    };
    const renderTask = page.render(renderContext);
    
    renderTask.then( () => {
      if (!this.perfilSig && this.confidencialSelecionado) {
        this.exibirImg = false
        //this.messagesError.push('Você não possui perfil para visualizar arquivos sigilosos.')
        this.addMessageError('Você não possui perfil para visualizar arquivos sigilosos.')
      } else {
          this.exibirImg = true
          this.messagesError = []
      }
    });
    
  }

  fazerCategorizacao() {
      this.categorizar = !this.categorizar
  }

  cancelarOperacao(form) {
    this.entidade = new PaeDocumentoGet
    //this.categorizar = !this.categorizar
    this.limparImagem()
    this.clearAllMessages();
  }

  salvarDocumento(form) {
    if (!this.ehPdf) {
      const dados = this.currentImage.split(',')
      this.entidade.conteudos[0] = dados[1]
    } else {
        this.entidade.conteudos[0] = this.currentImage
    }
    this.entidade.descricao_documento = this.descDocumento
    this.entidade.origem_documento = this.origemDocSelecionado;
    this.entidade.tipo_documento = this.tipoDocSelecionado;
    this.entidade.atributos_documento = [];
    this.entidade.codigo_integracao = environment.integrationCode;
    this.entidade.documento_substituicao = null;
    this.entidade.confidencial = this.confidencialSelecionado;
    this.entidade.valido = true;
    //this.entidade.justificativa_substituicao = this.justificativaSubs;
    if (this.docSubstituto) {
      this.entidade.documento_substituicao = this.idDocSubstituicao;
    } else {
        this.entidade.documento_substituicao = null;
    }
    if (this.labelIncAlt === 'INCLUIR') {
      
      this.incluirDoc();
    } else {
        if (this.labelIncAlt === 'ALTERAR') {
          
          this.alterarDoc();
        }
    }
    this.docSubstituto = false;
  }

  incluirDoc() {
    this.loadService.show()
    if (this.docPara === 'PRC') {
      this.incluirDocProcesso();
    } else {
        if (this.docPara === 'CTR') {
          this.incluirDocContrato();
        } else {
          if (this.docPara === 'APSP' || this.docPara === 'APSC') {
            this.incluirDocApenso();
          } else {

          }
        }
      }
  }
  
  incluirDocProcesso() {
    this.service.incluirDocumento(this.processo.id, this.entidade).subscribe( () => {
     this.docIncluidoSucesso()
    }, error => {
      
      if (error.error.mensagem) {
        this.mensagem = error.error.mensagem;
      } else {
        this.mensagem = 'Situação inesperada: ' + error.message;
      }
      if (error.error.detalhe) {
        this.mensagem = this.mensagem + ' ' + error.error.detalhe
      }
      this.tipoMensagem = 'error';
      //this.atualizou = true;
      this.addMessageError(this.mensagem)
      this.loadService.hide()
    });
  }

  incluirDocContrato() {
    this.service.incluirDocumentoContrato(this.objeto.id, this.entidade).subscribe( () => {
      this.docIncluidoSucesso()
    }, error => {
      if (error.error.mensagem) {
        this.mensagem = error.error.mensagem;
      } else {
        this.mensagem = 'Situação inesperada: ' + error.message;
      }
      if (error.error.detalhe) {
        this.mensagem = this.mensagem + '\n' + error.error.detalhe
      }
      this.tipoMensagem = 'error';
      //this.atualizou = true;
      this.addMessageError(this.mensagem)
      this.loadService.hide()
    });
  }

  incluirDocApenso() {
    this.service.incluirDocumentoApenso(this.objeto.id, this.entidade).subscribe( () => {
      this.docIncluidoSucesso()
    }, error => {
      if (error.error.mensagem) {
        this.mensagem = error.error.mensagem;
      } else {
        this.mensagem = 'Situação inesperada: ' + error.message;
      }
      
      if (error.error.detalhe) {
          this.mensagem = this.mensagem + '\n' + error.error.detalhe
      }
      this.tipoMensagem = 'error';
      //this.atualizou = true;
      this.addMessageError(this.mensagem)
      this.loadService.hide()
    });
  }


  docIncluidoSucesso() {
    this.mensagem = 'Documento incluído com sucesso';
    //this.atualizou = true;
    
    this.tipoMensagem = 'success'
    this.limparImagem();
    this.processoRefresh();
    this.classificaDocs();
    this.loadService.hide();
    this.addMessageSuccess(this.mensagem)
  }

  alterarDoc() {
    this.entidadePatch = new PaeDocumentoPatch
    this.entidadePatch.valido = this.inativoSelecionado
    this.entidadePatch.confidencial = this.entidade.confidencial
    this.entidadePatch.atributos_documento = this.entidade.atributos_documento
    this.entidadePatch.codigo_integracao = this.entidade.codigo_integracao
    this.entidadePatch.confidencial = this.entidade.confidencial
    this.entidadePatch.origem_documento = this.entidade.origem_documento
    this.entidadePatch.tipo_documento = this.entidade.tipo_documento
    this.entidadePatch.descricao_documento = this.descDocumento
    this.entidadePatch.justificativa_substituicao = this.justificativaSubs
    
    this.loadService.show()
    this.service.alterarDocumento(this.idDocumento, this.entidadePatch).subscribe( () => {
      this.mensagem = 'Documento alterado com sucesso';
      this.tipoMensagem = 'success'
      //this.atualizou = true;
      
      this.limparImagem();
      this.processoRefresh();
      this.classificaDocs();
      this.loadService.hide()
      this.addMessageSuccess(this.mensagem)
    }, error => {
        this.exibeErro(error)
        this.loadService.hide()
    });
  }

 processoRefresh() {
    this.service.obterProcessoPorId(this.processo.id).subscribe( retorno => {
      this.processo = retorno;
      if(retorno.documentos) {
        this.documentos = retorno.documentos
      }
      this.atualizaTotais()
      if (this.docPara === 'PRC') {
        this.objeto = retorno;
        
      }
    });
    if (this.docPara === 'CTR')  {
      this.service.obterContratoPorId(this.objeto.id).subscribe( retorno => {
        this.objeto = retorno;
        if(retorno.documentos) {
          this.documentos = retorno.documentos
        }
        this.atualizaTotais()
        

      });
    } else {
        if (this.docPara === 'APSP' || this.docPara === 'APSC') {
          this.service.obterApensoPorId(this.objeto.id).subscribe( retorno => {
            this.objeto = retorno;
            if(retorno.documentos) {
              this.documentos = retorno.documentos
            }
            this.atualizaTotais()
            
          });
    
        }
    }
  }  

  atualizaTotais() {
    
    const x = {
      first: 0,
      rows: this.documentos.length
    }
    this.paginar(x)
  }

  downloadArquivo() {
    const canvas: any = document.querySelector('#' + this.docPara);
    if (canvas) {
      
        const dlnk:any  = document.querySelector('#dwnldLnk');
        const doc = 'data:application/pdf;base64,' + this.currentImage
        dlnk.href = doc;
        dlnk.download = this.idDocumento + '.pdf'
        dlnk.click();
    }
  }

  clickSubstituto() {
    if (!this.docSubstituto) {
      this.docsCadastrados = []
      if (this.objeto.documentos === undefined || this.objeto.documentos.length === 0) {
        return;
      }
      this.justSubs = true
      let k = 0
      
      for (let i = 0; i < this.objeto.documentos.length; i++) {
        
        if (this.objeto.documentos[i].documento_substituto == null) {
          const valor = new Combo;
          valor.label = this.objeto.documentos[i].id;
          valor.value = this.objeto.documentos[i].id;
          this.docsCadastrados[k] = valor;
          k++;
        }
      }
      if (this.docsCadastrados.length > 0) {
        this.docsCadastrados.sort((n1 , n2 ) : number => {
          if (n1.value < n2.value) return -1;
          if (n1.value > n2.value) return 1;
          return 0;
        });

        this.idDocSubstituicao = this.docsCadastrados[0].value;
      }
    } else {
      this.justSubs = false;
    } 
  }
  
  //changeSort(event) {
  // this.campoSort = 'id'
  //}

  mudouTipo() {
    if (this.tipoDocSelecionado === '-1') {
      this.tipoDocInvalido = true;
    } else {
      this.tipoDocInvalido = false;
    }
    
  }

  cancelarModal() {
    this.justDel = ''
  }

  deletarDocumento() {
    this.loadService.show();
    this.service.deletarDocumentoPorId(this.idDocumento, this.justDel).subscribe(() => {
      $('#excDisp').modal('toggle')
      this.limparImagem();
      this.processoRefresh();
      this.classificaDocs();
      this.justDel = '';
      this.mensagem = 'Documento de id = ' + this.idDocumento + ' excluído com sucesso';
      this.tipoMensagem = 'success'
      //this.atualizou = true
      this.addMessageSuccess(this.mensagem)
      
      this.loadService.hide();
    }, error => {
      $('#excDisp').modal('toggle')

      if (error.error.mensagem) {
        this.mensagem = error.error.mensagem;
      } else {
        this.mensagem = 'Situação inesperada: ' + error.message;
      }
      
      if (error.error.detalhe) {
        this.mensagem = this.mensagem + '\n' + error.error.detalhe
      }
      this.tipoMensagem = 'error'
      //this.atualizou = true
      this.addMessageError(this.mensagem)
      this.loadService.hide();
    });
  }

  exibeErro(error) {
    if (error.error.mensagem) {
      this.mensagem = error.error.mensagem;
    } else {
      this.mensagem = 'Situação inesperada: ' + error.message;
    }  

    if (error.error.detalhe) {
      this.mensagem = this.mensagem + '\n' + error.error.detalhe
    }
    this.tipoMensagem = 'error';
    this.addMessageError(this.mensagem)
    //this.atualizou = true;
  }

  paginar(event)  {
    this.objPaginar = event
    this.infoRegistros  = this.util.paginar(event, this.documentos.length)
  }
}
