'use strict'
const User = use('App/Models/User')
const Acesso = use('App/Models/Acesso')
const Person = use('App/Models/Person')
const TypeUser = use('App/Models/TypeUser')
const Event = use('Event')

class CadastroController {
   async store ({ request, response }) {
      try {
         let newUser
         let newPerson

      const {username, password, nome, email } = request.only(['username', 'password', 'nome', 'email']);

      const user = await User.findBy('username', username)

      const person = await Person.findBy('doc', username)

      if(!person){
         newPerson = await Person.create({
            nome,
            doc: username,
            email
         })
      }else {
         return response
         .status(400)
         .send({error: 'Paciente já Cadastrado'})
      }

      if(!user){
            newUser = await User.create({
               username,
               password,
               person_id: newPerson.id
            })

            await Acesso.create({
               userId: newUser.id,
               firstAccess: true
            })

      }else {
         return response
         .status(400)
         .send({error: 'Usuario já Cadastrado'})
      }

      const typeUser = await TypeUser.create({
         userId: newUser.id
      })

      Event.fire('new::person', newPerson.id)

      return response
         .status(200)
         .send({ msg: 'Usuario criado com sucesso'})

      } catch (err) {
         return response
         .status(400)
         .send({ error: { message: 'Erro ao criar novo usuario' } })
      }

   }
}

module.exports = CadastroController
