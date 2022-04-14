'use strict'
const Database = use('Database')
const Constants = use('App/Constants/Constants')

class SearchTestesCountByCompradorController {
  async list ({ params, response }) {
    try {
      // const results = await Resultado.all()

      /* `select t.nome,t.id, count(e.id) as Qtde
      from vendas v 
      inner join exames e on v.id=e.venda_id
      inner join testes t on t.id=e.teste_id
      where e.status=0 and v.comprador_id= ${params.id}
      group by t.nome,t.id`*/
      
      const strgSQL = `with vx as (
        select e.teste_id, e.id
        from exames e 
        inner join vendas v on v.id=e.venda_id
        where  e.status=0 and v.comprador_id=${params.id}
        union all 
        select e.teste_id, e.id
        from exames e 
        inner join revendas r on r.id=e.revenda_id
        where  e.status=0 and r.comprador_id=${params.id}					
        )
        select t.nome,t.id, count(vx.id) as Qtde
        from testes t inner join vx on t.id=vx.teste_id 
         group by t.nome,t.id`
      console.log
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
  async listByStatus ({ params, response }) {
    try {
      // const results = await Resultado.all()

      const strgSQL = `select t.nome,t.id, 
      sum(  case  e.status when  ${Constants.EXAME_STATUS_VENDIDO} then 1 else 0 end) as vendido,
      sum(  case  e.status when  ${Constants.EXAME_STATUS_ASSOCIADO} then 1 else 0 end) as associado,
      sum(  case  e.status when  ${Constants.EXAME_STATUS_COLETADO} then 1 else 0 end) as coletado,
      sum(  case  e.status when  ${Constants.EXAME_STATUS_LAUDADO} then 1 else 0 end) as laudado,  
      sum(1) as total   
      from vendas v 
      inner join exames e on v.id=e.venda_id
      inner join testes t on t.id=e.teste_id
      where v.comprador_id= ${params.id}
      group by t.nome,t.id`

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
  async listByStatus ({ params, response }) {
    try {
      // const results = await Resultado.all()

      const strgSQL = `select t.nome,t.id, 
      sum(  case  e.status when  ${Constants.EXAME_STATUS_VENDIDO} then 1 else 0 end) as vendido,
      sum(  case  e.status when  ${Constants.EXAME_STATUS_ASSOCIADO} then 1 else 0 end) as associado,
      sum(  case  e.status when  ${Constants.EXAME_STATUS_COLETADO} then 1 else 0 end) as coletado,
      sum(  case  e.status when  ${Constants.EXAME_STATUS_LAUDADO} then 1 else 0 end) as laudado,  
      sum(1) as total   
      from vendas v 
      inner join exames e on v.id=e.venda_id
      inner join testes t on t.id=e.teste_id
      where v.comprador_id= ${params.id}
      group by t.nome,t.id`

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

module.exports = SearchTestesCountByCompradorController
