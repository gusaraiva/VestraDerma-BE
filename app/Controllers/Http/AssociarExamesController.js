'use strict'
const Database = use('Database')
const Exame = use('App/Models/Exame')
const Historico = use('App/Models/Historico')
const dayjs = require('dayjs')

class AssociarExamesController {
  async store({ request, response, auth }) {
    try {
      const data = request.only([
        'teste',
        'comprador',
        'persons'
      ])
      const statusOld = 0
      const statusNew = 1

      const user = await auth.getUser()

      const strgSQL = `with vx as (
        select e.teste_id, e.id
        from exames e 
        inner join vendas v on v.id=e.venda_id
        where e.status=${statusOld}and v.comprador_id= ${data.comprador}
        and e.teste_id=${data.teste}
        union all 
        select e.teste_id, e.id
        from exames e 
        inner join revendas r on r.id=e.revenda_id
        where e.status=${statusOld} and r.comprador_id=${data.comprador}					
        and e.teste_id=${data.teste}
        )
        select vx.id
        from testes t inner join vx on t.id=vx.teste_id 
      
        limit  ${data.persons.length}`
     

      const results = await Database
        .raw(strgSQL)
      const _rows = results.rows;
      let _item = {}
      if (_rows.length != data.persons.length) {
        return response
          .status(400)
          .send({ message: "Erro ao Associar Exames. Não há Exames suficientes" })
      }
      else {
        for (let index = 0; index < _rows.length; index++) {
          const exams = await Exame.findByOrFail('id', _rows[index].id)
          _item = {
            paciente_id: data.persons[index],
            status: statusNew
          }
          exams.merge(_item);
          await exams.save();
          const now = dayjs(new Date())

          await Historico.create({
            exameId: _rows[index].id,
            dataAssociacao: now,
            status: statusNew ,
            userId: user.id
          }) 
        }
      }
      return response
        .status(200)
        .send({ message: 'Associados com sucesso' })
    } catch (err) {
      console.log(err)
      return response
        .status(400)
        .send({ error: { message: "Erro ao Associar Exames" } })
    }


  }
}

module.exports = AssociarExamesController
