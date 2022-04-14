'use strict'

/**
*  @swagger
*  definitions:
*    User:
*      type: object
*      properties:
*        id:
*          type: uint
*        username:
*          type: string
*        email:
*          type: string
*        password:
*          type: string
*      required:
*        - username - doc(cpf/cnpj)
*        - email
*        - password
*/

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

/** @type {import('@adonisjs/framework/src/Hash')} */
const Hash = use('Hash')

class User extends Model {
  static boot () {
    super.boot()
    this.addHook('beforeSave', async (userInstance) => {
      if (userInstance.dirty.password) {
        userInstance.password = await Hash.make(userInstance.password)
      }
    })
  }

  tokens () {
    return this.hasMany('App/Models/Token')
  }

  teams () {
    return this.belongsToMany('App/Models/Team')
      .pivotModel('App/Models/UserTeam')
  }

  persons () {
    return this.belongsToMany('App/Models/Person')
  }

  acessos () {
    return this.hasMany('App/Models/Acesso')
  }
}

module.exports = User
