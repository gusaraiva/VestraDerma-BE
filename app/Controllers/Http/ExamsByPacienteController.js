'use strict'
const Database = use('Database')
const Teste = use('App/Models/Teste')
const Exame = use('App/Models/Exame')
const Constants = use('App/Constants/Constants')


class ExamsByPacienteController {
  async search({ request, response, auth, params }) {
    try {

      let _id = params.id
      const data = request.only(['id', 'comprador_id'])


      let strgSQL = `select e.id, coalesce(e."resultadoText",'') as resultado,p.nome as paciente_nome,e."dataColeta", e."dataResultado", l.nome as lab_nome, t.nome as teste_nome,
          case  e.status
            when  ${Constants.EXAME_STATUS_VENDIDO} then 'Vendido'
            when  ${Constants.EXAME_STATUS_ASSOCIADO} then 'Associado'
            when  ${Constants.EXAME_STATUS_COLETADO} then 'Coletado'
            when  ${Constants.EXAME_STATUS_LAUDADO} then 'Laudado'
            Else '...'
          end as status,
          e."fileLaudo"
          From exames e 
          left join people l on l.id=e.lab_id
          left join people p on p.id=e.paciente_id
          left join testes t on t.id=e.teste_id       
          where e.paciente_id =${_id}`

      const results = await Database
        .raw(strgSQL)

      const obj = {}
      obj.list = results.rows
      return obj
    } catch (err) {
      console.log(err)
      return response
        .status(400)
        .send({ message: "Erro ao Buscar Dados" })
    }
  }
  async DesAssocia({ params, request, response }) {
    try {

      const { paciente_id, comprador_id } = request._all
      let _id = params.id
      if (_id) {
        const exame = await Exame.findByOrFail('id', _id)
        if (exame.status != Constants.EXAME_STATUS_ASSOCIADO) {
          return response
            .status(400)
            .send({ message: "Erro ao Desassociar Exames - Apenas exames com status associado podem ser desassociados" })
        }
        else {
          if (exame.paciente_id != paciente_id) {
            return response
              .status(400)
              .send({ error: { message: 'Erro ao Desassociar Exames - paciente ou comprador incorretos' } })

          }
          else {
            exame.merge({ paciente_id: null, status: Constants.EXAME_STATUS_VENDIDO })
            let _ret = await exame.save()
            return response
              .status(200)
              .send({ message: 'Atualizado com sucesso', ret:_ret })
          }
        }
      }
      else {
        return response
          .status(400)
          .send({ message: "Erro ao Desassociar Exames - Exame não encontrado" })

      }

    } catch (err) {
      console.log(err)
      return response
        .status(400)
        .send({ message: "Erro ao Desassociar Exames" })
    }

  }
}

module.exports = ExamsByPacienteController
