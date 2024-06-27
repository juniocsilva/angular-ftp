import { Component, OnInit } from '@angular/core';
import { ConfirmDialogModule, ConfirmationService } from 'primeng/primeng';
import {Message} from 'primeng/components/common/api';
import { UtilService } from '../services/util.service';
import { EntidadeFtp } from '../model/entidade-ftp';
import { FtpService } from './ftp.service';
import { FileUploader } from 'ng2-file-upload';
import { LoaderService } from '../services';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';

declare var $: any;

@Component({
  selector: 'app-ftp',
  templateUrl: './ftp.component.html',
  styleUrls: ['./ftp.component.css']
})
export class FtpComponent implements OnInit {
  public uploader: FileUploader = new FileUploader(null);
  msgs: Message [] = [];
  entidade:  EntidadeFtp;
  itens: any = [];
  tituloModal: String = 'Inclusão de Arquivo';
  mensagem = '';
  tipoMensagem = 'success'
  exibirMensagem = false;
  nome_arquivo = '';
  mimetype = '';
  data_alteracao = '';
  tamanho_arquivo = '';
  conteudo_arquivo = '';
  nao_leu_arquivo = true;

  constructor(private service: FtpService,
    private loaderService: Ng4LoadingSpinnerService,
    private confirmationService: ConfirmationService,
    private utilService: UtilService) {

   }

  ngOnInit() {
    this.entidade = {}
    this.msgs = [];
    this.service.get().subscribe(dados => {
      if(dados.name) {
        this.exibirErro('Não foi possível obter os dados da API. Problemas de acesso ao Banco de dados');
        return;
      }
      this.itens = dados
    });
  }
  exibirErro(erro) {
    this.mensagem = erro
    this.tipoMensagem = 'error'
    this.exibirMensagem = true
  }
  limpaTela(form) {
    form.control.markAsPristine();
    form.control.markAsUntouched();

    this.tituloModal = 'Inclusão de Arquivo';
    this.msgs = [];
    this.mimetype = '';
    this.nome_arquivo = '';
    this.tamanho_arquivo = '';
    this.data_alteracao = '';
    this.nao_leu_arquivo = true;
    this.exibirMensagem = false

  }
  salvar(form) {
    this.entidade.nome_arquivo = this.nome_arquivo;
    this.entidade.data = this.data_alteracao;
    this.entidade.mimetype = this.mimetype;
    this.entidade.tamanho = this.tamanho_arquivo;
    this.entidade.arquivo = this.conteudo_arquivo
    this.loaderService.show();
    if (this.entidade.id == null) {
      this.service.save(this.entidade).subscribe( () => {

          this.limpaTela(form);

         
          this.service.get().subscribe(dados => {
            this.itens = dados
            $('#incluir').modal('toggle');
            this.loaderService.hide()
          });
          
      }, error => {
            this.loaderService.hide()
            $('#incluir').modal('toggle');
            this.exibirErro(error.message)
            
     });

    } else {
          this.service.update(this.entidade).subscribe( () => {
          this.service.get().subscribe(dados => {

            this.itens = dados
          this.limpaTela(form);
          this.loaderService.hide();
        }, error => {

        }
        );
        $('#incluir').modal('toggle');
      });
    }
  }

 
  alterar(dados) {
    this.tituloModal = 'Alteração de Arquivo';
    this.entidade = Object.assign({}, dados);
    
  }

  excluir(info, form) {

    this.confirmationService.confirm({
      message: 'Você confirma a exclusão deste Arquivo?',
      accept: () => {
        this.loaderService.show()
        this.service.delete(info.id).subscribe( () => {
          this.service.get().subscribe(dados => {
            this.itens = dados
            this.loaderService.hide()
          });
        });
      }
   });

  }

  download(dados) {
    this.loaderService.show()
    this.service.getById(dados.id).subscribe( result => {
      this.loaderService.hide()
      if (result) {
        
        const dlnk:any  = document.querySelector('#dwnldLnk');
        const original = result[0].arquivo.split(',')
        const doc =  'data:application/octet-stream; base64,' + original[1]
        
        dlnk.href = doc;
        dlnk.download = result[0].nome_arquivo
        dlnk.click();
      }
    });
  }

  abrirModal(form) {
    this.limpaTela(form);

  }

  exibeMensagem(severidade, sumario, detalhe) {
    this.msgs = [];
    this.msgs.push({severity: severidade, summary: sumario, detail: detalhe});
  }

  fileChanged(evt) {
    
    const files = evt.target.files;
    this.exibirMensagem = false;
    
    for (let i = 0, f; f = files[i]; i++) {
      
    
      const reader = new FileReader();
      this.loaderService.show()
      reader.onload = () => {
          //this.documentos = this.objeto.documentos
          
          const dados = reader.result.toString();
          this.conteudo_arquivo = dados;
          
          this.nome_arquivo = files[0].name
          this.data_alteracao = new Date(files[0].lastModified).toString();
          this.tamanho_arquivo = files[0].size
          this.loaderService.hide();
          if (Number(this.tamanho_arquivo) > 50000000) {
             this.exibirErro('O tamanho do arquivo deve ser no máximo 50 MB')
             $('#incluir').modal('toggle');
          }
          const info = dados.split(',')
          this.mimetype = info[0]
          this.nao_leu_arquivo = false;

      };
  
      reader.readAsDataURL(f)
      
    }
  }

  insertDocuments(input) {
    if (input) {
     
      input.click();
    }
  }
}
