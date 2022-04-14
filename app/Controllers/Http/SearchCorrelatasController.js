'use strict'
const Database = use('Database')


class SearchCorrelatasController {
  async list({ params, auth, response }) {
    try {
      const list = await Database.raw(`SELECT
          people."id",
          c.id as correlata_id,
          people.nome,
          people.doc,
          people.contato1,
          people.contato2     
        FROM
          people  
          INNER JOIN correlatas c on c."CorrelatId" = people."id"
        WHERE
          c."EmpresaId" = ${params.id} 
          order by people.nome`
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

module.exports = SearchCorrelatasController
