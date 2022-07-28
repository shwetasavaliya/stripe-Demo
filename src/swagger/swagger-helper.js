const info = {
  version: '1.0.0',
  title: 'AMS - Api Documentation',
  description: 'Detailed Api documentaion for the `AMS App`',
  license: {
    name: 'MIT',
    url: 'https://opensource.org/licenses/MIT'
  },
  contact: {
    email: 'kishan.realloc@gmail.com'
  }
};

const tags = [
  { name: 'Users', description: 'API for user' },
  { name: 'Parties', description: 'API for party' }
];

/**
 * 1xx: Informational (request has been received and the process is continuing).
 * 2xx: Success (action was successfully received, understood, and accepted).
 * 3xx: Redirection (further action must be taken in order to complete the request).
 * 4xx: Client Error (request contains incorrect syntax or cannot be fulfilled).
 * 5xx: Server Error (server failed to fulfill an apparently valid request).
 */
const responseObject = {
  200: { description: 'Success response with data' },
  400: { description: 'Bad Request with error data' },
  401: { description: 'Unauthorized' },
  404: { description: 'Not found with error data' },
  500: { description: 'Server is down' },
  290: { description: 'Success response without pagination' }
};

module.exports = { info, tags, responseObject };
