'use strict'
const Mail = use('Mail')
const { resolve } = require('path')
const dayjs = require('dayjs')
const axios = use('axios')

class EnviaEmailLaudo {
  static get concurrency () {
    return 1
  }

  static get key () {
    return 'EnviaEmailLaudo-job'
  }

  async handle ({ laudo_id, paciente_nome, paciente_email, dataColeta, nomepdf, email_comprador, email_revenda }) {
    let enviaEmail = ''
    try {

      enviaEmail = await Mail.send(
        'emails.envialaudo',
        { paciente_nome, laudo_id, dataColeta, hasAttachment: !!nomepdf },
        message => {
          message
            .to(paciente_email, paciente_nome)
            .cc(email_comprador)
            .cc(email_revenda)
            .from('vestra@vestra.global', 'Laboratorio | Vestra')
            .subject(`Laudo de ${paciente_nome}  - ID ${laudo_id})`)
            .attach(resolve(__dirname, '..', '..', 'public', 'uploads', `${nomepdf}`) // athPdf
            , { filename: `Laudo-${paciente_nome}.pdf` })

        })
      console.log(`Logs-Email[${laudo_id}][Job-email]-> e-mail enviado: - ret enviaEmail -> ${enviaEmail.response}`);

      const hoje = Date.now()
      const dataEnvio = dayjs(hoje).format('DD/MM/YYYY HH:mm')
      const message = `Laudo: ${laudo_id} enviado ${dataEnvio} para ${enviaEmail.accepted}, status: ${enviaEmail.response}`
      console.log(`Logs-Email[${laudo_id}][Job-email]->Email enviado, dia: ${dataEnvio},com o laudo ${nomepdf}, para o comprador: ${email_comprador}, e paciente: ${paciente_email}`)
      const notify = await axios.get(`https://api.telegram.org/bot1652315851:AAEIgz_hCFFUY-ee8-KlFKIDOl-7yIZCRfM/sendMessage?chat_id=-1001298899523&text=${message}.`)

      console.log(notify)

      if(notify.status === 200)
      {
        console.log(notify)
      }
     } catch (error) {
      console.log(`Id:${laudo_id} ->` + error)

    }
  }
}

module.exports = EnviaEmailLaudo
