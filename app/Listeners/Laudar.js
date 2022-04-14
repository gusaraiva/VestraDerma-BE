'use strict'

const Exame = use('App/Models/Exame')
const Person = use('App/Models/Person')
const File = use('App/Models/File')
const Venda = use('App/Models/Venda')
const Teste = use('App/Models/Teste')
const Helpers = use('Helpers')
const Env = use('Env')

const dayjs = require('dayjs')
const pdf = require('html-pdf')
const ejs = require('ejs')
const path = require('path')
const {pdfCreate} = require('../utils/createPdf')


const Laudar = exports = module.exports = {}

Laudar.create = async (id) => {
  const exam = await Exame.findByOrFail('id', id)
 
  const laudo_id = exam.id
  const paciente = await Person.findByOrFail('id', exam.paciente_id)
  const respLab = await Person.findByOrFail('id', exam.respLab_id)
  const lab = await Person.findByOrFail('id', exam.lab_id)
  
  const respLabAss = await File.findByOrFail('person_id', exam.respLab_id)
  const labAss = await File.findByOrFail('person_id', exam.lab_id)
  const teste = await Teste.findByOrFail('id', exam.teste_id)
  const coletador = await Person.findByOrFail('id', exam.coletador_id)
  const venda = await Venda.findByOrFail('id', exam.venda_id)
  const compr = await Person.findByOrFail('id', venda.comprador_id)
  
  const paciente_id = exam.paciente_id
  const paciente_email = paciente.email
  const paciente_nome = paciente.nome
  const paciente_doc = paciente.doc
  let nomepdf = ''
  let paciente_sexo
  if (paciente.sexo === '1') {
    paciente_sexo = 'Masculino'
  } else if (paciente.sexo === '0') {
    paciente_sexo = 'Feminino'
  }
  const paciente_birth = dayjs(paciente.birth_date).format('DD/MM/YYYY')

  // Coleta Exame
  const dataColeta = dayjs(exam.dataColeta).format('DD/MM/YYYY')

  // Coletador
  const coletadorNome = coletador.nome
  const docColetador = coletador.codProfissao

  // Teste Exame
  const lote_teste = exam.loteExame
  //const dataValidadeExame = dayjs(exam.dataValidadeExame).format('DD/MM/YYYY')
  const dataResultado = dayjs(exam.dataResultado).format('DD/MM/YYYY - HH:mm')
  const resultadoText = exam.resultadoText
  // Dados do Teste
  const tipo_amostra = teste.tipoAmostra
  const metodo = teste.metodo
  const equipamento = teste.equipamento
  const nomeTeste = teste.nomeComercial
  const analiseResultado = teste.analiseResultado
  const orientacoes = teste.orientacoes
  const sobreTeste = teste.sobreTeste

  // Responsavel Laboratotio (Analista)
  const respLabNome = respLab.nome
  const respLabDocTecnico = respLab.codProfissao
  const respLabEmail = respLab.email
  const fileRespLabAss = respLabAss.file

  console.log(fileRespLabAss)

  // Laboratorio
  const labNome = lab.razaoSocial
  const labDoc = lab.doc
  const labTecnico = lab.tecnico
  const labDocTecnico = lab.docTecnico
  const fileLabAss = labAss.file
  const pathImages = Helpers.publicPath('uploads/')

  
  const parameters = {
    laudo_id,
    pathImages,
    paciente_id,
    paciente_nome,
    paciente_doc,
    paciente_email,
    paciente_sexo,
    paciente_birth,
    coletadorNome,
    docColetador,
    dataColeta,
    lote_teste,      
    dataResultado,
    resultadoText,
    nomeTeste,
    analiseResultado,
    orientacoes,
    sobreTeste,
    tipo_amostra,
    respLabNome,
    respLabDocTecnico,
    respLabEmail,
    fileRespLabAss,
    labNome,
    labDoc,
    labTecnico,
    labDocTecnico,
    fileLabAss,
    metodo,
    equipamento
  }
  console.log('pdfCreate') 
   let htmlRet = ''    
  try {     
    await ejs.renderFile(path.join(__dirname, '..', '..', 'resources', 'views', 'laudos.ejs'), parameters, {}, async (err, html) => {
      if (err) {
        console.log(`${laudo_id} -> erro ao criar html `, err);
       
      } else {
        htmlRet = html
      }
    })
  } catch(err) {
    console.log(err)
  }
  const idPdf = await pdfCreate(exam.id, htmlRet)

  console.log('testePdf',idPdf)
   
    
    const newlaudo = `${Env.get('APP_URL')}/files/${idPdf}`
    
    exam.merge({ fileLaudo: newlaudo, pdfCreate: true })

    const saveExame = await exam.save()    

    return saveExame
}
