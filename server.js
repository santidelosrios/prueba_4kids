'use strict';

//Load settings module
const config = require('./settings/settings.js');
//Load Express module for API functions
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const router = express.Router();
//Load mysql module and set up connection
const mysql = require('mysql');

let connection = mysql.createConnection({
  host: config.db.host,
  user: config.db.user,
  password: config.db.password,
  database: config.db.database
});

connection.connect()

//Load controllers
let consultasController = require('./controllers/consultas.js');


//Load middlewares

//Port for express web server
const port =  config.server.port;

//Configure Express web server to handle POST requests, encoding and cross site requests
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.all("/api/*", function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Cache-Control, Pragma, Origin, Authorization, Content-Type, X-Requested-With");
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
    return next();
});

//Set the app to listen in the specific port
app.listen(port, function(){});


//Routes
router.get('/observaciones',function (req,res){
  consultasController.observacionesByDate(req,res,connection);
});

router.get('/ninos_por_maestra',function (req,res){
  consultasController.kidsByTeacher(req,res,connection);
});

router.get('/observaciones_por_nino',function (req,res){
  consultasController.observacionesByKid(req,res,connection);
});


router.get('/ninos_observaciones',function(req,res){
  consultasController.kidsWithObservaciones(req,res,connection);
});

router.post('/actualizar_observacion',function (req,res){
  consultasController.updateObservacion(req,res,connection);
});
router.post('/users/change_password',function (req,res){
  usersController.change_pasword(req,res,initDB.clusterConnection);
});
