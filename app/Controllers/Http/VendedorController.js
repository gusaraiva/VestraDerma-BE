'use strict'
const Person = use('App/Models/Person')
const Database = use('Database')

const Constants = use('App/Constants/Constants')

class VendedorController {
  async show ({ params }) {
    const Vendedor = await Person.findByOrFail('id', params.id)

    return Vendedor
  }

  async index ({ request, auth, response }) {
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
          users."typeVendedor" = ${Constants.typeVendedor};`
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

  async store ({ request, response, auth }) {
    try {
      const data = request.only([
        'nome',
        'doc',
        'codProfissao',
        'contato1',
        'contato2',
        'email',
        'status',
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
        return response
          .send({ message: 'Usuario Já Cadastrado' })
      } else {
        const Vendedor = await Person.create({
          nome: data.nome,
          doc: data.doc,
          contato1: data.contato1,
          contato2: data.contato2,
          email: data.email,
          codProfissao: data.codProfissao,
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

        await Vendedor.users().create({
          username: data.doc, password: data.password, typeVendedor: Constants.typeVendedor, person_id: Vendedor.id
        })

        return response
          .status(200)
          .send({ message: 'Vendedor Incluido com sucesso' })
      }
    } catch (error) {
      console.log(error)
      return response
        .status(400)
        .send({ error: { message: error } })
    }
  }

  async update ({ request, response, auth, params }) {
    try {
      const Vendedor = await Person.findByOrFail('id', params.id)

      const data = request.only([
        'nome',
        'doc',
        'codProfissao',
        'contato1',
        'contato2',
        'email',
        'status',
        'password',
        'cep',
        'logradouro',
        'numero',
        'complemento',
        'bairro',
        'cidade',
        'uf'
      ])

      Vendedor.merge({
        nome: data.nome,
        doc: data.doc,
        contato1: data.contato1,
        contato2: data.contato2,
        email: data.email,
        codProfissao: data.codProfissao,
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
      await Vendedor.users().update({
        username: data.doc, password: data.password, typeVendedor: Constants.typeVendedor, person_id: Vendedor.id
      })

      await Vendedor.save()

      return response
        .status(200)
        .send({ message: 'Vendedor Atualizado com sucesso' })
    } catch (err) {
      console.log(err)
      return response
        .status(400)
        .send({ error: { message: err } })
    }
  }

  async destroy ({ params, request, response }) {
    try {
      const Vendedor = await Person.findBy('id', params.id)
      if (!Vendedor) {
        return response
          .status(400)
          .send({ error: { message: 'Não existe esse Vendedor' } })
      }

      const troca = await Vendedor.users().update({
        typeVendedor: false
      })

      /* return response
         .status(200)
         .send({ message: 'Vendedor Excluído com sucesso' }) */
      return troca
    } catch (err) {
      console.log(err)
      return response
        .status(400)
        .send({ error: { message: err } })
    }
  }
}

module.exports = VendedorController
