'use strict'

class TeamController {
  async index ({ auth }) {
    const teams = await auth.user.teams().fetch()

    return teams
  }

  async store ({ request, response, auth }) {
    try {
      const data = request.only(['name'])

      const team = await auth.user.teams().create({
        ...data,
        user_id: auth.user.id
      })

      return team
    } catch (err) {
      return response.status(err.status)
        .send({ error: { message: 'Erro ao criar o time' } })
    }
  }

  async show ({ params, auth }) {
    const team = await auth.user
      .teams().where('teams.id', params.id)
      .first()

    return team
  }

  async update ({ params, request, response, auth }) {
    try {
      const data = request.only(['name'])
      const team = await auth.user
        .teams().where('teams.id', params.id)
        .first()

      team.merge(data)

      await team.save()

      return team
    } catch (err) {
      return response.status(err.status)
        .send({ error: { message: 'Erro ao atualizar o time' } })
    }
  }

  async destroy ({ params, response, auth }) {
    try {
      const team = await auth.user
        .teams().where('teams.id', params.id)
        .first()

      await team.delete()
    } catch (err) {
      return response.status(err.status)
        .send({ error: { message: 'Erro ao Deletar o time' } })
    }
  }
}

module.exports = TeamController
