'use strict'
const User = use('App/Models/User')

class DatabaseSeeder {
  async run () {
    const user = await User.create({
      username: 'root',
      password: 'root',
      typeRoot: true,
      person_id: null
    })

    await user.teams().create({
      name: 'Vestra',
      user_id: user.id

    })
  }
}

module.exports = DatabaseSeeder
