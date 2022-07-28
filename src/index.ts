import { PORT } from './config';
import server from './server';

server.listen(PORT, () => {
  console.log('Express server listening on port ' + PORT);
});

