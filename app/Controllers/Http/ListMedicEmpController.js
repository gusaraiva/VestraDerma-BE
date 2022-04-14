'use strict'
const Person = use('App/Models/Person')
const User = use('App/Models/User')
const Database = use('Database')

const Constants = use('App/Constants/Constants')

class ListMedicEmpController {
  async index ({ request, auth, response }) {
    try {
      const list = await Database.raw(`SELECT
          people."id",
          people.nome,
          people.doc,
          people.contato1,
          people.contato2,
          people."codProfissao"
        FROM
          users
          INNER JOIN
          people
          ON
            users.person_id = people."id"
        WHERE
          users."typeMedico" = ${Constants.typeMedico} or
          users."typeEmpresa" = ${Constants.typeEmpresa};`
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
}
module.exports = ListMedicEmpController
