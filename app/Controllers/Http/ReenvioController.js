'use strict'
const Exame = use('App/Models/Exame')
const Person = use('App/Models/Person')
const File = use('App/Models/File')
const Venda = use('App/Models/Venda')
const Revenda = use('App/Models/Revenda')
const fs = require('fs')
const Kue = use('Kue')
const Job = use('App/Jobs/EnviaEmailLaudo')
const dayjs = require('dayjs')
const Helpers = use('Helpers')
const path = require('path')

const priority = 'high'
const attempts = 5
const remove = false

class ReenvioController {
  async store ({ request, response }) {    
    try {
      const ids = request.input('ids')
      for (var pos = 0; pos < ids.length; pos++) {

        const exame = await Exame.findByOrFail('id', ids[pos].id)
        //const { paciente_id }  = await Exame.findByOrFail('paciente_id', exame.paciente_id)
        const { nome, email } = await Person.findByOrFail('id', exame.paciente_id) 
        
	let regEx =/\w+$/g
	const fileId =regEx.exec(exame.fileLaudo)
	
	console.log(fileId[0])

	const file = await File.findByOrFail('id',fileId[0])
	
	console.log(file)
        
	let nomepdf = ''  
        
	let revenda, email_revenda, venda, email_comprador, envio = ''      
       
        if (!fs.existsSync(Helpers.publicPath('uploads',`${file.name}`))) {
          nomepdf = file.name        
        } else {
          
          const folder = path.join(__dirname, '..', '..', '..', 'public', 'uploads/')
          nomepdf = file.name	
	  console.log('pdf: ', nomepdf)
          console.log('Arquivo não Encontrado')

          /*return response
          .status(400)
          .send({ msg: 'Verificar se todos os Exames estão Laudados' })*/
        } 
        if(exame.revenda_id === null) {
          console.log('Vendedor')
            venda = await Venda.findByOrFail('id', exame.venda_id)           
            const comprador = await Person.findByOrFail('id', venda.comprador_id)            
            const vedendor =  await Person.findByOrFail('id', venda.vendedor_id)          
            email_comprador = comprador.email
            email_revenda = vedendor.email             
        } else {
          console.log('Revendedor')
          revenda = await Revenda.findByOrFail('id', exame.revenda_id)
	  console.log('Revenda: ',revenda)            
          const comprador = await Person.findByOrFail('id', revenda.comprador_id)           
          const revendedor =  await Person.findByOrFail('id', revenda.revendedor_id)            
          // console.log('Revendedor: ', revendedor)
	  email_comprador = comprador.email
          email_revenda = revendedor.email 
        }
          const paciente_nome = nome       
          const laudo_id =  ids[pos].id
          const dataColeta = dayjs(exame.dataColeta).format('DD/MM/YYYY')
          const paciente_email = email   
          
          // console.log(nomepdf)
      
      envio = Kue.dispatch(Job.key,
        { 
          laudo_id, 
          paciente_nome, 
          paciente_email, 
          dataColeta, 
          nomepdf, 
          email_comprador, 
          email_revenda 
        }, 
        { priority, attempts, remove }
        )         
        const log ={}
        log.envio = envio
        console.log('Emails:', JSON.stringify(log.envio))

        return 'ok'
      }  
    } catch (err) {
      console.log(err)
        return response
          .status(400)
          .send({ error: { message: err } })
    }
  }
}

module.exports = ReenvioController
