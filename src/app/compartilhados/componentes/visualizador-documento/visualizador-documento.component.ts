import {
  Component,
  ViewEncapsulation,
  Input,
  ElementRef,
  ViewChild,
  EventEmitter,
  Output
} from '@angular/core';

import { ApplicationService, LoaderService  } from './../../../services/index';
import * as PDFJS from 'pdfjs-dist/build/pdf';

declare var $: any;

@Component({
  selector: 'visualizador-documento',
  templateUrl: './visualizador-documento.component.html',
  styleUrls: ['./visualizador-documento.component.css'],
  encapsulation: ViewEncapsulation.None
  
})
export class VisualizadorDocumentoComponent {
  @Input() binario: any
  @Input() mimeType: any;
  @Input() alturaMaxima: any = '515px';
  @Input() comprimentoMaximo: any = '800px';
  @Output() erro: EventEmitter<any> = new EventEmitter<any>();

  currentImage;
  URLImage: string;
  useBase64 = false;
  rotacaoImg = 0;
  escalaImg = 0.5;
  exibirImg = false;
  ehPdf = false;
  paginaCorrente = 1;
  paginaFinal: number;
  paginasPdf: any = [];
  pdfCarregado;
  docPara = 'canvasDoc'
  erroImagem = false

  constructor() {
    
  }
  
  // tslint:disable-next-line:use-life-cycle-interface
  ngOnChanges() {
    this.erroImagem = false
    if (this.binario == null || this.binario == undefined || this.binario == '') {
      this.erroImagem = true
    }
    if (this.binario.length == 0) {
        this.binario = 
        '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'
      } 
      
      this.exibirDocumento()
      
  }
 

  exibirDocumento (){
    
    this.rotacaoImg = 0;
    
    if(this.mimeType == 'application/pdf' && !this.erroImagem)  {
      const dataB = atob(this.binario)
      const ret = this.processaPdf(dataB)
    
        this.currentImage = this.binario
        this.ehPdf = true;
        this.useBase64 = false;
        this.escalaImg = 0.5
        
    } else {
          this.currentImage = 'data:' + this.mimeType +';base64,' + this.binario
          this.ehPdf = false;
          this.useBase64 = true;
          this.escalaImg = 0.5
          this.drawImage()
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
      min = 0.5
    } else {
        min = 0.5
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
    
    if (this.ehPdf) {
      this.escalaImg = 0.5;
    } else {
        this.escalaImg = 0.5;
    }
    this.rotacaoImg = 0;
    
    
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
    this.currentImage = null;
    
    
    this.limparCanvas()
    this.exibirImg = false;
    this.escalaImg = 0.5;
    this.paginasPdf = [];
    this.paginaCorrente = 1
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
      this.exibirImg = true
    });
    
  }

  cancelarOperacao(form) {
    this.limparImagem()
  }

  exibeErro(error) {
    this.erro.emit(error)
  }

}
