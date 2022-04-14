'use strict'
const Person = use('App/Models/Person')
const Constants = use('App/Constants/Constants')

class PacienteController {
  async show ({ params }) {
    const paciente = await Person.findByOrFail('id', params.id)

    return paciente
  }

  async index ({ response }) {
    try {
      const pacientes = await Person.findBy('typePaciente', true)

      if (!pacientes) {
        return response
          .send({ message: 'Pacientes não Cadastrados' })
      }

      return pacientes
    } catch (err) {
      console.log(err)
      return response
        .status(400)
        .send({ error: { message: err } })
    }
  }

  async store ({ request, response, auth }) {
    try {
      const data = request.only([
        'nome',
        'doc',
        'dependente',
        'docResponsavel',
        'birth_date',
        'contato1',
        'contato2',
        'email',
        'raca',
        'sexo',
        'psaude',
        'pseg',
        'pdrespcronica',
        'drespcronica',
        'pdcromossomica',
        'dcromossomica',
        'diabetes',
        'imunossupressao',
        'pdcardiaca',
        'dcardiaca',
        'pdcardiaca2',
        'dcardiaca2',
        'palergias',
        'dalergias',
        'patopias',
        'datopias',
        'pcirurgias',
        'dcirurgias',
        'tcirurgia',
        'tinternacao',
        'gestanterisco',
        'gestacaohistoria',
        'tempogestacao',
        'transsangue',
        'transsangtempo',
        'carteiravac',
        'carteiravacq',
        'cartvacatraso',
        'usodrogas',
        'usodrogasr',
        'viagemrecente',
        'viagemrecenter',
        'tipoalimentacao',
        'atividadesexual',
        'detalhedevpsico',
        'atividadefisica',
        'mediasono',
        'mediaingesthidrica',
        'ingestbebidaalcoolica',
        'obesidade',
        'pdrenalcronica',
        'drenalcronica',
        'cep',
        'logradouro',
        'numero',
        'complemento',
        'bairro',
        'cidade',
        'uf'

      ])
      let person = {}

      const pacienteExits = await Person.findBy('doc', data.doc)

      if(pacienteExits) {
        return response.json('Paciente já Cadastrado')
      } else {
      person = await Person.create({ ...data, typePaciente: Constants.typePaciente })
      }
      const obj = {}
      obj.ret = 'ok'
      obj.paciente = person
      return obj
    } catch (error) {
      console.log(error)
      return response
        .status(400)
        .send({ error: { message: error } })
    }
  }

  async update ({ request, response, auth, params }) {
    try {
      const paciente = await Person.findByOrFail('id', params.id)

      const data = request.only([
        'nome',
        'doc',
        'dependente',
        'docResponsavel',
        'birth_date',
        'contato1',
        'contato2',
        'email',
        'raca',
        'sexo',
        'psaude',
        'pseg',
        'pdrespcronica',
        'drespcronica',
        'pdcromossomica',
        'dcromossomica',
        'diabetes',
        'imunossupressao',
        'pdcardiaca',
        'dcardiaca',
        'pdcardiaca2',
        'dcardiaca2',
        'palergias',
        'dalergias',
        'patopias',
        'datopias',
        'pcirurgias',
        'dcirurgias',
        'tcirurgia',
        'tinternacao',
        'gestanterisco',
        'gestacaohistoria',
        'tempogestacao',
        'transsangue',
        'transsangtempo',
        'carteiravac',
        'carteiravacq',
        'cartvacatraso',
        'usodrogas',
        'usodrogasr',
        'viagemrecente',
        'viagemrecenter',
        'tipoalimentacao',
        'atividadesexual',
        'detalhedevpsico',
        'atividadefisica',
        'mediasono',
        'mediaingesthidrica',
        'ingestbebidaalcoolica',
        'obesidade',
        'pdrenalcronica',
        'drenalcronica',
        'cep',
        'logradouro',
        'numero',
        'complemento',
        'bairro',
        'cidade',
        'uf'

      ])

      paciente.merge(data)

      await paciente.save()

      const obj = {}
      obj.ret = 'ok'
      obj.paciente = paciente
      return obj
    } catch (err) {
      console.log(err)
      return response
        .status(400)
        .send({ error: { message: err } })
    }
  }

  async destroy ({ params, request, response }) {
    const paciente = await Person.findBy('id', params.id)
    if (!paciente) {
      return response
        .status(400)
        .send({ error: { message: 'Não existe esse Paciente' } })
    }

    await paciente.delete()
    return response
      .status(200)
      .send({ message: 'Paciente Excluído com sucesso' })
  }
}

module.exports = PacienteController
