'use strict'
const Exame = use('App/Models/Exame')
const Person = use('App/Models/Person')
const Historico = use('App/Models/Historico')
const File = use('App/Models/File')
const Env = use('Env')
const Helpers = use('Helpers')
const dayjs = require('dayjs')

class ColetarController {
  async update ({ request, response, params, auth }) {
    try {
      const exams = await Exame.findByOrFail('id', params.id)

      const file = request.file('file', {
        types: ['image'],
        size: '5mb'
      })

      const file2 = request.file('file2', {
        types: ['image'],
        size: '5mb'
      })

      const file3 = request.file('file3', {
        types: ['image'],
        size: '5mb'
      })

      const file4 = request.file('file4', {
        types: ['image'],
        size: '5mb'
      })

      const file5 = request.file('file5', {
        types: ['image'],
        size: '5mb'
      })

      const randNumber  = Math.floor(100000 + Math.random() * 900000)
      const randNumber2 = Math.floor(100000 + Math.random() * 900000)
      const randNumber3 = Math.floor(100000 + Math.random() * 900000)
      const randNumber4 = Math.floor(100000 + Math.random() * 900000)
      const randNumber5 = Math.floor(100000 + Math.random() * 900000)

      const user = await auth.getUser()
    

      const name  = `${randNumber}.${file.subtype}`
      await file.move(Helpers.publicPath('uploads'), {
        name: name
      })
      if (!file.moved()) {
        return file.error()
      }

      const name2 = `${randNumber2}.${file2.subtype}`
      await file2.move(Helpers.publicPath('uploads'), {
        name: name2
      })
      if (!file2.moved()) {
        return file2.error()
      }

      const name3 = `${randNumber3}.${file3.subtype}`
      await file3.move(Helpers.publicPath('uploads'), {
        name: name3
      })
      if (!file3.moved()) {
        return file3.error()
      }

      // file4
      let name4
      if(this.file4 != null) {
       name4 = `${randNumber4}.${file4.subtype}`
        await file4.move(Helpers.publicPath('uploads'), {
          name: name4
        })  
        if (!file4.moved()) {
          return file4.error()
        }
      }
      
      let name5
      if(this.file5 != null) {
      name5 = `${randNumber5}.${file5.subtype}`
      await file5.move(Helpers.publicPath('uploads'), {
        name: name5
      })
      if (!file5.moved()) {
        return file5.error()
      }
      }
        
   
    
      const filexam = await File.create({
        file: name,
        name: file.clientName,
        type: file.type,
        subtype: file.subtype
      })

      const filexam2 = await File.create({
        file: name2,
        name: file2.clientName,
        type: file2.type,
        subtype: file2.subtype
      })
      const filexam3 = await File.create({
        file: name3,
        name: file3.clientName,
        type: file3.type,
        subtype: file3.subtype
      })

      
      const filexam4 = name4 != null ? await File.create({
        file: name4,
        name: file4.clientName,
        type: file4.type,
        subtype: file4.subtype
      }) : null

      const filexam5 = name4 != null ? await File.create({
        file: name5,
        name: file5.clientName,
        type: file5.type,
        subtype: file5.subtype
      }) : null


      const dataColeta = new Date()
      const data = request.only([
        'paciente_id',
        'loteExame',
        'sintomas',
        'sintDesde',
        'febre',
        'fadiga',
        'coriza',
        'tosse',
        'faltadeAr',
        'dorGarganta',
        'dorCabeca',
        'perdaOlfato',
        'perdaPaladar',
        'calafrios',
        'dorCorpo',
        'diarreia',
        'contato10d',
        'tituloimagem01',
        'tituloimagem02',
        'tituloimagem03',
        'tituloimagem04',
        'tituloimagem05',
        'queixaprincipal',
        'localqueixa',
        'quandolesoesapareceram',
        'velocidadelesao',
        'lesaooutraspartes',
        'lesaooutraspartesr',
        'tamanhoecor',
        'passoutopico',
        'passoutopicor',
        'fatoresmelhora',
        'fatoresmelhorar',
        'fatorespiora',
        'fatorespiorar',
        'sentiufebre',
        'vomito',
        'diarreiax',
        'mudancasuor',
        'recidivas',
        'outraslesoes',
        'qualqueixa',
        'formigamentos',
        'dormencia',
        'perdaforca',
        'quandocomecou',
        'conviviosemelhante',
        'forma',
        'tamanho',
        'limites',
        'superficie',
        'consistencia',
        'temperatura',
        'sensibilidade',
        'altmucosas',
        'altmucosasr',
        'alteracoesareas',
        'orgaosgenitais',
        'orgaosgenitaisr',
        'anus',
        'anusr',
        'cabelo',
        'cabelor',
        'unhas',
        'unhasr',
        'linfonodos',
        'linfonodosr',
        'sentedor',
        'senteardor',
        'sentedormencia',
        'sentecalor',
        'sentecoceira'
      

      ])
      const status = 2
      const url = `${Env.get('APP_URL')}/files/${filexam.id}`
      const url2 = `${Env.get('APP_URL')}/files/${filexam2.id}`
      const url3 = `${Env.get('APP_URL')}/files/${filexam3.id}`
      const url4 = filexam4 != null ? `${Env.get('APP_URL')}/files/${filexam4.id}` : null
      const url5 = filexam5 != null ? `${Env.get('APP_URL')}/files/${filexam5.id}` : null
      const item = {}
      item.paciente_id = data.paciente_id
      item.loteExame = data.loteExame
      item.sintomas = data.sintomas
      item.febre = data.febre
      item.fadiga = data.fadiga
      item.coriza = data.coriza
      item.tosse = data.tosse
      item.faltadeAr = data.faltadeAr
      item.dorCabeca = data.dorCabeca
      item.perdaOlfato = data.perdaOlfato
      item.perdaPaladar = data.perdaPaladar
      item.calafrios = data.calafrios
      item.dorCorpo = data.dorCorpo
      item.dorCorpo = data.dorCorpo
      item.contato10d = data.contato10d
      item.tituloimagem01 = data.tituloimagem01
      item.tituloimagem02 = data.tituloimagem02
      item.tituloimagem03 = data.tituloimagem03
      item.tituloimagem04 = data.tituloimagem04
      item.tituloimagem05 = data.tituloimagem05
      item.forma = data.forma
      item.tamanho = data.tamanho
      item.limites = data.limites
      item.superficie = data.superficie
      item.consistencia = data.consistencia
      item.temperatura = data.temperatura
      item.sensibilidade = data.sensibilidade
      item.alteracoesareas = data.alteracoesareas
      item.altmucosas = data.altmucosas
      item.altmucosasr = data.altmucosasr
      item.orgaosgenitais = data.orgaosgenitais
      item.orgaosgenitaisr = data.orgaosgenitaisr
      item.anus = data.anus
      item.anusr = data.anusr
      item.cabelo = data.cabelo
      item.cabelor = data.cabelor
      item.unhas = data.unhas
      item.unhasr = data.unhasr
      item.linfonodos = data.linfonodos
      item.linfonodosr = data.linfonodosr
      item.queixaprincipal = data.queixaprincipal
      item.localqueixa = data.localqueixa
      item.quandolesoesapareceram = data.quandolesoesapareceram
      item.velocidadelesao = data.velocidadelesao
      item.lesaooutraspartes = data.lesaooutraspartes
      item.lesaooutraspartesr = data.lesaooutraspartesr
      item.passoutopico = data.passoutopico
      item.passoutopicor = data.passoutopicor
      item.fatoresmelhora = data.fatoresmelhora
      item.fatoresmelhorar = data.fatoresmelhorar
      item.fatorespiora = data.fatorespiora
      item.fatorespiorar = data.fatorespiorar
      item.sentiufebre = data.sentiufebre
      item.vomito = data.vomito
      item.diarreiax = data.diarreiax
      item.mudancasuor = data.mudancasuor
      item.recidivas = data.recidivas
      item.outraslesoes = data.outraslesoes
      item.qualqueixa = data.qualqueixa
      item.formigamentos = data.formigamentos
      item.dormencia = data.dormencia
      item.perdaforca = data.perdaforca
      item.quandocomecou = data.quandocomecou
      item.conviviosemelhante = data.conviviosemelhante
      item.tamanhoecor = data.tamanhoecor
      item.sentedor = data.sentedor
      item.senteardor = data.senteardor
      item.sentedormencia = data.sentedormencia
      item.sentecalor = data.sentecalor
      item.sentecoceira = data.sentecoceira
      
      if (data.sintomas == 1) {
        item.sintDesde = data.sintDesde
      }
      item.dataColeta = dataColeta

      exams.merge({ ...item, coletador_id: auth.user.person_id, status: status, fileExame: url, fileExame2: url2, fileExame3: url3, fileExame4: url4, fileExame5: url5 })
      await exams.save()

       const now = dayjs(new Date())

        await Historico.create({
          exameId: exams.id,
          dataColeta: now,
          status: status ,
          userId: user.id
        }) 

      return exams
    } catch (err) {
      console.log(err)
      return response
        .status(400)
        .send({ error: { message: 'Erro Ao Coletar Exame', err } })
    }
  }
}

module.exports = ColetarController
