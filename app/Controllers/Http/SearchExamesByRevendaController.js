'use strict'
const Database = use('Database')


class SearchExamesByRevendaController {
    async list ({  params, response }) {
        try {
          //const results = await Resultado.all()

          const strgSQL = `select e.*, t.nome as teste_nome
          From exames e
          left join testes t on t.id=e.teste_id
          where e.revenda_id= '${params.id}'`
          const results = await Database
          .raw(strgSQL)

          const obj = {}
          obj.list = results.rows
          return obj
        } catch (err) {
          console.log(err)
          return response
            .status(400)
            .send({ error: { message: err } })
        }
      }
}

module.exports = SearchExamesByRevendaController
