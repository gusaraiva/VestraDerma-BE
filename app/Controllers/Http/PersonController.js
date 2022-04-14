'use strict'

const Person = use('App/Models/Person')

class PersonController {
  async index ({ request, response, auth }) {
    try {
      
    } catch (err) {
      return response.status(err.status)
        .send({ error: { message: 'Erro ao criar Usuario' } })
    }
  }

  async store ({ request, response }) {
  }

  async show ({ params, request, response, view }) {
  }

  async update ({ params, request, response }) {
  }

  async destroy ({ params, request, response }) {
  }
}

module.exports = PersonController
