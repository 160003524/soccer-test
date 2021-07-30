const express = require('express');
const cors = require('cors');

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT;
    this.authPath = '/api/auth';
    this.playerPath = '/api/player';
    this.teamPath = '/api/team';
    this.userPath = '/api/user';

    //Middlewares
    this.middlewares();
    //Rutas de la app
    this.routes();
  }

  middlewares() {
    //CORS
    this.app.use(cors());
    //parseo y lectura del body
    this.app.use(express.json());
    //directorio publico
    this.app.use(express.static('public'));
  }

  routes() {
    this.app.use(this.authPath, require('../routes/auth.routes'));
    this.app.use(this.userPath, require('../routes/user.routes'));
    this.app.use(this.playerPath, require('../routes/player.routes'));
    this.app.use(this.teamPath, require('../routes/team.routes'));
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log(`corriendo en: ${this.port}`);
    });
  }
}

module.exports = Server;
