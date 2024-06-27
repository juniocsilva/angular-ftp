export class Utils {
    public validaCpfCnpj (numero) {
        
        const cpfCnpj = numero
        const exp = /\D/g
        const valor = cpfCnpj.toString().replace( exp, '' );
        
        if (valor.length <= 11) {
            return this.validarCPF(valor)
        } else {
            return this.validarCNPJ(valor);
        }
        
    }

    private validarCPF(cpf) {
        
        cpf = cpf.replace(/[^\d]+/g,'');
        if (cpf.length !== 11 ||
            cpf === '00000000000' ||
            cpf === '11111111111' ||
            cpf === '22222222222' ||
            cpf === '33333333333' ||
            cpf === '44444444444' ||
            cpf === '55555555555' ||
            cpf === '66666666666' ||
            cpf === '77777777777' ||
            cpf === '88888888888' ||
            cpf === '99999999999')
            return false;

        let add = 0;

        for (let i = 0; i< 9; i++) {
                add += cpf.charAt(i) * (10 - i);
        }
        let rev = 11 - (add % 11);
        
        if (rev === 10 || rev === 11)
            rev = 0;
        if (rev.toString() !== cpf.charAt(9))
            return false;
        
        add = 0;
        for (let i = 0; i < 10; i++) {
            add += cpf.charAt(i) * (11 - i);
                }
        rev = 11 - (add % 11);
        if (rev === 10 || rev === 11)
            rev = 0;
        if (rev.toString() !== cpf.charAt(10))
            return false;
        
        
        return true;        
    }

    private validarCNPJ(cnpj) {
        cnpj = cnpj.replace(/[^\d]+/g,'');
 
        if(cnpj === '') return false;
         
        if (cnpj.length !== 14)
            return false;
     
        // Elimina CNPJs invalidos conhecidos
        if (cnpj === '00000000000000' || 
            cnpj === '11111111111111' || 
            cnpj === '22222222222222' || 
            cnpj === '33333333333333' || 
            cnpj === '44444444444444' || 
            cnpj === '55555555555555' || 
            cnpj === '66666666666666' || 
            cnpj === '77777777777777' || 
            cnpj === '88888888888888' || 
            cnpj === '99999999999999')
            return false;
             
        // Valida DVs
        let tamanho = cnpj.length - 2
        let numeros = cnpj.substring(0,tamanho);
        const digitos = cnpj.substring(tamanho);
        let soma = 0;
        let pos = tamanho - 7;
        for (let i = tamanho; i >= 1; i--) {
          soma += numeros.charAt(tamanho - i) * pos--;
          if (pos < 2)
                pos = 9;
        }
        let resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
        if (resultado.toString() !== digitos.charAt(0))
            return false;
             
        tamanho = tamanho + 1;
        numeros = cnpj.substring(0,tamanho);
        soma = 0;
        pos = tamanho - 7;
        for (let i = tamanho; i >= 1; i--) {
          soma += numeros.charAt(tamanho - i) * pos--;
          if (pos < 2)
                pos = 9;
        }
        resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
        if (resultado.toString() !== digitos.charAt(1))
              return false;
               
        return true;
    }

    checkDate(pObj) {
        
         var expReg = /^(((0[1-9]|[12]\d|3[01])\/(0[13578]|1[02])\/((19|[2-9]\d)\d{2}))|((0[1-9]|[12]\d|30)\/(0[13456789]|1[012])\/((19|[2-9]\d)\d{2}))|((0[1-9]|1\d|2[0-8])\/02\/((19|[2-9]\d)\d{2}))|(29\/02\/((1[6-9]|[2-9]\d)(0[48]|[2468][048]|[13579][26])|((16|[2468][048]|[3579][26])00))))$/g;
        //var expReg = /^((0[1-9]|[12]\d)\/(0[1-9]|1[0-2])|30\/(0[13-9]|1[0-2])|31\/(0[13578]|1[02]))\/(19|20)?\d{2}$/;
        var aRet = true;
        if ((pObj) && (pObj.match(expReg)) && (pObj != '')) {
          var dia = pObj.substring(0,2);
          var mes = pObj.substring(3,5);
          var ano = pObj.substring(6,10);
          if ((mes == 4 || mes == 6 || mes == 9 || mes == 11) && dia > 30) {
            aRet = false;
          } else { 
                if ((ano % 4) != 0 && mes == 2 && dia > 28) {
                    aRet = false;
                } else {
                    if ((ano%4) == 0 && mes == 2 && dia > 29) {
                        aRet = false;
                    }
                }
          }
        }  else {
            aRet = false;  
        }
          
        return aRet;
        
      }

     getRandomIntInclusive(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
      } 
}


