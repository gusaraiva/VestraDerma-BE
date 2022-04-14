'use strict'
const Database = use('Database')
const Event = use('Event')

class ShowExameController {
  async show ({ params, response }) {
    try {
      // const results = await Resultado.all()

      const strgSQL = `select e.id, e."loteExame",e."dataValidadeExame",e.sintomas,e."sintDesde",e.febre,e.coriza,e.fadiga,
          e.tosse, e."faltadeAr", e."dorGarganta", e."dorCabeca", e."perdaOlfato",
          e."perdaPaladar", e.calafrios, e."dorCorpo", e.diarreia,
          e.contato10d, e."dataColeta",coalesce(e."resultadoText",'') as resultado, 
          e."dataColeta", e."dataResultado", t.nome as teste_nome, c.nome as c_name, c."codProfissao" as crm, c.email as email,
            case  e.status
              when  0 then 'Vendido'
              when  1 then 'Associado'
              when  2 then 'Coletado'
              when  3 then 'Laudado'
              Else '...'
            end as statusText,
            e."fileExame", 
            e."fileExame2", 
            e."fileExame3", 
            e."fileExame4", 
            e."fileExame5",
            e.tituloimagem01,
            e.tituloimagem02,
            e.tituloimagem03,
            e.tituloimagem04,
            e.tituloimagem05,
            e."fileLaudo",
            e."pdfCreate",
            p.nome as paciente_nome, 
            p.doc, 
            p.birth_date,
            p.pdrespcronica,
            p.drespcronica,
            p.pdcromossomica,
            p.dcromossomica,
            p.diabetes,
            p.imunossupressao,
            p.pdcardiaca,
            p.dcardiaca,
            p.pdcardiaca2,
            p.dcardiaca2,
            p.palergias,
            p.dalergias,
            p.patopias,
            p.datopias,
            p.pcirurgias,
            p.dcirurgias,
            p.tcirurgia,
            p.tinternacao,
            p.gestanterisco,
            p.gestacaohistoria,
            p.tempogestacao,
            p.pdrenalcronica,
            p.drenalcronica,
            p.transsangue,
            p.transsangTempo,
            p.carteiravac,
            p.carteiravacq,
            p.cartvacatraso,
            p.usodrogas,
            p.usodrogasr,
            p.viagemrecente,
            p.viagemrecenter,
            p.tipoalimentacao,
            p.atividadesexual,
            p.detalhedevpsico,
            p.atividadefisica,
            p.mediasono,
            p.mediaingesthidrica,
            p.ingestbebidaalcoolica,
            e.queixaprincipal,
            e.localqueixa,
            e.quandolesoesapareceram,
            e.velocidadelesao,
            e.lesaooutraspartes,
            e.lesaooutraspartesr,
            e.tamanhoecor,
            e.passoutopico,
            e.passoutopicor,
            e.fatoresmelhora,
            e.fatoresmelhorar,
            e.fatorespiora,
            e.fatorespiorar,
            e.sentiufebre,
            e.vomito,
            e.diarreiax,
            e.mudancasuor,
            e.recidivas,
            e.outraslesoes,
            e.qualqueixa,
            e.formigamentos,
            e.dormencia,
            e.perdaforca,
            e.quandocomecou,
            e.conviviosemelhante,
            e.forma,
            e.tamanho,
            e.limites,
            e.superficie,
            e.consistencia,
            e.temperatura,
            e.sensibilidade,
            e.altmucosas,
            e.altmucosasr,
            e.alteracoesareas,
            e.orgaosgenitais,
            e.orgaosgenitaisr,
            e.anus,
            e.anusr,
            e.cabelo,
            e.cabelor,
            e.unhas,
            e.unhasr,
            e.linfonodos,
            e.linfonodosr,
            e.sentedor,
            e.senteardor,
            e.sentedormencia,
            e.sentecalor,
            e.sentecoceira,
            e.resultado2

            From exames e
            left join people p on p.id=e.paciente_id
            left join testes t on t.id=e.teste_id
            left join people c on c.id=e."respLab_id"
            
            where e.id= '${params.id}'`
      const results = await Database
        .raw(strgSQL)

      const obj = {}

      if(results.rows[0].statustext === 'Laudado' && results.rows[0].pdfCreate === false) {
        Event.fire('new::laudo', params.id)
      }    

      obj.exame = results.rows[0]
      return obj
    } catch (err) {
      console.log(err)
      return response
        .status(400)
        .send({ error: { message: err } })
    }
  }
}

module.exports = ShowExameController
