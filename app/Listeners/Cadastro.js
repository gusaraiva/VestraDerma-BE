'use strict'
const Person = use('App/Models/Person')
const SendEmail = use('App/Models/SendEmail')
const Mail = use('Mail')
const dayjs = require('dayjs')


const Cadastro = exports = module.exports = {}

Cadastro.create = async (id) => {
  let email
  let nome
  let msgErro
  const hoje = Date.now()
  const dataEnvio = dayjs(hoje).format('DD/MM/YYYY HH:mm')
  const person = await Person.findBy('id', id)

  try {
    email = person.email
    nome = person.nome

    if(person) {
    let enviaEmail = await Mail.send(
          'emails.welcome',
          { email, nome },
          message => {
            message
              .to(email, nome)
              .from('vestra@vestra.global', 'Vestra')
              .subject(`Bem Vindo ${nome} `)
          })

      if(enviaEmail){
        const saveEmail = await SendEmail.create({
          data_envio: dataEnvio,
          email_paciente: email,
          welcome: true,
          status: true,
          personId: person.id,
        })
      }
    }

  } catch (err) {
    msgErro = err.message
    console.log('Error:', msgErro)
    return msgErro
  }


}


