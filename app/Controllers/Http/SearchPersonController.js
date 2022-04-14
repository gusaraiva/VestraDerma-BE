'use strict'
const Person = use('App/Models/Person')
const User = use('App/Models/User')

class SearchPersonController {
  async show ({ params, response }) {
    try {
      const paciente = await Person.findBy('doc', params.doc)
      const obj = {}
      obj.ret = paciente

      if (paciente) {
        const user = await User.findBy('person_id', paciente.id)
        if (user) {
          obj.ret.user_id = user.id
        }
      }

      return obj
    } catch (err) {
      console.log(err)
      return response
        .status(400)
        .send({ error: { message: 'Erro ao pesquisar pessoa por documentos' } })
    }
  }
}

module.exports = SearchPersonController
