'use strict'
const Database = use('Database')


class SearchExamesByVendaController {
    async list ({  params, response }) {
        try {
          //const results = await Resultado.all()
          
          const strgSQL = `select e.*,p.nome as paciente_nome, l.nome as lab_nome, t.nome as teste_nome
          From exames e 
          left join people l on l.id=e.lab_id
          left join people p on p.id=e.paciente_id
          left join testes t on t.id=e.teste_id
          where e.venda_id= '${params.id}'`         
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

module.exports = SearchExamesByVendaController
