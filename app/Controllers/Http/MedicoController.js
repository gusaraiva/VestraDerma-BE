'use strict'
const Person = use('App/Models/Person')
const User = use('App/Models/User')
const Database = use('Database')

const Constants = use('App/Constants/Constants')

class MedicoController {
  async show ({ params }) {
    const medico = await Person.findByOrFail('id', params.id)

    return medico
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
          users."typeMedico" = ${Constants.typeMedico};`
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

      const medico = await Person.create({
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

      await medico.users().create({
        username: data.doc, password: data.password, typeMedico: Constants.typeMedico, person_id: medico.id
      })

      return response
        .status(200)
        .send({ message: 'Medico Incluido com sucesso' })
    } catch (error) {
      console.log(error)
      return response
        .status(400)
        .send({ error: { message: error } })
    }
  }

  async update ({ request, response, auth, params }) {
    try {
      const medico = await Person.findByOrFail('id', params.id)

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

      medico.merge({
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

      await medico.users().update({
        username: data.doc, password: data.password, typeMedico: Constants.typeMedico, person_id: medico.id
      })

      await medico.save()

      return response
        .status(200)
        .send({ message: 'Medico Atualizado com sucesso' })
    } catch (err) {
      console.log(err)
      return response
        .status(400)
        .send({ error: { message: err } })
    }
  }

  async destroy ({ params, request, response }) {
    try {
      const medico = await Person.findBy('id', params.id)
      if (!medico) {
        return response
          .status(400)
          .send({ error: { message: 'Não existe esse Medico' } })
      }

      const troca = await medico.users().update({
        typeMedico: false
      })

      /* return response
         .status(200)
         .send({ message: 'Medico Excluído com sucesso' }) */
      return troca
    } catch (err) {
      console.log(err)
      return response
        .status(400)
        .send({ error: { message: err } })
    }
  }
}

module.exports = MedicoController
