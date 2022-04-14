'use strict'
const Database = use('Database')
const Constants = use('App/Constants/Constants')

class SearchExameController {
  async search({ params, request, response, auth }) {
    try {
      /*  this.pesquisa.idExame = '';
  this.pesquisa.idExame = "";
  this.pesquisa.paciente = "";s
  this.pesquisa.marca = "";
  this.pesquisa.ordem_search = "dhDec";
  this.pesquisa.laudo = '*';
  this.pesquisa.inicio = new Date().toISOString().slice(0, 10);
  this.pesquisa.fim = new Date().toISOString().slice(0, 10); */
      const data = request.only(['id', 'idExame', 'teste', 'inicio', 'status', 'fim', 'laudo',
        'listar', 'paciente',
        'ordem_search', 'revenda_comprador', 'venda_comprador'])

      console.log('data ', data)
      
      let strgSQL = `select e.id, 
        coalesce(e."resultadoText",'') as resultado,
        p.nome as paciente_nome,
        CONCAT(SUBSTRING(p.doc,1,3),'.',SUBSTRING(p.doc,4,3),'.',SUBSTRING(p.doc,7,3),'-',SUBSTRING(p.doc,10,2)) as paciente_doc,
        e."dataColeta", 
        e."dataResultado", 
        l.nome as lab_nome, 
        t.nome as teste_nome,
        revP.nome as correlata,
        case when revP."doc" is not null then
          CONCAT(substring(revP."doc",1,2),'.',substring(revP."doc",3,3),'.',substring(revP."doc",6,3),'/',substring(revP."doc",9,4),'-',substring(revP."doc",13,2)) 
        else
          ''
        end
        as "CNPJ",
        revP.cidade as Cidade,
        revP.uf as Estado,   
        vendP.nome as comprador_nome, 
        vendP.cidade as comprador_cidade,
        vendP.uf as comprador_estado,
        rev.comprador_id as correlata_id,`

      if (data.listar == 'analitico')
        strgSQL += `  		 e."loteExame" as lote, 
        e."dataValidadeExame" as "dataValidadeExame",
        case e.contato10d when true then 'S' Else 'N' end as "contato10d",
        case e.sintomas when true then 'S' Else 'N' end as Sintomas,
        e."sintDesde",
        case e.febre when true then 'S' Else 'N' end as Febre,
        case e.tosse when true then 'S' Else 'N' end as Tosse,
        case e."faltadeAr" when true then 'S' Else 'N' end as "faltadeAr",
        case e."dorCorpo" when true then 'S' Else 'N' end as "dorCorpo",
         case e."dorGarganta" when true then 'S' Else 'N' end as  "dorGarganta",
          case e."dorCabeca" when true then 'S' Else 'N' end as "dorCabeca",
           case e."perdaOlfato" when true then 'S' Else 'N' end as "perdaOlfato",
           case e."perdaPaladar" when true then 'S' Else 'N' end as "perdaPaladar",
           case e.calafrios when true then 'S' Else 'N' end as calafrios,
           case e.diarreia when true then 'S' Else 'N' end as diarreia,
           p.raca as "raca",
           case p.sexo when '1' then 'M' Else 'F' end as Sexo,
           case p.psaude when true then 'S' Else 'N' end as "psaude",
           case p.pseg when true then 'S' Else 'N' end as "pseg",
           case p.diabetes when true then 'S' Else 'N' end as "diabetes",
           case p.pdcardiaca when true then 'S' Else 'N' end as "pdcardiaca",
           case p.pdcardiaca2 when true then 'S' Else 'N' end as "pdcardiaca2",
           case p.palergias when true then 'S' Else 'N' end as "palergias",
           case p.patopias when true then 'S' Else 'N' end as "patopias",
           case p.pcirurgias when true then 'S' Else 'N' end as "pcirurgias",
           case p.imunossupressao when true then 'S' Else 'N' end as "imunossupressao",
           case p.pdrespcronica when true then 'S' Else 'N' end as "pdrespcronica",
           case p.pdcromossomica when true then 'S' Else 'N' end as "pdcromossomica",
           case p.pdrenalcronica when true then 'S' Else 'N' end as "pdrenalcronica",
           case p.gestanterisco when true then 'S' Else 'N' end as "gestanterisco",
           
     `;


      strgSQL += `case  e.status
            when  ${Constants.EXAME_STATUS_VENDIDO} then 'Vendido'
            when  ${Constants.EXAME_STATUS_ASSOCIADO} then 'Associado'
            when  ${Constants.EXAME_STATUS_COLETADO} then 'Coletado'
            when  ${Constants.EXAME_STATUS_LAUDADO} then 'Laudado'
            Else '...'
          end as status
          From exames e
           left join people c on c.id=e."respLab_id"
          left join people l on l.id=e.lab_id
          left join people p on p.id=e.paciente_id
          left join testes t on t.id=e.teste_id
          inner join vendas v on v.id=e.venda_id
          left join revendas rev on rev.id=e.revenda_id
          left join people revP on revP.id=rev.comprador_id
          left join people vendP on vendP.id=v.comprador_id
          where (false `

      if (auth.user.typeRoot || auth.user.typeAdministrativo || auth.user.typeVendedor || auth.user.typeRespLab ) { strgSQL += ' or true ' }
      if (auth.user.typeEmpresa || auth.user.typeMedico  ) { strgSQL += ' or v.comprador_id= ' + auth.user.person_id }
      if (auth.user.typeLaboratorio ) { strgSQL += ' or (e.lab_id= ' + auth.user.person_id + ' and e.status> ' + Constants.EXAME_STATUS_ASSOCIADO + ')' }

      strgSQL += ')'

      if (data.venda_comprador && data.venda_comprador > 0) {
        strgSQL += ' and v.comprador_id=' + data.venda_comprador

      }
      if (data.revenda_comprador && data.revenda_comprador > 0) {
        strgSQL += ' and rev.comprador_id=' + data.revenda_comprador

      }

      /// filtros
      // const data = request.only(['id', 'idExame', 'marca', 'inicio', 'fim', 'laudo', 'marca', 'ordem_search'])
      if (data.idExame) {
        strgSQL += ' and e.id=' + data.idExame
      }
      if (data.inicio && data.inicio != '') {
        strgSQL += ` and  e."dataColeta" is not null and  e."dataColeta"::date >= '${data.inicio} '`
      }
      if (data.fim && data.fim != '') {
        strgSQL += ` and  e."dataColeta" is not null and   e."dataColeta"::date <= '${data.fim}' `
      }
      if (data.teste && data.teste > 0) {
        strgSQL += ` and  e.teste_id = '${data.teste}' `
      }
      if (data.laudo && data.laudo != '*') {
        strgSQL += ` and  e."resultadoText" = '${data.laudo}' `
      }
      if (data.status && data.status != '*') {
        strgSQL += ` and  e."status" = '${data.status}' `
      }

      if (data.paciente && data.paciente != '') {
        strgSQL += ` and  p.nome ilike '%${data.paciente}%' `
      }

      switch (data.ordem_search) {
        case 'dhDec': // dhDec	 Data e Hora Decrescente
          strgSQL += ' order by e."dataColeta" desc'
          break
        case 'dhCresc': // dhDec	 Data e Hora Crescente
          strgSQL += ' order by e."dataColeta"'
          break
        case 'idDec': // ID Exame Decrescente
          strgSQL += ' order by e.id desc'
          break
        case 'idCresc': // ID Exame Crescente
          strgSQL += ' order by e.id'
          break
        case 'paciente': // Paciente
          strgSQL += ' order by p.nome'
          break
        case 'teste': // Paciente
          strgSQL += ' order by t.nome'
          break
        case 'resultados': // Paciente
          strgSQL += ' order by  e."resultadoType" '
          break
        default:
          strgSQL += ' order by  e."dataColeta"  desc'
          break
      }

      console.log(strgSQL)
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
  async searchExamesParaRevenda({ params, request, response, auth }) {
    try {
      let _comprador_id = params.id
      if (!_comprador_id) {
        return response
          .status(409)
          .send({ message: 'Comprador não encontrado' })
      }

      let strgSQL = `select t.id, t.nome as teste_nome,
          sum(case when   (e.revenda_id is  null or e.revenda_id=0) then 1 else 0 end) as disponiveis,
          sum(case when  (e.revenda_id>0) then 1 else 0 end) as revendidos

          From exames e
          left join testes t on t.id=e.teste_id
          inner join vendas v on v.id=e.venda_id
          where v.comprador_id=${_comprador_id}
          group by  t.id, t.nome`


      console.log(strgSQL)
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

module.exports = SearchExameController
