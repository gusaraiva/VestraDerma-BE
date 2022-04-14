'use strict'
const Correlata = use('App/Models/Correlata')
const Person = use('App/Models/Person')
const Database = use('Database')

const Constants = use('App/Constants/Constants')

class CorrelataController {
  
  async index({ request, auth, response }) {
    try {
      console.log('auth ', auth)
      const list = await Database.raw(`SELECT
          people."id",
          people.nome,
          people.doc,
          people.contato1,
          people.contato2,
          people."codProfissao",      
        FROM
          users
          INNER JOIN  people  ON  users.person_id = people."id"
          INNER JOIN correlatas c on c."CorrelatId" = people."id"
        WHERE
          users."typeEmpresa" = ${Constants.typeEmpresa} 
          and c."EmpresaId" = ${auth.person_id} `
      )
      const obj = {}
      obj.list = list.rows
      return obj
    } catch (err) {
      console.log(err)
      return response
        .status(400)
        .send({ error: { message: err } })
    }
  }

  async store({ request, response, auth }) {
    try {
      const data = request.only([
        'EmpresaId',
        'CorrelatId'
      ])
      const exist = await Person.findBy('id', data.CorrelatId)

      if (!exist) {
        return response
          .status(409)
          .send({ message: 'Master não encontrado' })
      } else {
        await Correlata.create({
          EmpresaId: data.EmpresaId,
          CorrelatId: data.CorrelatId
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

  async update({ request, response, auth, params }) {
    try {
    
      return response
        .status(200)
        .send({ message: 'Sem rota de update :0)' })
    } catch (err) {
      console.log(err)
      return response
        .status(400)
        .send({ error: { message: err } })
    }
  }

  async destroy({ params, request, response }) {
    try {
      const assoc = await Correlata.findByOrFail('id', params.id)

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

module.exports = CorrelataController
