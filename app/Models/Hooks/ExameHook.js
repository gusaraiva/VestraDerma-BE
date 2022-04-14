'use strict'

const Person = use('App/Models/Person')
const Teste = use('App/Models/Teste')
const File = use('App/Models/File')
const Venda = use('App/Models/Venda')
const Revenda = use('App/Models/Revenda')
const Env = use('Env')
const axios = require('axios')
const SendEmail = use('App/Models/SendEmail')

const Helpers = use('Helpers')
const dayjs = require('dayjs')
const pdf = require('html-pdf')
const ejs = require('ejs')
const path = require('path')

const Kue = use('Kue')
const Job = use('App/Jobs/EnviaEmailLaudo')

const priority = 'high'
const attempts = 5
const remove = false

const ExameHook = exports = module.exports = {}

ExameHook.enviaLaudo = async (exameInstance) => {
  const pathImages = Helpers.publicPath('uploads/')
  const coleta = dayjs(Date.now() ).format('DD/MM/YYYY HH:mm')

  if (exameInstance.dirty.status === 4) {
    const laudo_id = exameInstance.id
    console.log(`Logs-Laudo[${laudo_id}][ExameHook-update]->iniciou o hook`);

    const paciente = await Person.findByOrFail('id', exameInstance.paciente_id)
    
    const respLab = await Person.findByOrFail('id', exameInstance.respLab_id)
    const lab = await Person.findByOrFail('id', exameInstance.lab_id)

    const respLabAss = await File.findByOrFail('person_id', exameInstance.respLab_id)
    const labAss = await File.findByOrFail('person_id', exameInstance.lab_id)
    const teste = await Teste.findByOrFail('id', exameInstance.teste_id)
    const coletador = await Person.findByOrFail('id', exameInstance.coletador_id)
    const venda = await Venda.findByOrFail('id', exameInstance.venda_id)
    const compr = await Person.findByOrFail('id', venda.comprador_id)
    console.log(`Logs-Laudo[${laudo_id}][ExameHook-update]->carregou as entidades`);
    let email_revenda= ''
    if (exameInstance.revenda_id){
       const { revendedor_id } = await Revenda.findByOrFail('id', exameInstance.revenda_id)
       const revenda = await Person.findByOrFail('id', revendedor_id)
       email_revenda = revenda.email
       console.log(`Logs-Laudo[${laudo_id}][ExameHook-update]->carregou dados da revenda`);
     }

    // Dados do Comprador
    const email_comprador = compr.email

    // Dados Paciente
    const paciente_id = exameInstance.paciente_id
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
    const dataColeta = dayjs(exameInstance.dataColeta).format('DD/MM/YYYY')

    // Coletador
    const coletadorNome = coletador.nome
    const docColetador = coletador.codProfissao

    // Teste Exame
    const lote_teste = exameInstance.loteExame
    //const dataValidadeExame = dayjs(exameInstance.dataValidadeExame).format('DD/MM/YYYY')
    const dataResultado = dayjs(exameInstance.dataResultado).format('DD/MM/YYYY - HH:mm')
    const resultadoText = exameInstance.resultadoText
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

    // Laboratorio
    const labNome = lab.razaoSocial
    const labDoc = lab.doc
    const labTecnico = lab.tecnico
    const labDocTecnico = lab.docTecnico
    const fileLabAss = labAss.file

    console.log(`Logs-Laudo[${laudo_id}][ExameHook-update]->preparou dados pdf`);

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
    console.log(`Logs-Laudo[${laudo_id}][ExameHook-update]->Preparou parâmetros`);

    console.log('Iniciando Html')
    try {
      let htmlRet
      await ejs.renderFile(path.join(__dirname, '..', '..', '..', 'resources', 'views', 'laudos.ejs'), parameters, {}, async (err, html) => {
        if (err) {
          console.log(`Logs-Laudo[${laudo_id}][ExameHook-update]-> erro ao criar html `, err);
        } else {
          htmlRet = html
          console.log(`Logs-Laudo[${laudo_id}][ExameHook-update]-> html criado `);
        }
      })
      console.log(`Logs-Laudo[${laudo_id}][ExameHook-update]->html preparado`);

      nomepdf = laudo_id + '-' + Date.now() + '.pdf'
      var options = {
        format: 'A4',
        type: 'pdf',
        timeout: 300,
        orientation: 'portrait',
        border: 5,
        renderDelay: 100,
        phantomPath: '../../../node_modules/phantomjs-prebuilt/lib/phantom/bin/phantomjs',
        childProcessOptions: { detached: true }
      }
      const nameFile = Helpers.publicPath(`uploads/${nomepdf}`)

      console.log('nameFile>>', nameFile)
      const fileRet = await File.create({
        file: nomepdf,
        name: nomepdf,
        exameId: laudo_id,
        type: 'pdf',
        subtype: 'pdf'
      })
      console.log(`Logs-Laudo[${laudo_id}][ExameHook-update]->entidade Arquivo criada no banco`);
      let envio = ''

      await pdf.create(htmlRet, { options })
        .toFile(nameFile, async (erro, res) => {
          if (erro) {
            console.log(`Logs-Laudo[${laudo_id}][ExameHook-update]-> erro ao criar PDF `, erro);
            console.log('Um Erro aconteceu ao criar o PDF', erro)
          }
          else {
            console.log(`Logs-Laudo[${laudo_id}][ExameHook-update]->criou certo ${res}`);
            setTimeout(()=>{
              console.log(`Logs-Laudo[${laudo_id}][ExameHook-update]->esperou, vai enviar e-mail`);
              envio = Kue.dispatch(Job.key,
              { laudo_id,
                paciente_nome,
                paciente_email,
                dataColeta,
                nomepdf,
                email_comprador,
                email_revenda
              },
              { priority, attempts, remove }
              )
              console.log(`Logs-Laudo[${laudo_id}][ExameHook-update]->Kue foi disparado - > `,JSON.stringify(envio));
            }, 10000)
          }
        })
      console.log(`Logs-Laudo[${laudo_id}][ExameHook-update]->depois do pdf criado com html  / kue disparado (fora)`);

      exameInstance.fileLaudo = `${Env.get('APP_URL')}/files/${fileRet.id}`
      exameInstance.pdfCreate = true

      const message = `O exame ${exameInstance.id} foi Laudado ${dataResultado}`

      const notify = await axios.get(`https://api.telegram.org/bot1652315851:AAEIgz_hCFFUY-ee8-KlFKIDOl-7yIZCRfM/sendMessage?chat_id=-1001298899523&text=${message}.`)

      if(notify.status ===  200){
        const sendMail =  await SendEmail.create({
          email_paciente: paciente_email,
          email_comprador,
          email_revendedor: email_revenda,
          data_envio: dataResultado,
          exame: nameFile,
          status: true
        })
         console.log(sendMail)
      }

    const log ={}
      log.envio = envio

      return response.status(204)
    } catch (error) {
      console.log(`Logs-Laudo[${laudo_id}][ExameHook-update]->erro DO CATCH - > `,error);
    }
  } else {

    console.log('Só passei aqui')
    if (exameInstance.dirty.status === 2) {
    const message = `O exame ${exameInstance.id} foi coletado ${coleta}`

    const notify = await axios.get(`https://api.telegram.org/bot1652315851:AAEIgz_hCFFUY-ee8-KlFKIDOl-7yIZCRfM/sendMessage?chat_id=-1001298899523&text=${message}.`)

    console.log('Notificação Coleta: ', notify.status)
    }
  }
}



