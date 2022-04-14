'use strict'
const Database = use('Database')


class SearchPersonByRespController {
    async list ({  params, response }) {
        try {
          //const results = await Resultado.all()
          
          const strgSQL = `select * from people 
          where people."docResponsavel" = '${params.doc}'`         
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

module.exports = SearchPersonByRespController
