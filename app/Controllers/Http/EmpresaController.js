'use strict'
const Person = use('App/Models/Person')
const Database = use('Database')

const Constants = use('App/Constants/Constants')

class EmpresaController {
  async show({ params }) {
    const Empresa = await Person.findByOrFail('id', params.id)

    return Empresa
  }

  async index({ request, auth, response }) {
    try {
      const list = await Database.raw(`SELECT
          people."id",
          people.nome,
          people.doc,
          people.contato1,
          people.contato2,
          people."codProfissao",
          people."revendedor"
        FROM
          users
          INNER JOIN
          people
          ON
            users.person_id = people."id"
        WHERE
          users."typeEmpresa" = ${Constants.typeEmpresa} 
          or  users."typeRevendedor" = ${Constants.typeRevendedor} 
          order by  people.nome`
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
        'razaoSocial',
        'administrador',
        'filial',
        'contato1',
        'contato2',
        'email',
        'status',
        'password',
        'revendedor',
        'cep',
        'logradouro',
        'numero',
        'complemento',
        'bairro',
        'cidade',
        'uf'
      ])
   

      let _item =  {
        nome: data.nome,
        doc: data.doc,
        contato1: data.contato1,
        contato2: data.contato2,
        email: data.email,
        razaoSocial: data.razaoSocial,
        administrador: data.administrador,
        filial: data.filial,
        sexo: data.sexo,
        status: data.status,
        revendedor: data.revendedor && data.revendedor == "true" ? true : false,
        cep: data.cep,
        logradouro: data.logradouro,
        numero: data.numero,
        complemento: data.complemento,
        bairro: data.bairro,
        cidade: data.cidade,
        uf: data.uf
      }
      console.log('_item', JSON.stringify(_item))
      const Empresa = await Person.create(_item)

      await Empresa.users().create({
        username: data.doc, password: data.password, typeEmpresa: Constants.typeEmpresa, person_id: Empresa.id,
        typeRevendedor: data.revendedor && data.revendedor == "true" ? Constants.typeRevendedor : false
      })

      const obj = {}
      obj.ret = 'ok'
      obj.empresa = Empresa
      return obj
    } catch (error) {
      console.log(error)
      return response
        .status(400)
        .send({ message: error })
    }
  }

  async update({ request, response, auth, params }) {
    try {
      const Empresa = await Person.findByOrFail('id', params.id)

      const data = request.only([
        'nome',
        'doc',
        'razaoSocial',
        'administrador',
        'filial',
        'contato1',
        'contato2',
        'email',
        'status',
        'password',
        'revendedor',
        'cep',
        'logradouro',
        'numero',
        'complemento',
        'bairro',
        'cidade',
        'uf'
      ])


      console.log('data >> ', JSON.stringify(data))

      let _item = {
        nome: data.nome,
        doc: data.doc,
        contato1: data.contato1,
        contato2: data.contato2,
        email: data.email,
        razaoSocial: data.razaoSocial,
        administrador: data.administrador,
        filial: data.filial,
        sexo: data.sexo,
        status: data.status,
        revendedor: data.revendedor && data.revendedor == "true" ? true : false,
        cep: data.cep,
        logradouro: data.logradouro,
        numero: data.numero,
        complemento: data.complemento,
        bairro: data.bairro,
        cidade: data.cidade,
        uf: data.uf
      }
      JSON.stringify('_item', _item)
      Empresa.merge(_item)


      await Empresa.users().update({
        username: data.doc,
        password: data.password,
        typeEmpresa: Constants.typeEmpresa,
        person_id: Empresa.id,
        typeRevendedor: data.revendedor && data.revendedor == "true" ? Constants.typeRevendedor : false

      })
      await Empresa.save()

      const obj = {}
      obj.ret = 'ok'
      obj.empresa = Empresa
      return obj
    } catch (err) {
      console.log(err)
      return response
        .status(400)
        .send({ error: { message: err } })
    }
  }

  async destroy({ params, request, response }) {
    try {
      const Empresa = await Person.findBy('id', params.id)
      if (!Empresa) {
        return response
          .status(400)
          .send({ error: { message: 'Não existe esse Empresa' } })
      }

      const troca = await Empresa.users().update({
        typeEmpresa: false,
        typeRevendedor: false

      })

      /* return response
         .status(200)
         .send({ message: 'Empresa Excluído com sucesso' }) */
      return troca
    } catch (err) {
      console.log(err)
      return response
        .status(400)
        .send({ error: { message: err } })
    }
  }
}

module.exports = EmpresaController
