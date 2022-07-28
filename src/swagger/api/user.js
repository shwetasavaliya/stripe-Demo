const securityObject = [{ authenticate: [] }];
const swaggerHelpers = require('../swagger-helper');

module.exports = {
    '/user/register': {
        post: {
            tags: ['Users'],
            description: 'user register endpoint',
            consumes: ['application/json'],
            produces: ['application/json'],
            parameters: [
                {
                    in: 'body',
                    name: 'Data',
                    required: true,
                    schema: {
                        type: 'object',
                        properties: {
                            "email": {
                                "type": "string",
                                "example": "kaushikgangani94@gmail.com"
                            },
                            "password": {
                                "type": "string",
                                "example": "kaushik1234"
                            },
                            "firstName": {
                                "type": "string",
                                "example": "kaushik"
                            },
                            "middleName": {
                                "type": "string",
                                "example": "S"
                            },
                            "lastName": {
                                "type": "string",
                                "example": "Gangani"
                            },
                            "userName": {
                                "type": "string",
                                "example": "123"
                            },
                            "phone": {
                                "type": "string",
                                "example": "32666299232"
                            },
                            "city": {
                                "type": "string",
                                "example": "surat"
                            },
                            "state": {
                                "type": "string",
                                "example": "Gujrat"
                            },
                            "country": {
                                "type": "string",
                                "example": "India"
                            },
                        }
                    }
                }
            ],
            responses: {
                '200': swaggerHelpers.responseObject['200']
            }
        }
    },
}
