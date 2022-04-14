'use strict'
const Database = use('Database')


class SearchAssociadosController {
  async list({ params, response }) {
    try {
      //const results = await Resultado.all()

      /* const strgSQL = `select count(e.id) as qtde, p.id, p.nome,  a."id" as item_id,  
                   sum(
                      case 
                         when (e.status>=2) THEN 1
                       Else 0 end
                     ) as "qtdeColetados",
                   sum(
                       case 
                         when (e.status>=3) THEN 1
                       Else 0 end
                     ) as "qtdeLaudados"
           from associados a 
           inner join people p on a.id_associado=p.id
           left join vendas v on v.comprador_id=a.id_pessoa
           left join exames e on e.paciente_id=p.id and v.id=e.venda_id
           where a.id_pessoa= ${params.id}
           group by  p.nome, p.id, a."id"`*/
      const strgSQL = `select count(e.id) as qtde, p.id, p.nome, p.doc,  a."id" as item_id,  
          sum(
             case 
                when (e.status>=2) THEN 1
              Else 0 end
            ) as "qtdeColetados",
          sum(
              case 
                when (e.status>=3) THEN 1
              Else 0 end
            ) as "qtdeLaudados"
        from associados a 
          inner join people p on a.id_associado=p.id          
          left join exames e on e.paciente_id=p.id 
          where a.id_pessoa= ${params.id}
          group by  p.nome, p.id, a."id"
          order by p.nome, p.doc`
     // console.log('search Associados ', JSON.stringify(strgSQL))
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

module.exports = SearchAssociadosController
