'use strict'

const ResultadoController = require('./ResultadoController')

const Teste = use('App/Models/Teste')
const Resultado = use('App/Models/Resultado')

class TesteController {
  async index ({ request, response, view }) {
    try {
      const testes = await Teste.all()
      const obj = {}
      obj.list = testes
      return obj
    } catch (err) {
      console.log(err)
      return response
        .status(400)
        .send({ error: { message: 'Erro ao carregar' } })
    }
  }

  async store ({ request, response }) {
    try {
      const test = request.only([
        'nome',
        'fabricante_id',
        'tipoAmostra',
        'nomeComercial',
        'metodo',
        'equipamento',
        'orientacoes',
        'sobreTeste',
        'analiseResultado'
      ])

      const results = request.input('results')
      const ret = await Teste.create({
        nome: test.nome,
        fabricante_id: test.fabricante_id,
        tipoAmostra: test.tipoAmostra,
        nomeComercial: test.nomeComercial,
        metodo: test.metodo,
        equipamento: test.equipamento,
        orientacoes: test.orientacoes,
        sobreTeste: test.sobreTeste,
        analiseResultado: test.analiseResultado
      })

      results.map(async rets => {
        const x = await Resultado.create({
          teste_id: ret.id,
          resultadoText: rets.resultadoText,
          resultadoType: rets.resultadoType
        })
      })

      return response
        .status(200)
        .send({ message: 'Criado com sucesso' })
    } catch (err) {
      console.log(err)
      return response
        .status(400)
        .send({ error: { message: err } })
    }
  }

  async show ({ params, request, response, view }) {
    try {
      const test = await Teste.findByOrFail('id', params.id)

      return test
    } catch (err) {
      console.log(err)
      return response
        .status(400)
        .send({ error: { message: err } })
    }
  }

  async update ({ params, request, response }) {
    try {
      const test = await Teste.findByOrFail('id', params.id)

      const testU = request.only([
        'nome',
        'fabricante_id',
        'tipoAmostra',
        'nomeComercial',
        'metodo',
        'equipamento',
        'orientacoes',
        'sobreTeste',
        'analiseResultado'
      ])

      test.merge(testU)
      await test.save()

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
      const test = await Teste.findByOrFail('id', params.id)

      test.delete()

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

module.exports = TesteController
