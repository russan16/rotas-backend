// app/controllers/auth_controller.ts
import User from '#models/user'
import { HttpContext } from '@adonisjs/core/http'
import hash from '@adonisjs/core/services/hash'
import { registerValidator, loginValidator } from '#validators/auth'

export default class AuthController {
  /**
   * Registra um novo usuário
   */
  async register({ request, response }: HttpContext) {
    const payload = await request.validateUsing(registerValidator)
    const user = await User.create(payload)

    return response.created(user)
  }

  /**
   * Realiza o login do usuário e retorna um token
   */
  async login({ request, response }: HttpContext) {
    const { email, password } = await request.validateUsing(loginValidator)

    // 1. Achar o usuário pelo email
    const user = await User.findBy('email', email)
    if (!user) {
      return response.unauthorized({ error: 'Invalid credentials' })
    }

    // 2. Verificar se a senha está correta
    const isPasswordValid = await hash.verify(user.password, password)
    if (!isPasswordValid) {
      return response.unauthorized({ error: 'Invalid credentials' })
    }

    // 3. Gerar um token de acesso
    const token = await User.accessTokens.create(user)

    return response.ok({
      token: token,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
      },
    })
  }

  /**
   * Retorna os dados do usuário autenticado
   */
  async me({ auth, response }: HttpContext) {
    // O middleware de autenticação já carregou o usuário
    // e o deixou disponível em `auth.user`
    const user = auth.getUserOrFail()

    return response.ok(user)
  }
}
