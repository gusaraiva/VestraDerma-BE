'use strict'
const User = use('App/Models/User')
const { encrypt } = require('../../utils/encrypt')

class UserController {
  async store ({ request, response, auth }) {
    try {
      const { username, email, password } = request.all()

      if (password === '') {
        return password = '123456'
      }

      const encryptUser = encrypt(username)

      const user = await User.create({
        username: encryptUser,
        email,
        password
      })

      return user
    } catch (err) {
      return response.status(err.status)
        .send({ error: { message: 'Erro ao criar Usuario' } })
    }
  }

  /* async update ({ request, response, auth }) {
    try {
      const data = request.all()
      const user = await User.findBy('id', auth.user.id)
      if (!user) {
        return response
          .status(400)
          .send({ message: 'Não existe esse usuário no banco' })
      }

      user.merge(data)

      await user.save()

      return response.status(200)
        .send({ OK: { message: 'Sucesso ao atualizar sua Senha' } })
    } catch (err) {
      return response.status(err.status)
        .send({ error: { message: 'Erro ao Atualizar sua Senha !' } })
    }
  } */

  async update ({ request, response, auth }) {
    try {
      const data = request.only([
        'person_id',
        'password'
      ])
      let user
      if (data.person_id == -1 && auth.user.username == 'root') { user = await User.findBy('username', 'root') } else { user = await User.findBy('person_id', data.person_id) }
      user.merge({ password: data.password })
      await user.save()
    } catch (err) {
      console.log(err)
      return response.status(err.status)
        .send({ error: { message: 'Erro ao Atualizar Senha !' } })
    }
  }
}

module.exports = UserController
