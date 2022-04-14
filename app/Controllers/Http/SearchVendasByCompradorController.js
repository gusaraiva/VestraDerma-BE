'use strict'
const Database = use('Database')

class SearchVendasByCompradorController {
  async list ({ params, response }) {
    try {
      // const results = await Resultado.all()

      const strgSQL = `select * from vendas 
          where vendas."comprador_id" = '${params.id}'`
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

module.exports = SearchVendasByCompradorController
