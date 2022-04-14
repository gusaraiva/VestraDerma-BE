'use strict'
const Database = use('Database')

const Resultado = use('App/Models/Resultado')

class SearchResultsController {
  async list ({ params, response }) {
    try {
      // const results = await Resultado.all()
      /* const results = await Database
        .raw('select * from resultados where teste_id= ?', params.id) */
      const results = await Database
        .select('*')
        .from('resultados')
        .where('teste_id', params.id)

      const obj = {}
      // obj.list = results.rows
      obj.list = results
      return obj
    } catch (err) {
      console.log(err)
      return response
        .status(400)
        .send({ error: { message: err } })
    }
  }
}

module.exports = SearchResultsController
