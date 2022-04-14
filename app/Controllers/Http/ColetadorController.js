'use strict'
const Person = use('App/Models/Person')
const Database = use('Database')
const User = use('App/Models/User')

const Constants = use('App/Constants/Constants')

class ColetadorController {
  async show ({ params }) {
    const Coletador = await Person.findByOrFail('id', params.id)

    return Coletador
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
          users."typeColetador" = ${Constants.typeColetador}
          order by people.nome;`
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

      const Coletador = await Person.create({
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

      await Coletador.users().create({
        username: data.doc, password: data.password, typeColetador: Constants.typeColetador, person_id: Coletador.id
      })

      return response
        .status(200)
        .send({ message: 'Coletador Incluido com sucesso' })
    } catch (error) {
      console.log(error)
      return response
        .status(400)
        .send({ error: { message: error } })
    }
  }

  async update ({ request, response, auth, params }) {
    try {
      const Coletador = await Person.findByOrFail('id', params.id)

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


      Coletador.merge({
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

      await Coletador.save()

      const user = await User.findBy('person_id', params.id)

      if (user) {
        await Coletador.users().update({
          username: data.doc, typeColetador: Constants.typeColetador, person_id: Coletador.id
        })
        
      }else{
        await Coletador.users().create({
          username: data.doc, password: data.password, typeColetador: Constants.typeColetador, person_id: Coletador.id
        })
       
      }

      return response
        .status(200)
        .send({ message: 'Coletador Atualizado com sucesso' })
    } catch (err) {
      console.log(err)
      return response
        .status(400)
        .send({ error: { message: err } })
    }
  }

  async destroy ({ params, request, response }) {
    try {
      const Coletador = await Person.findBy('id', params.id)
      if (!Coletador) {
        return response
          .status(400)
          .send({ error: { message: 'Não existe esse Coletador' } })
      }

      const troca = await Coletador.users().update({
        typeColetador: false
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

module.exports = ColetadorController
