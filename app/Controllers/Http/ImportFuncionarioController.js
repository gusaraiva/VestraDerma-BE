'use strict'

const Person = use('App/Models/Person')
const Associado = use('App/Models/Associado')
const Database = use('Database')
const Constants = use('App/Constants/Constants')
const fs = require('fs')
const Helpers = use('Helpers')
const excelToJson = require('convert-excel-to-json');
const { validate } =require('gerador-validador-cpf')

class ImportFuncionarioController {

  async uploadfuncs({ response }) {
    const fileName = 'IMPORTACAO_PESSOAS.xlsx'

    if (!fs.existsSync(fileName)) {
      console.log('Arquivo Encontrado')
    } else {
      console.log('Arquivo não Encontrado')
    }

    return response.attachment(Helpers.publicPath(`${fileName}`),
      'IMPORTACAO_PESSOAS.xlsx'
    )
  }


  async store({ request, response }) {
    try {
      const fileFuncs = request.file('file', {
        size: '2mb'
      })
      const empresa_id = request.input('empresa')

      const fileName = `${Date.now()}.xlsx`

      if (!fileFuncs) {
        return response
          .status(400)
          .send({ error: { message: 'O Arquivo não veio ou está corrompido' } })
      }

      await fileFuncs.move(Helpers.tmpPath('funcionarios'), {
        name: fileName
      })

      if (!fileFuncs.moved()) {
        return fileFuncs.error()
      } else {
        console.log('File moved')
      }
      
      
      const Empresa = await Person.findByOrFail('id', empresa_id)

     


      
      const results = excelToJson({
        sourceFile: Helpers.tmpPath(`funcionarios/${fileName}`),
        columnToKey: {
          '*': '{{columnHeader}}'
        },
        sheets: ['Funcionarios']
      })
      
      const data = results.Funcionarios
      const cpfInvalidos = []
      const novosFuncionarios = []
      const funcionariosExistentes = []
      const funcionariosComErros = []
      const funcionariosAssociados = []
      const associados = []
      const associacaoExistente = []
      
      for (var pos = 1; pos < data.length; pos++) {
        //validar CPF
        const cpf = data[pos].CPF.replace(/[^\d]/g, "")
        const validated = validate(cpf)  
        
        if (!validated) {
          cpfInvalidos.push(`${cpf} Inválido`)
        }

        if (!data[pos].NOME || data[pos].NOME.size==0){
          funcionariosComErros.push(`${data[pos].NOME}  (${data[pos].CPF}) com Nome inválido`)        
        }
        
        if (!data[pos].NASCIMENTO ){
          funcionariosComErros.push(`${data[pos].NOME}  (${data[pos].CPF}) com Data de Nascimento inválida`)          
        }

        if (!data[pos].EMAIL || data[pos].EMAIL.length==0 || data[pos].EMAIL.indexOf('@')==-1){
          funcionariosComErros.push(`${data[pos].NOME}  (${data[pos].CPF}) com e-mail inválido`)         
        }

        if (!data[pos].SEXO ||  (data[pos].SEXO!='M' && data[pos].SEXO!='F')){
          console.log('data[pos].SEXO->',data[pos].SEXO)
          funcionariosComErros.push(`${data[pos].NOME}  (${data[pos].CPF}) Campo Sexo precisa ser preenchido com M ou F`)
        }

        if (!data[pos].ETNIA ||  (data[pos].ETNIA!='amarela' && data[pos].ETNIA!='branca' && data[pos].ETNIA!='indigena' && data[pos].ETNIA!='parda' && data[pos].ETNIA!='negra')){
          console.log('data[pos].ETNIA->',data[pos].ETNIA)
          funcionariosComErros.push(`${data[pos].NOME}  (${data[pos].ETNIA}) Campos deve ser Preenchido com as raças amarela, branca, indigena, parda, negra`)
        }

        if (!data[pos].PROFISSIONALSAUDE ||  (data[pos].PROFISSIONALSAUDE!='S' && data[pos].PROFISSIONALSAUDE!='N')){
          console.log('data[pos].PROFISSIONALSAUDE->',data[pos].PROFISSIONALSAUDE)
          funcionariosComErros.push(`${data[pos].NOME}  (${data[pos].CPF}) Campo PROFISSIONALSAUDE precisa ser preenchido com S ou N (Sim ou Não)`)
        }

        if (!data[pos].PROFISSIONALSEGURANCA ||  (data[pos].PROFISSIONALSEGURANCA!='S' && data[pos].PROFISSIONALSEGURANCA!='N')){
          console.log('data[pos].PROFISSIONALSEGURANCA->',data[pos].PROFISSIONALSEGURANCA)
          funcionariosComErros.push(`${data[pos].NOME}  (${data[pos].CPF}) Campo PROFISSIONALSEGURANCA precisa ser preenchido comS ou N (Sim ou Não)`)
        }

        if (!data[pos].PDRESPCRONICA ||  (data[pos].PDRESPCRONICA!='S' && data[pos].PDRESPCRONICA!='N')){
          console.log('data[pos].PDRESPCRONICA->',data[pos].PDRESPCRONICA)
          funcionariosComErros.push(`${data[pos].NOME}  (${data[pos].CPF}) Campo PDRESPCRONICA precisa ser preenchido com S ou N (Sim ou Não)`)
        }

        if (data[pos].PDRESPCRONICA=='S' && (!data[pos].DRESPCRONICA || data[pos].DRESPCRONICA.size==0)){
          funcionariosComErros.push(`${data[pos].NOME}  (${data[pos].CPF}) com DRESPCRONICA inválido`)
        }

        if (!data[pos].PDCROMOSSOMICA ||  (data[pos].PDCROMOSSOMICA!='S' && data[pos].PDCROMOSSOMICA!='N')){
          console.log('data[pos].PDCROMOSSOMICA->',data[pos].PDCROMOSSOMICA)
          funcionariosComErros.push(`${data[pos].NOME}  (${data[pos].CPF}) Campo PDCROMOSSOMICA precisa ser preenchido com S ou N (Sim ou Não)`)
        }

        if (data[pos].PDCROMOSSOMICA=='S' && (!data[pos].DCROMOSSOMICA || data[pos].DCROMOSSOMICA.size==0)){
          funcionariosComErros.push(`${data[pos].NOME}  (${data[pos].CPF}) com DCROMOSSOMICA inválido`)
        }

        if (!data[pos].IMUNOSSUPRESSAO ||  (data[pos].IMUNOSSUPRESSAO!='S' && data[pos].IMUNOSSUPRESSAO!='N')){
          console.log('data[pos].IMUNOSSUPRESSAO->',data[pos].IMUNOSSUPRESSAO)
          funcionariosComErros.push(`${data[pos].NOME}  (${data[pos].CPF}) Campo IMUNOSSUPRESSAO precisa ser preenchido com S ou N (Sim ou Não)`)
        }

        if (!data[pos].PDCARDIACA ||  (data[pos].PDCARDIACA!='S' && data[pos].PDCARDIACA!='N')){
          console.log('data[pos].PDCARDIACA->',data[pos].PDCARDIACA)
          funcionariosComErros.push(`${data[pos].NOME}  (${data[pos].CPF}) Campo PDCARDIACA precisa ser preenchido com S ou N (Sim ou Não)`)
        }

        if (data[pos].PDCARDIACA=='S' && (!data[pos].DCARDIACA || data[pos].DCARDIACA.size==0)){
          funcionariosComErros.push(`${data[pos].NOME}  (${data[pos].CPF}) com DCARDIACA inválido`)
        }

        if (!data[pos].GESTANTE ||  (data[pos].GESTANTE!='S' && data[pos].GESTANTE!='N')){
          console.log('data[pos].GESTANTE->',data[pos].GESTANTE)
          funcionariosComErros.push(`${data[pos].NOME}  (${data[pos].CPF}) Campo GESTANTE precisa ser preenchido com S ou N (Sim ou Não)`)
        }
        
        if (data[pos].GESTANTE=='S' && (!data[pos].TEMPOGESTACAO || data[pos].TEMPOGESTACAO.size==0 || !isNaN(data[pos].TEMPOGESTACAO))){
          funcionariosComErros.push(`${data[pos].NOME}  (${data[pos].CPF}) com TEMPOGESTACAO inválido`)
        }

        if (!data[pos].OBESIDADE ||  (data[pos].OBESIDADE!='S' && data[pos].OBESIDADE!='N')){
          console.log('data[pos].OBESIDADE->',data[pos].OBESIDADE)
          funcionariosComErros.push(`${data[pos].NOME}  (${data[pos].CPF}) Campo OBESIDADE precisa ser preenchido com S ou N (Sim ou Não)`)
        }

        if (!data[pos].PDRENALCRONICA ||  (data[pos].PDRENALCRONICA!='S' && data[pos].PDRENALCRONICA!='N')){
          console.log('data[pos].PDRENALCRONICA->',data[pos].PDRENALCRONICA)
          funcionariosComErros.push(`${data[pos].NOME}  (${data[pos].CPF}) Campo PDRENALCRONICA precisa ser preenchido com S ou N (Sim ou Não)`)
        }

        if (data[pos].PDRENALCRONICA=='S' && (!data[pos].DRENALCRONICA || data[pos].DRENALCRONICA.size==0)){
          funcionariosComErros.push(`${data[pos].NOME}  (${data[pos].CPF}) com DRENALCRONICA inválido`)    
        }

        if (!data[pos].CEP || data[pos].CEP.size==0){
          funcionariosComErros.push(`${data[pos].NOME}  (${data[pos].CPF}) com CEP inválido`)
        }

        if (!data[pos].LOGRADOURO || data[pos].LOGRADOURO.size==0){
          funcionariosComErros.push(`${data[pos].NOME}  (${data[pos].CPF}) com LOGRADOURO inválido`)
        }

        if (!data[pos].NUMERO || data[pos].NUMERO.size==0){
          funcionariosComErros.push(`${data[pos].NOME}  (${data[pos].CPF}) com NUMERO inválido`)
        }

        if (!data[pos].BAIRRO || data[pos].BAIRRO.size==0){
          funcionariosComErros.push(`${data[pos].NOME}  (${data[pos].CPF}) com BAIRRO inválido`)
        }

        if (!data[pos].CIDADE || data[pos].CIDADE.size==0){
          funcionariosComErros.push(`${data[pos].NOME}  (${data[pos].CPF}) com CIDADE inválido`)
        }

        if (!data[pos].UF || data[pos].UF.size==0){
          funcionariosComErros.push(`${data[pos].NOME}  (${data[pos].CPF}) com UF inválido`)
        }

        let personaB = await Person.findBy('doc', cpf)
        
        let persona
          if (!personaB && validated) {
            console.log('Cadastro funcionario', data[pos].NOME)
            persona = await Person.create({
              nome: data[pos].NOME,
              doc: cpf,
              birth_date: data[pos].NASCIMENTO,
              email: data[pos].EMAIL,
              contato1: data[pos].CONTATO,
              raca: data[pos].ETNIA,
              sexo: data[pos].SEXO == 'M' ? 'masculino' : 'feminino',
              psaude: data[pos].PROFISSIONALSAUDE == 'S' ? true : false,
              pseg: data[pos].PROFISSIONALSEGURANCA == 'S' ? true : false,
              cep: data[pos].CEP,
              logradouro: data[pos].LOGRADOURO,
              numero: data[pos].NUMERO,
              complemento: data[pos].COMPLEMENTO,
              bairro: data[pos].BAIRRO,
              cidade: data[pos].CIDADE,
              uf: data[pos].UF,
              pdrespcronica: data[pos].PDRESPCRONICA == 'S' ? true : false,
              drespcronica: data[pos].DRESPCRONICA ,
              pdcromossomica: data[pos].PDCROMOSSOMICA == 'S' ? true : false,
              dcromossomica: data[pos].DCROMOSSOMICA ,
              diabetes: data[pos].DIABETES == 'S' ? true : false,
              imunossupressao: data[pos].IMUNOSSUPRESSAO == 'S' ? true : false,
              pdcardiaca: data[pos].PDCARDIACA== 'S' ? true : false,
              dcardiaca: data[pos].DCARDIACA,
              gestanterisco: data[pos].GESTANTE== 'S' ? true : false,
              tempogestacao: data[pos].GESTANTE== 'S'? data[pos].TEMPOGESTACAO: 0,
              obesidade: data[pos].OBESIDADE == 'S' ? true : false,
              pdrenalcronica: data[pos].PDRENALCRONICA== 'S' ? true : false,
              drenalcronica: data[pos].DRENALCRONICA,
              typePaciente: Constants.typePaciente,
            })
            novosFuncionarios.push(persona.nome)
          } 

          if(!personaB && !validated) {
            console.log('CPFs Invalidos' + cpfInvalidos)
          } else {
            persona = personaB
            funcionariosExistentes.push(persona.nome) 

          //console.log('persona ', JSON.stringify(persona))
          const associeted = await Database
            .table('associados')
            .where('id_pessoa', empresa_id)
            .andWhere('id_associado', persona.id)  

          if (associeted) {
            console.log('Associação Existente')
            associados.push(persona.nome) 
          } else {
            console.log('Associar')
            const associacao = await Associado.create({
              id_pessoa: empresa_id ,
              id_associado: persona.id
            })
              funcionariosAssociados.push(persona.nome)           
          }
        }
      }
      console.log('CPFs Invalidos' + cpfInvalidos)
      console.log('Funcionarios adicionados ' + novosFuncionarios)
      console.log('Funcionarios já cadastrados ' + funcionariosExistentes)
      console.log('Funcionarios já associados ' + associados)
      console.log('funcionariosComErros ' + funcionariosComErros)
      console.log('funcionariosAssociados ' + funcionariosAssociados)
      console.log('associacaoExistente ' + associacaoExistente)
      

      const obj = {}
      obj.novosFuncionarios = novosFuncionarios
      obj.funcionariosExistentes = funcionariosExistentes
      obj.funcionariosComErros = funcionariosComErros
      obj.cpfInvalidos = cpfInvalidos
      obj.associados = associados
      obj.funcionariosAssociados = funcionariosAssociados
      return obj

    } catch (err) {
      console.log(err)
      return response
        .status(400)
        .send({ error: { message: err } })
    }

  }
}

module.exports = ImportFuncionarioController
