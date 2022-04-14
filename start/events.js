'use strict'
const Event = use('Event')
const Laudar = use('App/Listeners/Laudar')
const Cadastro = use('App/Listeners/Cadastro')

Event.on('new::laudo', async (id) => {
  console.log('Event', id)
})

Event.on('new::laudo', 'Laudar.create')

Event.on('new::person', 'Cadastro.create')