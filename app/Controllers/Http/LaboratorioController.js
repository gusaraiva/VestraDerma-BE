'use strict'
const Person = use('App/Models/Person')
const Database = use('Database')
const Helpers = use('Helpers')
const File = use('App/Models/File')
const UserUtils = use('App/Controllers/Http/UserUtils')
const User = use('App/Models/User')
const Env = use('Env')
const fs = require('fs')

const Constants = use('App/Constants/Constants')

class LaboratorioController {
  async show({ params }) {
    const Laboratorio = await Person.findByOrFail('id', params.id)

    return Laboratorio
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
          users."typeLaboratorio" = ${Constants.typeLaboratorio};`
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

      const data = request.only([
        'nome',
        'doc',
        'razaoSocial',
        'administrador',
        'tecnico',
        'docTecnico',
        'filial',
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

      // Criação do Laboratorio

      const laboratorio = await Person.create({
        nome: data.nome,
        doc: data.doc,
        contato1: data.contato1,
        contato2: data.contato2,
        email: data.email,
        razaoSocial: data.razaoSocial,
        administrador: data.administrador,
        tecnico: data.tecnico,
        docTecnico: data.docTecnico,
        filial: data.filial,
        sexo: data.sexo,
        status: data.status,
        cep: data.cep,
        logradouro: data.logradouro,
        numero: data.numero,
        complemento: data.complemento,
        bairro: data.bairro,
        cidade: data.cidade,
        uf: data.uf
      })

      // Salvando dados do arquivo
      const fileItem = {
        file: name,
        name: images.clientName,
        type: images.type,
        subtype: images.subtype,
        person_id: laboratorio.id
      }
      console.log('fileItem ', JSON.stringify(fileItem))

      const fileRet = await File.create(fileItem)

      console.log('fileRet ', JSON.stringify(fileRet))

      await laboratorio.users().create({
        username: data.doc, password: data.password, typeLaboratorio: Constants.typeLaboratorio, person_id: laboratorio.id
      })

      const fileId = await File.findByOrFail('person_id', laboratorio.id)

      
      laboratorio.merge({ url: `${Env.get('APP_URL')}/files/${fileId.id}` })

      await laboratorio.save()

      return response
        .status(200)
        .send({ message: 'Laboratorio Incluido com sucesso' })
    } catch (error) {
      console.log(error)
      return response
        .status(400)
        .send({ error: { message: error } })
    }
  }

  async update({ request, response, auth, params }) {
    try {

      console.log('env ', Env.get('APP_URL'))
      // let userUtils = new UserUtils();
      const laboratorio = await Person.findByOrFail('id', params.id)

      const file = request.file('file', {
        types: ['image'],
        size: '5mb'
      })
      const name = `${new Date().getTime()}.${file.subtype}`
      await file.move(Helpers.publicPath('uploads'), {
        name: name
      })

      if (!file.moved()) {
        return file.error()
      }

      if (file) {
        const ass = await File.findBy('person_id', params.id)
        if (ass) {
          try {
            await fs.unlinkSync(`public/uploads/${ass.file}`)
            console.log(`O arquivo ${ass.file} foi removido`)

          } catch (err) {
            console.log('erro ao excluir ' + err)
          }
        }
        ass.merge({
          file: name,
          name: file.clientName,
          type: file.type,
          subtype: file.subtype
        })
        const fileRet = await ass.save()
        laboratorio.merge({ url: `${Env.get('APP_URL')}/files/${fileRet.id}` })
      } else {
        const fileItem = {
          file: name,
          name: file.clientName,
          type: file.type,
          subtype: file.subtype,
          person_id: laboratorio.id
        }

        const fileRet = await File.create(fileItem)
        laboratorio.merge({ url: `${Env.get('APP_URL')}/files/${fileRet.id}` })


      }
    

      const data = request.only([
      'nome',
      'doc',
      'razaoSocial',
      'administrador',
      'tecnico',
      'docTecnico',
      'filial',
      'contato1',
      'contato2',
      'email',
      'cep',
      'logradouro',
      'numero',
      'complemento',
      'bairro',
      'cidade',
      'uf'
    ])

    laboratorio.merge({
      nome: data.nome,
      doc: data.doc,
      contato1: data.contato1,
      contato2: data.contato2,
      email: data.email,
      razaoSocial: data.razaoSocial,
      administrador: data.administrador,
      tecnico: data.tecnico,
      docTecnico: data.docTecnico,
      filial: data.filial,
      sexo: data.sexo,
      status: data.status,
      cep: data.cep,
      logradouro: data.logradouro,
      numero: data.numero,
      complemento: data.complemento,
      bairro: data.bairro,
      cidade: data.cidade,
      uf: data.uf
    })
    console.log('lab ',JSON.stringify(laboratorio))
    await laboratorio.save()



    if (laboratorio.users()) {      
      const user = await User.findBy('person_id', params.id)
      user.merge({typeLaboratorio: Constants.typeLaboratorio})
      await user.save();
    }
    else {
      await laboratorio.users().create({
        username: data.doc, password: data.password, typeLaboratorio: Constants.typeLaboratorio, person_id: laboratorio.id
      })

    }




    return response
      .status(200)
      .send({ message: 'Laboratorio Atualizado com sucesso' })
  } catch(err) {
    console.log(err)
    return response
      .status(400)
      .send({ error: { message: err } })
  }
}

async destroy({ params, request, response }) {
  try {
    const laboratorio = await Person.findBy('id', params.id)
    if (!laboratorio) {
      return response
        .status(400)
        .send({ error: { message: 'Não existe esse Laboratorio' } })
    }

    const troca = await laboratorio.users().update({
      typeLaboratorio: false
    })

    return response
      .status(200)
      .send({ message: 'Laboratorio Excluído com sucesso' })
  } catch (err) {
    console.log(err)
    return response
      .status(400)
      .send({ error: { message: err } })
  }
}
}
module.exports = LaboratorioController
