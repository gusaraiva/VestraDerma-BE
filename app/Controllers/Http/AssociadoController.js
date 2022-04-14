'use strict'
const Associado = use('App/Models/Associado')
const Person = use('App/Models/Person')

class AssociadoController {
  async index ({ request, response, view }) {
    try {
      const list = await Associado.all()

      return list
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
        'id_pessoa',
        'id_associado'
      ])
      const exist = await Person.findBy('id', data.id_pessoa)

      if (!exist) {
        return response
          .status(409)
          .send({ message: 'Master não encontrado' })
      } else {
        await Associado.create({
          id_pessoa: data.id_pessoa,
          id_associado: data.id_associado
        })

        return response
          .status(200)
          .send({ message: 'Associado com sucesso' })
      }
    } catch (err) {
      console.log(err)
      return response
        .status(400)
        .send({ error: { message: err } })
    }
  }

  async show ({ params, request, response, view }) {
    try {
      const assoc = await Associado.findByOrFail('id', params.id)

      const { nome } = await Person.findByOrFail('id', assoc.id_pessoa)
      const associado = await Person.findByOrFail('id', assoc.id_associado)

      return response
        .send({ message: `${associado.nome}, Esta asociado a ${nome} ` })
    } catch (err) {
      console.log(err)
      return response
        .status(400)
        .send({ error: { message: err } })
    }
  }

  async update ({ params, request, response }) {
    try {

      /* return response
         .status(200)
         .send({ message: '? com sucesso' }) */
    } catch (err) {
      console.log(err)
      return response
        .status(400)
        .send({ error: { message: err } })
    }
  }

  async destroy ({ params, request, response }) {
    try {
      const assoc = await Associado.findByOrFail('id', params.id)

      assoc.delete()

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

module.exports = AssociadoController
