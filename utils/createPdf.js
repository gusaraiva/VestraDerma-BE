'use strict'

const File = use('App/Models/File')
const Helpers = use('Helpers')

const pdf = require('html-pdf')

async function pdfCreate(id, html) {
  const options = {
    format: 'A4',
    type: 'pdf',
    timeout: 300,
    orientation: 'portrait',
    border: 5,
    renderDelay: 100,
    phantomPath: '../../../node_modules/phantomjs-prebuilt/lib/phantom/bin/phantomjs',
    childProcessOptions: { detached: true }
  }
  const nomepdf = id + '-' + Date.now() + '.pdf'
  const nameFile = Helpers.publicPath(`uploads/${nomepdf}`)

  const file = await File.create({
    file: nomepdf,
    name: nomepdf,
    exameId: id,
    type: 'pdf',
    subtype: 'pdf'
  })
  let resp = {}

  await pdf.create(html, { options })
    .toFile(nameFile, async (erro, res) => {
      if (erro) {
       console.log('Um Erro aconteceu ao criar o PDF', erro)
      }
      else {         
        resp.ok = true
        resp.res = res

        console.log(resp)
         
      }
    })



    return file.id

}

module.exports = {pdfCreate}