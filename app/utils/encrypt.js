'use strict'
const Env = use('Env')
const crypto = require('crypto-js')

const secret = Env.get('APP_NAME')

function encrypt(id) {
  const cipher = crypto.AES.encrypt(id, secret).toString()
  console.log(cipher)
  return cipher
}

function decrypt(id) {
  const decrypt = crypto.AES.decrypt(id, secret)
  const dataDecrypt = decrypt.toString(crypto.enc.Utf8)
  console.log(dataDecrypt)
  return dataDecrypt
}

module.exports = { encrypt, decrypt }