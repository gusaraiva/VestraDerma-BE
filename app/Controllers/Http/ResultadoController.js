'use strict'

const Resultado = use('App/Models/Resultado')

class ResultadoController {
  async index ({ request, response, view }) {
    try {
      const results = await Resultado.all()

      return results
    } catch (err) {
      console.log(err)
      return response
        .status(400)
        .send({ error: { message: err } })
    }
  }

  async store ({ request, response }) {
    try {
      const data = request.only([
        'teste_id',
        'resultadoText',
        'resultadoType'
      ])

      const result = await Resultado.create({
        teste_id: data.teste_id,
        resultadoText: data.resultadoText,
        resultadoType: data.resultadoType
      })

      return response
        .status(200)
        .send({ message: 'Incluido com sucesso' })
    } catch (err) {
      console.log(err)
      return response
        .status(400)
        .send({ error: { message: err } })
    }
  }

  async show ({ params, request, response, view }) {
    try {
      const result = await Resultado.findByOrFail('id', params.id)

      return result
    } catch (err) {
      console.log(err)
      return response
        .status(400)
        .send({ error: { message: err } })
    }
  }

  async update ({ params, request, response }) {
    try {
      const result = await Resultado.findByOrFail('id', params.id)

      const data = request.only([
        'teste_id',
        'resultadoText',
        'resultadoType'
      ])

      result.merge(data)
      result.save()

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
      const result = await Resultado.findByOrFail('id', params.id)

      result.delete()

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

module.exports = ResultadoController
