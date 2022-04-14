'use strict'
const Database = use('Database')

class SearchExamesColetarByDocController {
  async list ({ params, response }) {
    try {
      // const results = await Resultado.all()

      const strgSQL = `select e.id, e.paciente_id, p.nome as Paciente, v.comprador_id, c.nome as Comprador,
					t.nome as teste_nome
          from exames e
					inner join people p on e.paciente_id=p.id
					inner join vendas v on v.id=e.venda_id
					inner join testes t on t.id=e.teste_id
					inner join people c on c.id=v.comprador_id

          where e.status=1
					and (p.doc='${params.id}' or p."docResponsavel"='${params.id}' or c."doc"='${params.id}')
          order by  p.nome`
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

module.exports = SearchExamesColetarByDocController
