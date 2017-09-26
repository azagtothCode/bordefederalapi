// Exportamos el modulo de express
var express = require('express');

// El objeto app denomina convencionalmente la palicacion de express
var app = express();

var bodyParser = require("body-parser");

//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Requerimos la configuracion de la base datos
require ('./configbd/configdb.js')(app);

//Traemos los identificadores del H. congreso de la union
var import_json_morena = require ('./import_json/import_json_morena.js');
var import_json_mov = require ('./import_json/import_json_mov.js');
var import_json_pan = require ('./import_json/import_json_pan.js');
var import_json_panal = require ('./import_json/import_json_panal.js');
var import_json_prd = require ('./import_json/import_json_prd.js');
var import_json_pri = require ('./import_json/import_json_pri.js');
var import_json_pt = require ('./import_json/import_json_pt.js');
var import_json_pvem = require ('./import_json/import_json_pvem.js');
var import_json_sg = require ('./import_json/import_json_sg.js');
var import_json_social = require ('./import_json/import_json_social.js');

//Mandamos a llamar toda la info. del SIL y asignamos todas las propiedades a dicha variable
var info_basica = require ('./scrappers/sil_info_basica');

//Mandamos a llamar toda la info. del SIL para trabajo legislativo
//y asignamos todas las propiedades a dicha variable
var info_trabajo = require ('./scrappers/sil_trabajo_legislativo');

//Mandamos a llamar toda la info. del SIL para trabajo legislativo
//y asignamos todas las propiedades a dicha variable
var info_trabajo_puntoasacuerdo = require ('./scrappers/sil_puntos_acuerdo.js');

//Mandamos a llamar toda la info. del SIL para trabajo legislativo
//y asignamos todas las propiedades a dicha variable
var info_trabajo_votation = require ('./scrappers/sil_votacion.js');

//Búsqueda de una semana de un nombre en google
var google_news = require ('./scrappers/google_news.js');

//Herramientas generales
var utilities = require ('./scrappers/utilities.js');
var comisiones = require ('./scrappers/comisiones.js');
var senadoinfo =require ('./scrappers/senadoinfo.js');



var legisladores =require ('./methods/legislatorfind.js');

//Funciónes de control Vusal Borde
var control= require ('./control/index.js');

var csvv= require ('./csv/import_csv.js');

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost");
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header("Access-Control-Allow-Headers", "X-Requested-With, Content-Type");
  next();
});

// Index donde se mostrara toda la informacion de los legisladores
// la cual se craga mediante un archivo json
app.get('/', function(req, res) {
  res.end("Borde API v1")
});

app.post('/', function(req, res) {
  var query1=req.body;
  var query2=req.body.miau;
    console.log(".JSON export",query2,query1);
    res.end(query2,query1);
});

app.post('/diputados/get', function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  legisladores.get( req, res, app, next );
});

// SECCIÓN UNICAMENTE PÁRA TRABAJAR MÉTODS DE API

/*
  * Lista de metodos de consulta para FRONT:

  * Info. legisladortes Index get
  * Info. perfiles get/post
  * Info. graficas (Home)
  * Info. graficas (Perfil)
  *
*/

// Info. legisladortes Index get
app.get('/consulta/main', function(req, res) {
  res.send('Funcion get de lsgisladores');
});

// Info. perfiles post
app.post('/consulta/perfil', function(req, res) {
  res.send('Funcion post de perfiles');
  //console.log(req);
});

// Info. graficas (Home)
app.put('/consulta/graficas/main', function(req, res) {
  res.send('Funcion put de graficas');
});

// Info. graficas (Perfil)
app.post('/consulta/graficas/perfil', function(req, res) {
  res.send('Funcion post de perfiles');
});
// TERMINA SECCIÓN PÁRA TRABAJAR MÉTODS DE FRONT
// *******************************************

// *******************************************
// SECCIÓN UNICAMENTE PÁRA TRABAJAR MÉTODS BACK END DE API

// Iniciamos la base de datos, aqui importamos el archivo JSON
// De cada uno de los partidos politicos
// donde agregamos id del SIL y camara a la que pertenece
// enviamos como respuesta el total de registros insertados
app.get('/init/morena', function(req, res) {
    import_json_morena.import_file (app, function (count){
    res.send(JSON.stringify({Total_Registers:count}));
    console.log("The JSON file for party MORENA was successfully imported :)");
    console.log(count+" legislators added");
  });
});

app.get('/init/mov', function(req, res) {
    import_json_mov.import_file (app, function (count){
    res.send(JSON.stringify({Total_Registers:count}));
    console.log("The JSON file for party MOVIMIENTO CIUDADANO was successfully imported :)");
    console.log(count+" legislators added");
  });
});

app.get('/init/pan', function(req, res) {
    import_json_pan.import_file (app, function (count){
    res.send(JSON.stringify({Total_Registers:count}));
    console.log("The JSON file for party PAN was successfully imported :)");
    console.log(count+" legislators added");
  });
});

app.get('/init/panal', function(req, res) {
    import_json_panal.import_file (app, function (count){
    res.send(JSON.stringify({Total_Registers:count}));
    console.log("The JSON file for party NUEVA ALAIANZA was successfully imported :)");
    console.log(count+" legislators added");
  });
});

app.get('/init/prd', function(req, res) {
    import_json_prd.import_file (app, function (count){
    res.send(JSON.stringify({Total_Registers:count}));
    console.log("The JSON file for party PRD was successfully imported :)");
    console.log(count+" legislators added");
  });
});

app.get('/init/pri', function(req, res) {
    import_json_pri.import_file (app, function (count){
    res.send(JSON.stringify({Total_Registers:count}));
    console.log("The JSON file for party PRI was successfully imported :)");
    console.log(count+" legislators added");
  });
});
app.get('/init/pt', function(req, res) {
    import_json_pt.import_file (app, function (count){
    res.send(JSON.stringify({Total_Registers:count}));
    console.log("The JSON file for party PARTIDO DEL TRABAJO was successfully imported :)");
    console.log(count+" legislators added");
  });
});

app.get('/init/pvem', function(req, res) {
    import_json_pvem.import_file (app, function (count){
    res.send(JSON.stringify({Total_Registers:count}));
    console.log("The JSON file for party VERDE ECOLOGISTA was successfully imported :)");
    console.log(count+" legislators added");
  });
});

app.get('/init/sg', function(req, res) {
    import_json_sg.import_file (app, function (count){
    res.send(JSON.stringify({Total_Registers:count}));
    console.log("The JSON file for party INDEPENDIENTE / SIN GRUPO was successfully imported :)");
    console.log(count+" legislators added");
  });
});

app.get('/init/social', function(req, res) {
    import_json_social.import_file (app, function (count){
    res.send(JSON.stringify({Total_Registers:count}));
    console.log("The JSON file for party ENCUENTRO SOCIAL was successfully imported :)");
    console.log(count+" legislators added");
  });
});

// EndPoint para recoger los datos basicos de la pagina del SIL/
app.get('/crawler/sil/basico', function(req, res) {
    info_basica.info_basic_get_sil(req, res, app, function(resultado){
    res.send(JSON.stringify(resultado));
    console.log(resultado);
  });
});

// EndPoint para recoger los datos basicos de la pagina del SIL
app.get('/crawler/3d3fix/sen',function(req, res) { //Crawl 3 de 3, twitter y fix nombres
  utilities.tresdetresFix("senador", req, res, app, function(data){
    res.send(JSON.stringify(data));
  });
});

// EndPoint para recoger los datos basicos de la pagina del SIL
app.get('/crawler/3d3fix/dip',function(req, res) { //Crawl 3 de 3, twitter y fix nombres
  utilities.tresdetresFix("diputado", req, res, app, function(data){
    res.send(JSON.stringify(data));
  });
});

app.get('/crawler/id_senado',function(req, res) { //Obtener klout diputados
  utilities.id_senado(req, res, app, function(data){
    res.send(JSON.stringify(data));

  });
});

// EndPoint para recoger los datos basicos de la pagina del SIL
// app.get('/crawler/sil/trabajo', function(req, res) {
//   info_trabajo.legislativo_info(req, res, app, function(){
//     res.send('Lista de legisladores');
//   });
// });

// EndPoint para recoger los datos basicos de la pagina del SIL
app.post('/crawler/sil/trabajo', function(req, res) {
  info_trabajo.legislativo_info(req, res, app, function(){
    res.send('Lista de iniciativas post');
  });
});

// EndPoint para recoger los datos basicos de la pagina del SIL
app.post('/crawler/sil/acuerdo', function(req, res) {
  info_trabajo_puntoasacuerdo.legislativo_acuerdo(req, res, app, function(){
    res.send('Lista de puntls de acuerdo post');
  });
});

// EndPoint para recoger los datos basicos de la pagina del SIL
app.post('/crawler/sil/votation', function(req, res) {
  info_trabajo_votation.legislativo_votation(req, res, app, function(){
    res.send('Lista de puntls de acuerdo post');
  });
});

app.get('/crawler/comisiones/sen',function(req, res) { //Obtener klout diputados
  comisiones.senado(req, res, app, function(data){
    res.send(JSON.stringify(data));
  });
})

app.get('/crawler/comisiones/dip',function(req, res) { //Obtener klout diputados
  comisiones.diputados(req, res, app, function(data){
    res.send(JSON.stringify(data));
  });
})


app.get('/crawler/comisiones/join',function(req, res) { //Obtener klout diputados
  comisiones.join_commisions(req, res, app, function(data){
    res.send(JSON.stringify(data));
  });
})

//<------------>


app.get('/crawler/news/google', function(req, res) {
  google_news.google(req, res, app, function (control){
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(control));
  });
});

//<------------>


//<------------>

app.get('/crawler/klout/sen',function(req, res) { //Obtener klout senado
  utilities.klout("senador", req, res, app, function(data){
    res.send(JSON.stringify(data));
  });
})

app.get('/crawler/klout/dip',function(req, res) { //Obtener klout diputados
  utilities.klout("diputado", req, res, app, function(data){
     res.send(JSON.stringify(data));
  });
})

app.get('/crawler/asistencia/sen',function(req, res) { //Obtener klout diputados
  senadoinfo.asistencia(req, res, app, function(data){
    res.send(JSON.stringify(data));
  });
})
// CONTROL

app.get('/control/trabajo_fechas',function(req, res) { //Obtener klout diputados
  control.trabajo_fechas([],app, function(response){
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(response));
  });
})
app.get('/control/exportranking',function(req, res) { //Obtener klout diputados
  control.exportRanking(req,res,app, function(response){
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(response) );
  });
})

app.get('/csv/import_csv',function(req, res) { //Obtener klout diputados
  csvv.import_csv(req, res, app, function(data){
    res.send(JSON.stringify(data));
  });
})
// TERMINA SECCIÓN PÁRA TRABAJAR MÉTODS DE API
// *******************************************

app.listen('8000');
// console.log("******************************************************************");
// console.log("******************************************************************");
// console.log("***** WELCOME API Borde Federal has started in the port 8000 *****");
// console.log("*****                                                        *****");
// console.log("***** BORDE POLITICO S.A. DE C.V. || API BORDE FEDERAL 2017  *****");
// console.log("*****                                                        *****");
// console.log("***** @DEVELOP MICHELLE GARDUÑO (AZAGTOTH)                   *****");
// console.log("***** @ORIGINAL IDEA BORDE POLITICO   S.A. DE C.V.           *****");
// console.log("***** @ROUTE http://localhost:8000/METHOD                    *****");
// console.log("***** @VERSION 1.0                                           *****");
// console.log("******************************************************************");
// console.log("******************************************************************");
// console.log("***** METHODS-GET API BACK-END                               *****");
// console.log("***** /init                     || IMPORT JSON LEGISLATORS   *****");
// console.log("***** /crawler/sil/basico       || BASIC INFO LEGISLATORS    *****");
// console.log("***** /crawler/3d3fix/sen       || BASIC 3de3 SENATORS       *****");
// console.log("***** /crawler/3d3fix/dip       || BASIC 3de3 DEPUTYS        *****");
// console.log("***** /crawler/id_senado        || ID PAGE SIL LEGISLATORS   *****");
// console.log("***** /crawler/comisiones/sen   || COMMISIONS SENATORS       *****");
// console.log("***** /crawler/comisiones/dip   || COMMISIONS DEPUTY         *****");
// console.log("******************************************************************");
// console.log("******************************************************************");
// console.log("***** METHODS-POST API BACK-END                              *****");
// console.log("***** /crawler/sil/trabajo      || INFO LEGISLATIVE WORK     *****");
// console.log("******************************************************************");
// console.log("*****            *   THE SOUND OF PERSEVERANCE   *           *****");
// console.log("******************************************************************");
// console.log("******************************************************************");
console.log(":D");
