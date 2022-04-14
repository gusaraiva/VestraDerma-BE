'use strict'
const Person = use('App/Models/Person')
const Database = use('Database')

const Constants = use('App/Constants/Constants')

class AdministrativoController {
  async show ({ params }) {
    const Administrativo = await Person.findByOrFail('id', params.id)

    return Administrativo
  }

  async index ({ request, auth, response }) {
    try {
      /* const list = await Database.raw(`SELECT
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
          users."typeAdministrativo" = ${Constants.typeAdministrativo};`
      ) */

      const list = await Database
        .select('people.id','nome', 'doc', 'contato1', 'contato2', 'codProfissao')
        .from('people')
        .innerJoin('users', 'person_id', 'people.id')
        .andWhere('users.typeAdministrativo', Constants.typeAdministrativo)

      console.log('list', list)

      const obj = {}
      obj.list = list
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

      const Administrativo = await Person.create({
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

      await Administrativo.users().create({
        username: data.doc, password: data.password, typeAdministrativo: Constants.typeAdministrativo, person_id: Administrativo.id
      })

      return response
        .status(200)
        .send({ message: 'Administrativo Incluido com sucesso' })
    } catch (error) {
      console.log(error)
      return response
        .status(400)
        .send({ error: { message: error } })
    }
  }

  async update ({ request, response, auth, params }) {
    try {
      const Administrativo = await Person.findByOrFail('id', params.id)

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

      Administrativo.merge({
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

      await Administrativo.users().update({
        username: data.doc, password: data.password, typeAdministrativo: Constants.typeAdministrativo, person_id: Administrativo.id
      })
      await Administrativo.save()

      return response
        .status(200)
        .send({ message: 'Administrativo Atualizado com sucesso' })
    } catch (err) {
      console.log(err)
      return response
        .status(400)
        .send({ error: { message: err } })
    }
  }

  async destroy ({ params, request, response }) {
    try {
      const Administrativo = await Person.findBy('id', params.id)
      if (!Administrativo) {
        return response
          .status(400)
          .send({ error: { message: 'Não existe esse Administrativo' } })
      }

      const troca = await Administrativo.users().update({
        typeAdministrativo: false
      })

      /* return response
         .status(200)
         .send({ message: 'Administrativo Excluído com sucesso' }) */
      return troca
    } catch (err) {
      console.log(err)
      return response
        .status(400)
        .send({ error: { message: err } })
    }
  }
}

module.exports = AdministrativoController
