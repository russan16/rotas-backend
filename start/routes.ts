/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'
const AuthController = () => import('#controllers/auth_controller')

router.post('/register', [AuthController, 'register'])
router.post('/login', [AuthController, 'login'])

// Rota de exemplo que precisa de login
router.get('/me', [AuthController, 'me']).use(middleware.auth())
