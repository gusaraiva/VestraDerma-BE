'use strict'
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

class UserControl {
  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Function} next
   */
  async handle ({ request, auth, response }, next) {
    
    const user = await auth.getUser()

     if(!user) {
       return response.status(401)
        .send({ error: { message: '' } })
     }
    
    // call next to advance the request
    await next()
  }
}

module.exports = UserControl
