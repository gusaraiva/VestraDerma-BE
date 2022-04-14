'use strict'

const Exame = use('App/Models/Exame')
const Historico = use('App/Models/Historico')
const Teste = use('App/Models/Teste')
const Event = use('Event')
const { job } = require('../../utils/bkp.js')
const dayjs = require('dayjs')


class ExameController {
  async index ({ request, response, view }) {
    try {
      const exames = await Exame.all()

      job();

      return exames
    } catch (err) {
      console.log(err)
      return response
        .status(400)
        .send({ error: { message: err } })
    }
  }

  async store ({ request, response, auth}) {
    try {
      const dataR = request.only([
        'exames'
      ]);
      
      const user = await auth.getUser()
       let exame 

      for (let index = 0; index < dataR.exames.length; index++) {
        const element = dataR.exames[index];

        const data = {
          venda_id: element.venda_id,
          teste_id: element.teste_id,
          lab_id: element.lab_id,
          status: element.status
        };
       
        if (element.paciente_id) { data.paciente_id = element.paciente_id }
        exame = await Exame.create(data);

        const now = dayjs(new Date())

       await Historico.create({
          exameId: exame.id,
          dataExame: now,
          status: exame.status ,
          userId: user.id
        })
        
      }
      

      

      return response
        .status(200)
        .send({ message: 'Incluido com sucesso' });
    } catch (err) {
      console.log(err);
      return response
        .status(400)
        .send({ error: { message: err } });
    }
  }

  async show ({ params, request, response, view }) {
    try {
      const exame = await Exame.findByOrFail('id', params.id);
      const test = await Teste.findByOrFail('id', exame.teste_id);
      const ret = exame;

      if(ret.status === 3 && res.pdfCreate === false) {
        Event.fire('new::laudo', params.id);
      }      

      ret.teste_nome = test.nome;

      return ret;
    } catch (err) {
      console.log(err)
      return response
        .status(400)
        .send({ error: { message: err } })
    }
  }

  async update ({ params, request, response }) {
    try {
      const exame = await Exame.findByOrFail('id', params.id)

      const data = request.only([
        'paciente_id',
        'coletador_id',
        'loteExame',
        // 'dataValidadeExame',
        'sintomas',
        'sintDesde',
        'febre',
        'coriza',
        'fadiga',
        'tosse',
        'faltadeAr',
        'dorGarganta',
        'dorCabeca',
        'perdaOlfato',
        'perdaPaladar',
        'calafrios',
        'dorCorpo',
        'diarreia',
        'contato10d',
        'dataColeta'
      ])
      const status = 2

      await exame.merge({ ...data, status: status })

      await exame.save()

      return response
        .status(200)
        .send({ message: 'Atualizado com sucesso' })
    } catch (err) {
      console.log(err)
      return response
        .status(400)
        .send({ error: { message: err } })
    }
  }

  async destroy ({ params, request, response }) {
    try {
      const exame = await Exame.findByOrFail('id', params.id)

      await exame.delete()

      return response
        .status(200)
        .send({ message: 'Excluido com sucesso' })
    } catch (err) {
      console.log(err)
      return response
        .status(400)
        .send({ error: { message: err } })
    }
  }
}

module.exports = ExameController
