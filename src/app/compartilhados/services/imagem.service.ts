import { Injectable } from "../../../../node_modules/@angular/core";
import { FileUploader } from "ng2-file-upload";
import * as PDFJS from 'pdfjs-dist/build/pdf';
@Injectable({
    providedIn: 'root'
})
export class ImagemService {
    atualizou = false;
    mensagem = ''
    tipoMensagem = 'success'
    uploader: FileUploader = new FileUploader(null);
    currentImage;
    URLImage: string;
    mime_type = '';
    
   
    saidaB64: string;
    
  
    useBase64 = false;
    larguraTabela = 'col-md-6 row'
    title;
    divCanvas;
    showPrevious = false;
    showNext = false;
    diminuiu = true;
    
    exibirImg = false;
    ehPdf = false;
    paginaCorrente = 1;
    paginaFinal: number;
    paginasPdf: any = [];
    thumbs: any = [];
    
    pdfCarregado;
    labelIncAlt = 'Incluir'
    categorizar = true;  
    atributos: any = [];
  
  
  
    objTiposDocumento: any = [];
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
    itensDisplay = 10
    indexTipoDoc = 0;
    tipoDocInvalido = true;
    justDel = '';
    excDisplay = false

    consisteTipoArquivo(arquivo) {
        const dados = arquivo.name.split('.');
        const tipo = dados[dados.length - 1];
        if (tipo !== 'pdf' && tipo !== 'jpg') {
            return false;
        } else {
            return true;
        }
    
    }

    limparImagem(nomeCanvas) {
        this.tipoDocInvalido = true;
        this.currentImage = null;
        this.diminuiu = true;
        this.larguraTabela =  'col-md-6 row'
        const canvas: any = document.querySelector('#' + nomeCanvas);
        if (canvas) {
            const cContext = canvas.getContext('2d');
            cContext.clearRect(0, 0, canvas.width, canvas.height);
        }
        this.exibirImg = false;
        this.paginasPdf = [];
        this.paginaCorrente = 1
        this.atualizou = false;
        this.labelIncAlt = 'Incluir'
        this.descDocumento = ''
        
    }

     processaPdf(dataB, nomeCanvas, escalaImg, rotacaoImg): Promise<any> {
   
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
                   this.exibirPaginaPdf(this.paginasPdf[this.paginaCorrente], nomeCanvas, escalaImg, rotacaoImg)
                 }
             })
           }
         });
     }
      
      exibirPaginaPdf(page, nomeCanvas, escalaImg, rotacaoImg) {
    
        const scale = escalaImg;
        const viewport = page.getViewport(scale, rotacaoImg);
    
        const canvas: any = document.querySelector('#' + nomeCanvas);
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

      drawImage(imagem, docPara, escalaImg, rotacaoImg) {
        
        this.ehPdf = false;
        this.useBase64 = true;
        //escalaImg = 0.4
        const uri = {
          url: imagem,
          rotacao: rotacaoImg,
          escala: escalaImg
    
        }
        if (uri != null) {
          let url = '';
          let rotacao = 0;
          const escala = escalaImg
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
          const canvas: any = document.querySelector('#' + docPara);
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

      zoomUp(imagem, docPara, escalaImg, rotacaoImg) {
        let max = 0;
        if (this.ehPdf) {
          max = 1.4
        } else {
            max = 1.2
          }
        escalaImg += 0.1;
        if (escalaImg > max) {
            escalaImg = max;
        } else {
    
          }
        const img = {
          url: this.currentImage,
          rotacao: rotacaoImg,
          escala: escalaImg
        };
        if (this.ehPdf) {
          
          //this.exibirPaginaPdf(this.paginasPdf[this.paginaCorrente])
        } else {
            this.drawImage(imagem, docPara, escalaImg, rotacaoImg);
            return {
                escalaImg: escalaImg,
                rotacaoImg: rotacaoImg
            }
          }
      }
    
      zoomDown(imagem, docPara, escalaImg, rotacaoImg) {
        let min = 0;
        if (this.ehPdf) {
          min = 0.6
        } else {
            min = 0.4
          }
        escalaImg -= 0.1;
        if (escalaImg < min) {
            escalaImg = min;
        }
        const img = {
          url: this.currentImage,
          rotacao: rotacaoImg,
          escala: escalaImg
        };
        if (this.ehPdf) {
          //this.exibirPaginaPdf(this.paginasPdf[this.paginaCorrente])
        } else {
           
            this.drawImage(imagem, docPara, escalaImg, rotacaoImg);
            return {
                escalaImg: escalaImg,
                rotacaoImg: rotacaoImg
            }
          }
      }

   
      
    turnRight(imagem, docPara, escalaImg, rotacaoImg) {
        rotacaoImg += 90;
        if (rotacaoImg >= 360) {
            rotacaoImg = 0;
        }
    
        const img = {
            url: imagem,
            rotacao: rotacaoImg,
            escala: escalaImg
        };
        if (this.ehPdf) {
            //this.exibirPaginaPdf(this.paginasPdf[this.paginaCorrente])
        } else {
            this.drawImage(imagem, docPara, escalaImg, rotacaoImg);
            return {
                escalaImg: escalaImg,
                rotacaoImg: rotacaoImg
            }
        }
    
    }

    turnLeft(imagem, docPara, escalaImg, rotacaoImg) {
        rotacaoImg -= 90;
        if (rotacaoImg <= -90) {
            rotacaoImg = 270;
        }
    
        const img = {
            url: imagem,
            rotacao: rotacaoImg,
            escala: escalaImg
        };
        if (this.ehPdf) {
            //this.exibirPaginaPdf(this.paginasPdf[this.paginaCorrente])
        } else {
            this.drawImage(imagem, docPara, escalaImg, rotacaoImg);
            return {
                escalaImg: escalaImg,
                rotacaoImg: rotacaoImg
            }
        }
    
    }

    showDefault(imagem, docPara, escalaImg, rotacaoImg) {
        this.categorizar = true;
        if (this.ehPdf) {
            escalaImg = 0.7;
        } else {
            escalaImg = 0.4;
        }
        rotacaoImg = 0;
        this.diminuiu = true
        this.larguraTabela = 'col-md-6 row'
        const img = {
        url: imagem,
        rotacao: rotacaoImg,
        escala: escalaImg
        };
        if (this.ehPdf) {
        //this.exibirPaginaPdf(this.paginasPdf[this.paginaCorrente])
        } else {
            this.drawImage(imagem, docPara, escalaImg, rotacaoImg);
            return {
                escalaImg: escalaImg,
                rotacaoImg: rotacaoImg
            }
        }
    }

   
    
}