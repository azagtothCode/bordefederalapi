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
var import_score = require ('./import_json/import_score.js');
var import_facebook = require ('./import_json/import_facebook.js');

//Traemos los identificadores del H. congreso de la union
var import_json_morena_basic = require ('./import_json_basic/import_json_morena.js');
var import_json_mov_basic = require ('./import_json_basic/import_json_mov.js');
var import_json_pan_basic = require ('./import_json_basic/import_json_pan.js');
var import_json_panal_basic = require ('./import_json_basic/import_json_panal.js');
var import_json_prd_basic = require ('./import_json_basic/import_json_prd.js');
var import_json_pri_basic = require ('./import_json_basic/import_json_pri.js');
var import_json_pt_basic = require ('./import_json_basic/import_json_pt.js');
var import_json_pvem_basic = require ('./import_json_basic/import_json_pvem.js');
var import_json_sg_basic = require ('./import_json_basic/import_json_sg.js');
var import_json_social_basic = require ('./import_json_basic/import_json_social.js');
var import_score_basic = require ('./import_json_basic/import_score.js');
var import_facebook_basic = require ('./import_json_basic/import_facebook.js');

//Traemos los datos para llenar los tabs de rol, extra, y noticias
var import_rol = require ('./import_json/import_rol.js');
var import_extra = require ('./import_json/import_extra.js');
var import_news = require ('./import_json/import_news.js');


//Mandamos a llamar toda la info. del SIL y asignamos todas las propiedades a dicha variable
var info_basica = require ('./scrappers/sil_info_basica');

//Mandamos a llamar toda la info. del SIL y asignamos todas las propiedades a dicha variable
var leg_info_basica = require ('./scrappers/sil_info_basica_legislators');

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
var utilities_basic = require ('./scrappers/utilities.js');

var comisiones = require ('./scrappers/comisiones.js');
var senadoinfo =require ('./scrappers/senadoinfo.js');

//Busqueda de lesgialdores
var legisladores =require ('./methods/legislatorfind.js');
var legisladores_basic =require ('./methods/legislatorfindBasic.js');
var legisladores_profile=require ('./methods/legislatorfindProfile.js');
var legisladores_party=require ('./methods/legislatorfindParty.js');
var legisladores_state=require ('./methods/legislatorfindState.js');
var legisladores_ini=require ('./methods/inifindProfile.js');
var legisladores_pda=require ('./methods/pdafindProfile.js');

//iniciativas
var import_ini_ap = require ('./import_json/import_ini_ap.js');
var import_ini_de = require ('./import_json/import_ini_de.js');
var import_ini_pe = require ('./import_json/import_ini_pe.js');
var import_ini_pr = require ('./import_json/import_ini_pr.js');
var import_ini_re = require ('./import_json/import_ini_re.js');

//iniciativas
var import_pda_ap = require ('./import_json/import_pda_ap.js');
var import_pda_de = require ('./import_json/import_pda_de.js');
var import_pda_pe = require ('./import_json/import_pda_pe.js');
var import_pda_pr = require ('./import_json/import_pda_pr.js');
var import_pda_re = require ('./import_json/import_pda_re.js');
//Funciónes de control Vusal Borde
var control= require ('./control/index.js');

var csvv= require ('./csv/import_csv.js');

app.use(function (req, res, next) {
  // res.header("Access-Control-Allow-Origin", "http://localhost");
  res.header("Access-Control-Allow-Origin", "http://104.239.249.32");
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

// app.post('/diputados/get', function(req, res, next) {
//   res.setHeader('Access-Control-Allow-Origin', '*');
//   legisladores.get( req, res, app, next );
// });

app.post('/diputados/basic/dip/get', function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  legisladores_basic.get( req, res, app, next );
});

app.post('/diputados/basic/sen/get', function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  legisladores_basic.get( req, res, app, next );
});

app.post('/diputados/profile/dip/get', function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  legisladores_profile.get( req, res, app, next );
});

app.post('/diputados/party/get', function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  legisladores_party.get( req, res, app, next );
});

app.post('/diputados/state/get', function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  legisladores_state.get( req, res, app, next );
});

app.post('/diputados/ini/dip/get', function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  legisladores_ini.get( req, res, app, next );
});

app.post('/diputados/pda/dip/get', function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  legisladores_pda.get( req, res, app, next );
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

app.get('/init/rol', function(req, res) {
    import_rol.import_file (app, function (count){
    res.send(JSON.stringify({Total_Registers:count}));
    console.log("The JSON file for Rol Politico was successfully imported :)");
    console.log(count+" legislators Rol Politico added");
  });
});

app.get('/init/extra', function(req, res) {
    import_extra.import_file (app, function (count){
    res.send(JSON.stringify({Total_Registers:count}));
    console.log("The JSON file for Extra Legislativo was successfully imported :)");
    console.log(count+" legislators Extra Legislativo added");
  });
});

app.get('/init/news', function(req, res) {
    import_news.import_file (app, function (count){
    res.send(JSON.stringify({Total_Registers:count}));
    console.log("The JSON file for News was successfully imported :)");
    console.log(count+" legislators News added");
  });
});

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

app.get('/init/score', function(req, res) {
    import_score.import_file (app, function (count){
    res.send(JSON.stringify({Total_Registers:count}));
    console.log("The JSON file for BordeScore was successfully imported :)");
    console.log(count+" legislators update with new Score");
  });
});

app.get('/init/facebook', function(req, res) {
    import_facebook.import_file (app, function (count){
    res.send(JSON.stringify({Total_Registers:count}));
    console.log("The JSON file for BordeScore was successfully imported :)");
    console.log(count+" legislators update with new Facebook");
  });
});

// Iniciamos la base de datos, aqui importamos el archivo JSON
// De cada uno de los partidos politicos
// donde agregamos id del SIL y camara a la que pertenece la cual se guardara en la
//nueva tbla legislators_basic solo para Index
// enviamos como respuesta el total de registros insertados

app.get('/init/basic/morena', function(req, res) {
    import_json_morena_basic.import_file (app, function (count){
    res.send(JSON.stringify({Total_Registers:count}));
    console.log("The JSON file for party MORENA was successfully imported :)");
    console.log(count+" legislators added");
  });
});

app.get('/init/basic/mov', function(req, res) {
    import_json_mov_basic.import_file (app, function (count){
    res.send(JSON.stringify({Total_Registers:count}));
    console.log("The JSON file for party MOVIMIENTO CIUDADANO was successfully imported :)");
    console.log(count+" legislators added");
  });
});

app.get('/init/basic/pan', function(req, res) {
    import_json_pan_basic.import_file (app, function (count){
    res.send(JSON.stringify({Total_Registers:count}));
    console.log("The JSON file for party PAN was successfully imported :)");
    console.log(count+" legislators added");
  });
});

app.get('/init/basic/panal', function(req, res) {
    import_json_panal_basic.import_file (app, function (count){
    res.send(JSON.stringify({Total_Registers:count}));
    console.log("The JSON file for party NUEVA ALAIANZA was successfully imported :)");
    console.log(count+" legislators added");
  });
});

app.get('/init/basic/prd', function(req, res) {
    import_json_prd_basic.import_file (app, function (count){
    res.send(JSON.stringify({Total_Registers:count}));
    console.log("The JSON file for party PRD was successfully imported :)");
    console.log(count+" legislators added");
  });
});

app.get('/init/basic/pri', function(req, res) {
    import_json_pri_basic.import_file (app, function (count){
    res.send(JSON.stringify({Total_Registers:count}));
    console.log("The JSON file for party PRI was successfully imported :)");
    console.log(count+" legislators added");
  });
});
app.get('/init/basic/pt', function(req, res) {
    import_json_pt_basic.import_file (app, function (count){
    res.send(JSON.stringify({Total_Registers:count}));
    console.log("The JSON file for party PARTIDO DEL TRABAJO was successfully imported :)");
    console.log(count+" legislators added");
  });
});

app.get('/init/basic/pvem', function(req, res) {
    import_json_pvem_basic.import_file (app, function (count){
    res.send(JSON.stringify({Total_Registers:count}));
    console.log("The JSON file for party VERDE ECOLOGISTA was successfully imported :)");
    console.log(count+" legislators added");
  });
});

app.get('/init/basic/sg', function(req, res) {
    import_json_sg_basic.import_file (app, function (count){
    res.send(JSON.stringify({Total_Registers:count}));
    console.log("The JSON file for party INDEPENDIENTE / SIN GRUPO was successfully imported :)");
    console.log(count+" legislators added");
  });
});

app.get('/init/basic/social', function(req, res) {
    import_json_social_basic.import_file (app, function (count){
    res.send(JSON.stringify({Total_Registers:count}));
    console.log("The JSON file for party ENCUENTRO SOCIAL was successfully imported :)");
    console.log(count+" legislators added");
  });
});

// EndPoint para recoger los datos basicos de la pagina del SIL/
app.get('/crawler/basic/sil', function(req, res) {
    leg_info_basica.info_basic_get_sil(req, res, app, function(resultado){
    res.send(JSON.stringify(resultado));
    console.log(resultado);
  });
});

app.get('/init/basic/score', function(req, res) {
    import_score_basic.import_file (app, function (count){
    res.send(JSON.stringify({Total_Registers:count}));
    console.log("The JSON file for BordeScore was successfully imported :)");
    console.log(count+" legislators update with new Score");
  });
});


app.get('/init/ini_ap', function(req, res) {
    import_ini_ap.import_file (app, function (count){
    res.send(JSON.stringify({Total_Registers:count}));
    console.log("The JSON file for Iniciativas Aprobadas was successfully imported :)");
    console.log(count+" legislators update with new Dates");
  });
});

app.get('/init/ini_de', function(req, res) {
    import_ini_de.import_file (app, function (count){
    res.send(JSON.stringify({Total_Registers:count}));
    console.log("The JSON file for Iniciativas Desechadas was successfully imported :)");
    console.log(count+" legislators update with new Dates");
  });
});

app.get('/init/ini_pe', function(req, res) {
    import_ini_pe.import_file (app, function (count){
    res.send(JSON.stringify({Total_Registers:count}));
    console.log("The JSON file for Iniciativas Pendientes was successfully imported :)");
    console.log(count+" legislators update with new Dates");
  });
});

app.get('/init/ini_pr', function(req, res) {
    import_ini_pr.import_file (app, function (count){
    res.send(JSON.stringify({Total_Registers:count}));
    console.log("The JSON file for Iniciativas Presentadas was successfully imported :)");
    console.log(count+" legislators update with new Dates");
  });
});

app.get('/init/ini_re', function(req, res) {
    import_ini_re.import_file (app, function (count){
    res.send(JSON.stringify({Total_Registers:count}));
    console.log("The JSON file for Iniciativas Retiradas was successfully imported :)");
    console.log(count+" legislators update with new Dates");
  });
});

app.get('/init/pda_ap', function(req, res) {
    import_pda_ap.import_file (app, function (count){
    res.send(JSON.stringify({Total_Registers:count}));
    console.log("The JSON file for P. Acuerdo was successfully imported :)");
    console.log(count+" legislators update with new Dates");
  });
});

app.get('/init/pda_de', function(req, res) {
    import_pda_de.import_file (app, function (count){
    res.send(JSON.stringify({Total_Registers:count}));
    console.log("The JSON file for P. Acuerdo Desechadas was successfully imported :)");
    console.log(count+" legislators update with new Dates");
  });
});

app.get('/init/pda_pe', function(req, res) {
    import_pda_pe.import_file (app, function (count){
    res.send(JSON.stringify({Total_Registers:count}));
    console.log("The JSON file for P. Acuerdo Pendientes was successfully imported :)");
    console.log(count+" legislators update with new Dates");
  });
});

app.get('/init/pda_pr', function(req, res) {
    import_pda_pr.import_file (app, function (count){
    res.send(JSON.stringify({Total_Registers:count}));
    console.log("The JSON file for P. Acuerdo Presentadas was successfully imported :)");
    console.log(count+" legislators update with new Dates");
  });
});

app.get('/init/pda_re', function(req, res) {
    import_pda_re.import_file (app, function (count){
    res.send(JSON.stringify({Total_Registers:count}));
    console.log("The JSON file for P. Acuerdo Retiradas was successfully imported :)");
    console.log(count+" legislators update with new Dates");
  });
});

app.get('/init/basic/facebook', function(req, res) {
    import_facebook_basic.import_file (app, function (count){
    res.send(JSON.stringify({Total_Registers:count}));
    console.log("The JSON file for BordeScore was successfully imported :)");
    console.log(count+" legislators update with new Facebook");
  });
});

// EndPoint para recoger los datos basicos de la pagina del SIL
app.get('/crawler/3d3fix/basic/sen',function(req, res) { //Crawl 3 de 3, twitter y fix nombres
  utilities_basic.tresdetresFix("senador", req, res, app, function(data){
    res.send(JSON.stringify(data));
  });
});

// EndPoint para recoger los datos basicos de la pagina del SIL
app.get('/crawler/3d3fix/basic/dip',function(req, res) { //Crawl 3 de 3, twitter y fix nombres
  utilities_basic.tresdetresFix("diputado", req, res, app, function(data){
    res.send(JSON.stringify(data));
  });
});

app.get('/crawler/basic/id_senado',function(req, res) { //Obtener klout diputados
  utilities_basic.id_senado(req, res, app, function(data){
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
