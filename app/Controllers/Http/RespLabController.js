'use strict'
const Person = use('App/Models/Person')
const Database = use('Database')
const Helpers = use('Helpers')
const User = use('App/Models/User')
const File = use('App/Models/File')
const Env = use('Env')
const fs = require('fs')
const { eventNames } = require('cluster')

const Constants = use('App/Constants/Constants')

class RespLabController {
  async show({ params }) {
    const respLab = await Person.findByOrFail('id', params.id)

    return respLab
  }

  async index({ request, auth, response }) {
    try {
      const list = await Database.raw(`SELECT
          people."id",
          people.nome,
          people.doc,
          people.contato1,
          people.contato2,
          people."codProfissao"
        FROM
          users
          INNER JOIN
          people
          ON
            users.person_id = people."id"
        WHERE
          users."typeRespLab" = ${Constants.typeRespLab}
          and people.lab_id = ${auth.user.person_id} ;`

      )
      const obj = {}
      obj.list = list.rows
      return obj
    } catch (err) {
      console.log(err)
      return response
        .status(400)
        .send({ error: { message: err } })
    }
  }

  async store({ request, response, auth }) {
    try {
      const data = request.only([
        'nome',
        'doc',
        'contato1',
        'contato2',
        'codProfissao',
        'email',
        'password',
        'cep',
        'logradouro',
        'numero',
        'complemento',
        'bairro',
        'cidade',
        'uf'
      ])

      const exists = await Person.findBy('doc', data.doc)

      if (exists) {

        await respLab.users().create({
          username: data.doc, password: data.password, typeRespLab: Constants.typeRespLab, person_id: respLab.id
        })

        return response
          .send({ message: 'Usuario Já Cadastrado' })
          
      } else {
        // Upload da assinatura
        const images = request.file('file', {
          types: ['image'],
          size: '5mb'
        })

        const name = `${new Date().getTime()}.${images.subtype}`
        await images.move(Helpers.publicPath('uploads'), {
          name: name
        })

        if (!images.moved()) {
          return images.error()
        }

        // Criação do Laboratorio
        const respLab = await Person.create({
          nome: data.nome,
          doc: data.doc,
          contato1: data.contato1,
          contato2: data.contato2,
          cep: data.cep,
          logradouro: data.logradouro,
          numero: data.numero,
          complemento: data.complemento,
          bairro: data.bairro,
          cidade: data.cidade,
          uf: data.uf,
          lab_id: auth.user.person_id
        })

        // Salvando dados do arquivo

        await File.create({
          file: name,
          name: images.clientName,
          type: images.type,
          subtype: images.subtype,
          person_id: respLab.id
        })

        await respLab.users().create({
          username: data.doc, password: data.password, typeRespLab: Constants.typeRespLab, person_id: respLab.id
        })

        const fileId = await File.findByOrFail('person_id', respLab.id)

        respLab.merge({ 
          url: `${Env.get('APP_URL')}/files/${fileId.id}` ,
          lab_id: auth.id
        })

        await respLab.save()

        return response
          .status(200)
          .send({ message: 'Responsavel Incluido com sucesso' })
      }
    } catch (error) {
      console.log(error)
      return response
        .status(400)
        .send({ error: { message: "Erro ao inserir Resp. de Lab." } })
    }
  }

  async update({ request, response, auth, params }) {
    try {
      const data = request.only([
        'nome',
        'doc',
        'codProfissao',
        'contato1',
        'contato2',
        'email',
        'password',
        'cep',
        'logradouro',
        'numero',
        'complemento',
        'bairro',
        'cidade',
        'uf'
      ])
      const file = request.file('file', {
        types: ['image'],
        size: '5mb'
      })
      let url = ''
      console.log('login_id: ',auth.user.id)
      if(!data.password) {        
        data.password = '123456'
      }
      let newFile = ''
      const respLab = await Person.findByOrFail('id', params.id)
      const ass = await File.findByOrFail('person_id', params.id)      
      
      console.log('RespLab_ID: ', respLab.id)
      if (!respLab.url && !file) {        
        console.log('Erro do Arquivo')
        return response.status(400).json({ error:'Arquivo Obrigatorio'})         
       }   

      const name = `${new Date().getTime()}.${file.subtype}`
      console.log('Teste Arquivo')
      if(respLab.url && file){ 
        console.log('Destruir Arquivo Antigo / Atualizar novo')
                
        try {
          await fs.unlinkSync(`public/uploads/${ass.file}`)
          console.log(`O arquivo ${ass.file} foi removido`)

        } catch (err) {
          console.log('erro ao excluir arquivo' + err)
        }
        console.log('Atulalizar')
        
        await file.move(Helpers.publicPath('uploads'), {
          name: name
        })

        if (!file.moved()) {
          return file.error()
        }
        ass.merge({
          file: name,
          name: file.clientName,
          type: file.type,
          subtype: file.subtype,
          person_id: params.id
        })

        newFile = await ass.save()
        console.log('newFile: ',newFile)
      } 
      if(!respLab.url && file) {
        console.log('Add file')
        await file.move(Helpers.publicPath('uploads'), {
          name: name
        })

        if (!file.moved()) {
          return file.error()
        }
        
        await File.create({
          file: name,
          name: file.clientName,
          type: file.type,
          subtype: file.subtype,
          person_id: params.id
        })
      }      
      
      const user = await User.findBy('username', respLab.doc)

      if(!user) {         
        await user.create({
          username: data.doc, 
          password: data.password, 
          typeRespLab: true, 
          person_id: params.id
        })

        respLab.merge({
          nome: data.nome,
          doc: data.doc,
          contato1: data.contato1,
          contato2: data.contato2,
          email: data.email,
          codProfissao: data.codProfissao,
          cep: data.cep,
          logradouro: data.logradouro,
          numero: data.numero,
          complemento: data.complemento,
          bairro: data.bairro,
          cidade: data.cidade,
          uf: data.uf,
          lab_id: auth.user.id,
          url: `${Env.get('APP_URL')}/files/${ass.id}`,
        })
        await respLab.save()

      } else { 
        if (!user.typeRespLab) {
          user.merge({
            typeRespLab: true          
          })
          await user.save() 
        }        
      }

      return response
        .status(200)
        .send({ message: 'Responsavel Atualizado com sucesso' })
    } catch (err) {
      console.log(err)
      return response
        .status(400)
        .send({ error: { message: err } })
    }
  }

  async destroy({ params, request, response }) {
    try {
      const respLab = await Person.findBy('id', params.id)
      if (!respLab) {
        return response
          .status(400)
          .send({ error: { message: 'Não existe esse Responsavel' } })
      }

      await respLab.users().update({
        typeRespLab: false
      })

      return response
        .status(200)
        .send({ message: 'Responsavel Excluído com sucesso' })
    } catch (err) {
      console.log(err)
      return response
        .status(400)
        .send({ error: { message: err } })
    }
  }
}

module.exports = RespLabController
