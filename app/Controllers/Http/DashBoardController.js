'use strict'

const Database = use('Database')
const CONSTANTS = use('App/Constants/Constants')


class DashBoardController {

    async testesCount() {
        const count = await Database
            .from('testes')
            .getCount()
        let obj = {}
        obj.ret = "ok"
        obj.count = count;
        return obj
    }
    async medicosCount({ request, response }) {
        const count = await Database
            .from('users')
            .where('typeMedico', CONSTANTS.typeMedico)
            .getCount()
        let obj = {}
        obj.ret = "ok"
        obj.count = count;
        return obj
    }
    async laboratoriosCount({ request, response }) {
        const count = await Database
            .from('users')
            .where('typeLaboratorio', CONSTANTS.typeLaboratorio)
            .getCount()
        let obj = {}
        obj.ret = "ok"
        obj.count = count;
        return obj
    }

    async empresasCount({ params, request, response }) {
        const count = await Database
            .from('users')
            .where('typeEmpresa', CONSTANTS.typeEmpresa)
            .getCount()
        let obj = {}
        obj.ret = "ok"
        obj.count = count;
        return obj
    }

    async examesCount({ params, request, response, auth }) {
        let obj = {}
        obj.ret = "ok"
        obj.count = 0;
        try {

            if ((auth.user.typeRoot || auth.user.typeAdministrativo || auth.user.typeVendedor)) {
                let strgSQL = `select count(e.id) as amount from exames e`
                const results = await Database
                    .raw(strgSQL)
                obj.count = results.rows[0].amount
            }
            else {
                if (auth.user.typeEmpresa || auth.user.typeMedico) {
                    let strgSQL = `select count(e.id) as amount
                    from exames e
                    inner join vendas v on v.id=e.venda_id
                    where  v.comprador_id = ${auth.user.person_id}`
                    const results = await Database
                        .raw(strgSQL)
                    obj.count = results.rows[0].amount
                } else {
                    if (auth.user.typeLaboratorio) {
                        let strgSQL = `select count(e.id) as amount
                        from exames e
                        where e.lab_id = ${auth.user.person_id} and e.status>${CONSTANTS.EXAME_STATUS_ASSOCIADO}`

                        console.log('strgSQL',strgSQL)
                        const results = await Database
                        .raw(strgSQL)
                        obj.count = results.rows[0].amount

                    } else {
                        obj.count = 0
                    }

                }

            }
            return obj
        } catch (err) {
            console.log(err)
            return response
                .status(400)
                .send({ message: "Erro ao Buscar Dados de DashBoard - examesCount" })
        }
    }

    async examesLaudados({ request, response }) {
        const { ano } = request.only(['ano'])
        
        try {
            
            let results = await Database.raw( ` select 
                sum (case when "dataResultado" between '${ano}-01-01 00:00:00' and  '${ano}-01-31 23:59:59' Then 1 Else 0 end) as "Janeiro",
                sum (case when "dataResultado" between '${ano}-02-01 00:00:00' and  '${ano}-02-28 23:59:59' Then 1 Else 0 end) as "Fevereiro",
                sum (case when "dataResultado" between '${ano}-03-01 00:00:00' and  '${ano}-03-31 23:59:59' Then 1 Else 0 end) as "Março",
                sum (case when "dataResultado" between '${ano}-04-01 00:00:00' and  '${ano}-04-30 23:59:59' Then 1 Else 0 end) as "Abril", 
                sum (case when "dataResultado" between '${ano}-05-01 00:00:00' and  '${ano}-05-31 23:59:59' Then 1 Else 0 end) as "Maio",
                sum (case when "dataResultado" between '${ano}-06-01 00:00:00' and  '${ano}-06-30 23:59:59' Then 1 Else 0 end) as "Junho", 
                sum (case when "dataResultado" between '${ano}-07-01 00:00:00' and  '${ano}-07-31 23:59:59' Then 1 Else 0 end) as "Julho",
                sum (case when "dataResultado" between '${ano}-08-01 00:00:00' and  '${ano}-08-31 23:59:59' Then 1 Else 0 end) as "Agosto",
                sum (case when "dataResultado" between '${ano}-09-01 00:00:00' and  '${ano}-09-30 23:59:59' Then 1 Else 0 end) as "Setembro",
                sum (case when "dataResultado" between '${ano}-10-01 00:00:00' and  '${ano}-10-31 23:59:59' Then 1 Else 0 end) as "Outubro", 
                sum (case when "dataResultado" between '${ano}-11-01 00:00:00' and  '${ano}-11-30 23:59:59' Then 1 Else 0 end) as "Novembro",	
                sum (case when "dataResultado" between '${ano}-12-01 00:00:00' and  '${ano}-12-30 23:59:59' Then 1 Else 0 end) as "Dezembro"
                from exames `
            )
            
            let obj = {}
            obj.status = 200
            obj.ok = true
            obj.list = results.rows[0]

           return obj
            
        } catch (err) {
             return response
                .status(400)
                .send({ msg: err.message })            
        }
    }

    async listRevendas ({ request, response, auth }) {
        const data = request.only(['inicial', 'final'])

        // console.log(data.inicial + ' e ' + data.final)

        const reve = await Database.raw(`select e.id, coalesce(e."resultadoText",'') as resultado,p.nome as paciente_nome,
        CONCAT(SUBSTR(p.doc,1,3),'.',SUBSTR(p.doc,4,3),'.',SUBSTR(p.doc,7,3),'-',SUBSTR(p.doc,10,2)) as CPF,
        t.nome as teste_nome, e."resultadoText",
                e."dataColeta", e."dataResultado", l.nome as "Laboratório",vendP.nome as comprador_nome,
                revP.nome as Correlata,
                revP.doc as CNPJ,
                revP.cidade as Cidade,
                revP.estado as Estado,
                rev.comprador_id as correlata_id,

                             e."loteExame" as lote, e."dataValidadeExame" as "Data de Validade do Cassete",
                             case e.contato10d when true then 'X' Else '' end as "Contato com Infectado nos ultimos 14 dias",
                             case e.sintomas when true then 'X' Else '' end as Sintomas,
                             e."sintDesde" as "Sintomas Desde",
                             case e.febre when true then 'X' Else '' end as Febre,
                             case e.tosse when true then 'X' Else '' end as Tosse,
                             case e."faltadeAr" when true then 'X' Else '' end as "Falta de Ar",
                             case e."dorCorpo" when true then 'X' Else '' end as "Dor no Corpo",
                              case e."dorGarganta" when true then 'X' Else '' end as  "Dor de Garganta",
                                 case e."dorCabeca" when true then 'X' Else '' end as "dorCabeca",
                                  case e."perdaOlfato" when true then 'X' Else '' end as "perdaOlfato",
                                    case e."perdaPaladar" when true then 'X' Else '' end as "perdaPaladar",
                                    case e.calafrios when true then 'X' Else '' end as calafrios,
                                    case e.diarreia when true then 'X' Else '' end as diarreia,
                                    p.raca as "Raça",
                                    case p.sexo when '1' then 'M' Else 'F' end as Sexo,
                                    case p.diabetes when true then 'X' Else '' end as "Diabetes",
                                    case p.pdcardiaca when true then 'X' Else '' end as "pdcardiaca",
                                    case p.pdcardiaca2 when true then 'X' Else '' end as "pdcardiaca2",
                                    case p.palergias when true then 'X' Else '' end as "palergias",
                                    case p.patopias when true then 'X' Else '' end as "patopias",
                                    case p.pcirurgias when true then 'X' Else '' end as "pcirurgias",
                                    case p.imunossupressao when true then 'X' Else '' end as "imunossupressao",
                                    case p.pdrespcronica when true then 'X' Else '' end as "Doença Resp. Crônica?",
                                    case p.pdcromossomica when true then 'X' Else '' end as "Doença Cromossômica?",
                                    case p.pdrenalcronica when true then 'X' Else '' end as "Doença Renal?",
                                    case p.gestanterisco when true then 'X' Else '' end as "Gestão de Risco?",

          case  e.status
                    when  0 then 'Vendido'
                    when  1 then 'Associado'
                    when  2 then 'Coletado'
                    when  3 then 'Laudado'
                    Else '...'
                  end as status

                  From exames e
                  left join people l on l.id=e.lab_id
                  left join people p on p.id=e.paciente_id
                  left join testes t on t.id=e.teste_id
                  inner join vendas v on v.id=e.venda_id
                  left join revendas rev on rev.id=e.revenda_id
                  left join people revP on revP.id=rev.comprador_id
                  left join people vendP on vendP.id=v.comprador_id
                  where v.comprador_id = 843
                            and e.status=3

                            order by e."dataColeta" desc
                and  e."dataResultado"::date >= ${data.inicial}
                            and  e."dataResultado" is not null
                            and   e."dataResultado"::date <= ${data.final}`
        )

       console.log(reve)
    }
}
module.exports = DashBoardController
