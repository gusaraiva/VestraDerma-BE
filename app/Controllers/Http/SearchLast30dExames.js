'use strict'
const Database = use('Database')
const Constants = use('App/Constants/Constants')

class SearchLast30dExames {
  async list ({ params, response, auth }) {
    try {
      // const results = await Resultado.all()
      // console.log('auth.user', auth.user)
      // adminsitrativo vê todos
      // vendedor ??
      // Empresa / medico  vÊ quem ele comprou
      // laboratorio vÊ os seus idlabs

      let strgSQL = `select e.id, coalesce(e."resultadoText",'') as resultado,p.nome as paciente_nome,e."dataColeta", e."dataResultado", l.nome as lab_nome, t.nome as teste_nome,
          case  e.status
            when  ${Constants.EXAME_STATUS_VENDIDO} then 'Vendido'
            when  ${Constants.EXAME_STATUS_ASSOCIADO} then 'Associado'
            when  ${Constants.EXAME_STATUS_COLETADO} then 'Coletado'
            when  ${Constants.EXAME_STATUS_LAUDADO} then 'Laudado'
            Else '...'
          end as status
          From exames e 
          left join people l on l.id=e.lab_id
          left join people p on p.id=e.paciente_id
          left join testes t on t.id=e.teste_id
          inner join vendas v on v.id=e.venda_id
          where ( e.created_at>=CURRENT_DATE-30 or  e.updated_at>=CURRENT_DATE-30)
           and  e.status in (${Constants.EXAME_STATUS_COLETADO},${Constants.EXAME_STATUS_LAUDADO} )
           and (false`

      if (auth.user.typeRoot || auth.user.typeAdministrativo || auth.user.typeVendedor) { strgSQL += ' or true ' }
      if (auth.user.typeEmpresa || auth.user.typeMedico) { strgSQL += ' or v.comprador_id= ' + auth.user.person_id }
      if (auth.user.typeLaboratorio) { strgSQL += ' or (e.lab_id= ' + auth.user.person_id + ' and e.status> ' + Constants.EXAME_STATUS_ASSOCIADO + ')' }

      strgSQL += ')'
     // console.log(strgSQL)
      const results = await Database
        .raw(strgSQL)

      const obj = {}
      obj.list = results.rows
      return obj
    } catch (err) {
      console.log(err)
      return response
        .status(400)
        .send({ message: 'Erro ao Buscar Dados' })
    }
  }
}

module.exports = SearchLast30dExames
