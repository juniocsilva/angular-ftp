export interface DocumentoPost 
{
    codigo_controle: string,
    tipo_documento: {
      id: number,
      nome: string,
      atributos_documento: [
        {
          nome_negocial: string,
          nome_retorno: string,
          indicador_extracao: boolean,
          indicador_obrigatorio: boolean,
          tipo_campo: string
        }
      ]
    },
    executa_classificacao: boolean,
    executa_extracao: boolean,
    executa_autenticidade: boolean,
    formato_conteudo: string,
    mimetype: string,
    binario: string,
    atributos: any

  }