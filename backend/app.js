const express = require('express')
const http = require('http')
const debug = require('debug')
const expressValidator = require('express-validator')
const cors = require('cors')
const createError = require('http-errors');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const methodOverride = require('method-override')
const bodyParser = require('body-parser')
const sql = require('./conection')
require('dotenv').config()


const app = express()


//Configuracion render
app.set('view engine', 'ejs');

//Importar rutas
const recetaRouter = require('./routes/receta')
const usuarioRouter = require('./routes/usuario')
const loginRouter = require('./routes/login')
const registroRouter = require('./routes/registro')
const panelRouter = require('./routes/panel');
const adminRouter = require('./routes/admin');
const testRouter = require('./routes/test');

//conexión db
const conexionDB = async () => {
    try {
        await sql.connect();
        console.log(`Conectado exitosamente a la base de datos`);
    } catch (err) {
        console.log(err);
    }
};

conexionDB();

//Puerto
const port = process.env.PORT || '3008';
app.set('port', port);

const server = http.createServer(app);

function onListening() {
    const addr = server.address();
    const bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;
    debug('Conectado en puerto  ' + bind);
    console.log('Conectado en puerto ' + bind);
}

function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    const bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;

    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

//Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json({ limit: '100mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '100mb', parameterLimit: 100000000 }));
app.use(logger('dev'));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '/public')));
app.use(methodOverride('_method'));
app.use(cors());

//Rutas 
app.use('/receta', recetaRouter)
app.use('/usuario', usuarioRouter)
app.use('/login', loginRouter)
app.use('/registro', registroRouter)
app.use('/panel', panelRouter);
app.use('/admin', adminRouter);
app.use('/test', testRouter);



//Error
app.use(function(req, res, next) {
  next(createError(404));
});

app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    res.status(400).json({ error: 'El cuerpo de la solicitud es demasiado grande' });
  } else {
    next();
  }
});

app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  if(typeof err.message !== 'undefined'){
    console.log(err.message)
  }
  next()
});

module.exports = app