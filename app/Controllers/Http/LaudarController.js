'use strict'
const Exame = use('App/Models/Exame')
const Historico = use('App/Models/Historico')
const Event = use('Event')

const dayjs = require('dayjs')

class LaudarController {
  async update ({ request, response, params, auth }) {
    try {
      const user = await auth.getUser()

      const exams = await Exame.findByOrFail('id', params.id)
      console.log(`Logs-Laudo[${params.id}][Laudarcontroller-update]->carregou o exame`);     

      const data = request.only([
        'resultadoText'
      ])

      const status = 3
      const dataResultado = new Date()     

      exams.merge({ ...data, respLab_id: auth.user.person_id, dataResultado: dataResultado, status: status })
      
      console.log(`Logs-Laudo[${params.id}][Laudarcontroller-update]->merge Dados, vai salvar`);

     const teste =  await exams.save()
    
     const now = dayjs(new Date())

    await Historico.create({
      exameId: exams.id,
      dataLaudar: now,
      status: status ,
      userId: user.id
    }) 

    console.log(`Logs-Laudo[${params.id}][Laudarcontroller-update]->depois de salvo`);

    return exams
    } catch (err) {
      console.log(err)
      return response
        .status(400)
        .send({ error: { message: 'Erro Ao Laudar Exame' } })
    }
  }

  async store({request, response, params}) {

    const exam = await Exame.findByOrFail('id', params.id)
    const teste = {}
    
    if(exam.status === 3) {
      teste.event = Event.fire('new::laudo', exam.id)
    }

    return teste //response.status(204).send()

  }
}

module.exports = LaudarController
