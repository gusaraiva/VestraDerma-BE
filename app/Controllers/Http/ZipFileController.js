'use strict'

const Database = use('Database')
const Env = use('Env')
const path = require('path')
const Helpers = use('Helpers')
const Kue = use('Kue')
const Job = use('App/Jobs/Zip')
const fs = require('fs')
const zipFolder = require('zip-a-folder')

class ZipFileController {
  async show({ params, response }) {
    return response.download(Helpers.publicPath(`${params.fileName}`))
  }

  async store({ request, response, params }) {
    console.log('criando arquivo zip')
    const exame = request.input('exames')
    const newFolder = path.join(__dirname, '..', '..', '..', 'public', 'files' + Date.now() + '/')
    const movedFolder = path.join(__dirname, '..', '..', '..', 'public', 'uploads/')
    const arqs = []
    const nomezip = Date.now() + '.zip'

    if (!fs.existsSync(newFolder)) {
      console.log('a pasta não existe')
      fs.mkdirSync(newFolder, {
        recursive: true
      })
    } else {
      console.log('a pasta já existe')
    }

    for (var pos = 0; pos < exame.length; pos++) {
      const nome = await Database.select('name')
        .from('files')
        .innerJoin('exames', 'exames.id', 'files.exameId')
        .andWhere('exameId', exame[pos].id)
      if (nome[0] && nome[0].name) {
        arqs.push(nome[0].name)
        // console.log("nome do arquivo", nome[0].name)
      } else {
        console.log("aquivo não encontrado para o exame ", exame[pos].id)

      }

    }

    arqs.forEach(file => {
      const basename = path.basename(file)
      const oldFile = movedFolder + `${file}`
      // console.log("oldFile: ", oldFile)
      const newFile = newFolder + `${basename}`
      //console.log("newFile ", newFile)

      fs.copyFile(oldFile, newFile, function (err) {
        if (err) return console.error("erro ao copiar arquivo " + oldFile + " para " + newFile, err)
        //console.log('success!')
      })
    })
    // `${Date.now() + '.zip'}`
    await zipFolder.zipFolder(newFolder, path.join(__dirname, '..', '..', '..', 'public', nomezip), function (err) {
      if (err) {
        console.error('Erro ao zipar', err)
      } else {
        console.log('Arquivo zip criado com sucesso ')
        //excluir a pasta criada
        try {
          fs.rmdir(newFolder, { recursive: true }, (err) => {
            if (err) {
              throw err
            } else {

              console.log('Pasta excluída:', newFolder)
            }
          })
        } catch (err) {
          console.error("erro ao excluir pasta ", err)
        }
      }
    })




    Kue.dispatch(Job.key, { nomezip })

    return await response
      .status(200)
      .send({ msg: `${Env.get('APP_URL')}/zip/${nomezip}` })
  }
}

module.exports = ZipFileController
