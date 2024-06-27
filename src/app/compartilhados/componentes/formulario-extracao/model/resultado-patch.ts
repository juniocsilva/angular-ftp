export interface ResultadoPatch
{
    codigo_fornecedor?: string,
    tipo_documento?: number,
    mimetype?: string,
    indice_avaliacao_autenticidade?: 0,
    codigo_rejeicao?: string,
    descricao_rejeicao?: string,
    conteudo?: string,
    atributos: any[]
  }