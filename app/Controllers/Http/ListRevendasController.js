'use strict'
const Person = use('App/Models/Person')
const Database = use('Database')

const Constants = use('App/Constants/Constants')

class ListRevendasController {


  async index({ request, auth, response }) {

    try {
      const data = request.only(['comprador_id', 'revendedor_id'])
      const SqlS = `select r.id, r.created_at, count(e.id) as qtde
      from revendas r 
      inner join exames e on e.revenda_id=r.id
      where r.comprador_id = ${data.comprador_id} and r.revendedor_id=  ${data.revendedor_id}
      group by r.id, r.created_at`;
      console.log('ListRevendasController ', SqlS)
      const list = await Database.raw(SqlS)
    
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

module.exports = ListRevendasController
