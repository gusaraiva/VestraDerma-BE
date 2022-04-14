'use strict'
const User = use('App/Models/User')
const Person = use('App/Models/Person')
const Acesso = use('App/Models/Acesso')
const dayjs = require('dayjs')
const Database = use('Database')
const { encrypt, decrypt } = require('../../utils/encrypt.js')

class SessionController {
  constructor() {
    try {
      const types = {
        typeRoot: false,
        typeAdministrativo: false,
        typeVendedor: false,
        typeEmpresa: false,
        typeMedico: false,
        typeColetador: false,
        typePaciente: false,
        typeLaboratorio: false,
        typeRespLab: false,
      }
    } catch (err) {
      console.log('erro em SessionControler.js - Store', new Date().toISOString, err)
    }
  }

  async store({ request, response, auth }) {
    try {
      const { username, password } = request.all()	

      const userDecrypt = decrypt(username)

      if (userDecrypt == null || userDecrypt == '' || password == null || password == '') {
        return response.status(401)
          .send({ error: { message: 'Username ou Password não podem ser vazios' } })
      }

      const user = await User.findBy('username', userDecrypt)

      this.types = {
        typeRoot: user.typeRoot,
        typeAdministrativo: user.typeAdministrativo,
        typeVendedor: user.typeVendedor,
        typeEmpresa: user.typeEmpresa,
        typeMedico: user.typeMedico,
        typeColetador: user.typeColetador,
        typePaciente: user.typePaciente,
        typeLaboratorio: user.typeLaboratorio,
        typeRespLab: user.typeRespLab,
        typeRevendedor: user.typeRevendedor
      }


      const token = await auth.attempt(userDecrypt, password)

      const personRet = {
        nome: '',
        id: 0,
        idLab: 0,
        nameLab: ''
      }
      if (userDecrypt === 'root') {
        personRet.nome = 'root'
      } else {
        const person = await Person.findBy('id', user.person_id)        

        if (!person) {
          return response.status(400)
            .send({ error: { message: 'Erro no Login, Verificar Usuario ou Senha' } })
        }
        personRet.id = person.id
        personRet.nome = person.nome
        if (person.lab_id != null && person.lab_id > 0) {
          const personLab = await Person.findBy('id', person.lab_id)
          if (!personLab) {
            return response.status(400)
              .send({ error: { message: 'Erro no Login, Este Laboratório Não Existe' } })
          }
          personRet.idLab = personLab.id
          personRet.nameLab = personLab.nome
        }
      }

      let strgSQL = `select
          count(id),
          max("dataAcesso")
          from acessos
          where "userId" = ${user.id}`

          let strgSQL2 = `select "firstAccess"
          from acessos
          where "userId" = ${user.id}`

      const lastAccess = await Database.raw(strgSQL)

      const first = await await Database.raw(strgSQL2)
	
      const access = await Acesso.create({
        userId: user.id,
        dataAcesso : dayjs(Date.now() ).format('DD/MM/YYYY HH:mm')
      })


      const login = {}
      login.token = token
      login.user = { id: user.id, username: user.username }
      login.types = this.types
      login.person = personRet
      login.acesso = lastAccess.rows
      login.first = first.rows

      return login

    } catch (error) {
      console.log('erro em SessionControler.js - Store', new Date().toISOString(), error)
      return response.status(401)
        .send({ error: { message: 'Erro na API de Login' + error } })
    }
  }
}

module.exports = SessionController
