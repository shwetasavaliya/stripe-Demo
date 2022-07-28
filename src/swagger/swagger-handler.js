import swaggerUi from "swagger-ui-express"
import { Router } from "express"
import basicAuth from "express-basic-auth"
const swaggerHelpers = require('./swagger-helper')
const swaggerPaths = require('./swagger-paths')

const router = Router()

router.use(
    '/',
    basicAuth({
        challenge: true,
        users:{
            ['test']:'test'
        }
    }),
    swaggerUi.serve,
    swaggerUi.setup({
        swagger: '2.0',
        info: swaggerHelpers.info,
        basePath: `/api/v1`,
        tags: swaggerHelpers.tags,
        consumes: ['application/json'],
        produces: ['application/json'],
        paths: swaggerPaths,
        definitions: swaggerHelpers.definitions,
        securityDefinitions: {
          authenticate: {
            type: 'apiKey',
            in: 'header',
            name: 'Authorization',
            description:
              'Please provide the valid access token, if you dont have please login and get the token as response!'
          }
        }
      },{
          explorer: true,
          swaggerOptions: {
              displayRequestDuration: true
          }
      })
)

export default router;