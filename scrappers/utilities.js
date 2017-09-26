//Utilidades que usaremos en el transcurso de las peticiones
var Crawler = require("crawler");
var url = require('url');
var fs = require('fs');
var http = require('http-get');
var request = require('request');
var _ = require('lodash');
// var Iconv  = require('iconv').Iconv;
var async=require('async');
var moment=require('moment');
var Levenshtein=require('levenshtein');
var Klout = require("node_klout"),
    klout = new Klout("99h2jp3negmh38pyuuvu2jkr");
moment.locale('es');

//Arrays para guardar informacion
var news_array=[];
var bscore={}
var dipuvar=[];
var updatelist={};
orderednews={};

//Iniciamos
module.exports ={
	tresdetresFix: function ( chamber, req, res, app, regreso ){ //crawl página de tres de  para lista de twitter y nombres
		dipnames={};
		app.models[ "legislators" ].find({ legislator_chamber_sil:chamber }, { legislator_name_sil: 1 }).exec(function createCB(err, list){

			for(subject in list){

				dip=list[subject];

				dipnames[dip.legislator_name_sil]=dip.id;

			}

			if (chamber=="diputado") {c.queue('http://3de3.mx/api/apiv1/2015/candidatos/ganadores?cargo=Diputado%20Federal');} //llamada API página
			if (chamber=="senador") {c.queue('http://3de3.mx/api/apiv1/2015/candidatos/ganadores?cargo=Senador');} //llamada API página

		});
		count=0;
		var c = new Crawler({
		    maxConnections : 2,
		    forceUTF8:true,
		    callback : function (error, result, $) {
		    	res_s = JSON.parse(result.body);
		    	sitienen=res_s.candidatos;

		    	async.forEachSeries(sitienen, function(legis, callback) {

		    		l_3de3=0;
            l_twitter="";
		    		l_genero="";
		    		if (legis.patrimonial) {l_3de3=1;}
            if (legis.legislator_twitter_senate) { l_twitter=legis.legislator_twitter_senate; count+=1; }
		    		if (legis.legislator_gender_senate) {
                l_genero=legis.legislator_gender_senate;
                switch (l_genero) {
                  case 'F':
                    l_genero = "Femenino";
                    break;
                  case 'M':
                    l_genero = "Masculino";
                    break;
                  default:
                }
                //console.log(l_genero);
               }

		    		name_legis=legis.legislator_name_sil+" "+legis.legislator_last_name_sil


		    		match=levPicker0(name_legis,dipnames);

		    		// console.log(name_legis,"-->",match);
            // process.exit()
		    		app.models[ "legislators" ].update({legislator_name_sil:match[0]},{
		    			legislator_tresdetres_senate:l_3de3,
		    			legislator_twitter_senate:l_twitter,
		    			// nombres:legis.nombres,
		    			// apellido_paterno:legis.apellido_paterno,
              // apellido_materno:legis.apellido_materno,
		    			legislator_gender_senate:l_genero
		    		}).exec(function afterwards(err, updated){
              //print all
					  	//console.log('Updated',updated,err);
					  	callback();
					});
		    	}, function(err) {
		    		 console.log("Done 3d3 ", chamber);
		    		 regreso({updated:count})

		    	});

		    }
		});

	},
	klout: function ( camara, req, res, app, regreso ){ //crawl página de tres de tres
		dipnames={};
		count=0;
		app.models[ "legislators" ].find({ legislator_chamber_sil:camara }, { legislator_name_sil: 1, legislator_twitter_senate:1 }).limit(1000).exec(function createCB(err, list){ //nombre_legis_sil

			async.forEachSeries(list, function(legis, callback) {
        console.log("SOY LEGIS",legis.id);
				if (legis.legislator_twitter_senate && legis.legislator_twitter_senate.length >1) {
					getKlout(legis.legislator_twitter_senate,function cb(response){
						console.log("lo hice");
						app.models[ "legislators" ].update(legis.id,{
			    			kloutscore:response.score
			    		}).exec(function afterwards(err, updated){
						  	console.log('Updated',updated,err);
						  	count+=1;
						  	callback();
						});
					});

				}
				else{
					callback();
				}


	    	}, function(err) {
	    		regreso({updated:count});
	    		console.log("DONE klout");
	    	});

		});

		// app.models[ "diputados" ].find({ camara:camara }, { name: 1 }).exec(function createCB(err, list){
		// 	for(subject in list){
		// 		dip=list[subject];
		// 		dipnames[dip.name]=dip.id;
		// 	}
		// 	if (camara=="diputados") {c.queue('http://3de3.mx/api/apiv1/2015/candidatos/ganadores?cargo=Diputado%20Federal');} //llamada API página
		// 	if (camara=="senadores") {c.queue('http://3de3.mx/api/apiv1/2015/candidatos/ganadores?cargo=Senador');} //llamada API página
		// });
	},
	id_senado: function(req, res, app, regreso){
		dipnames={};
		var listado={}

		app.models[ "legislators" ].find({ legislator_chamber_sil:"senador" }, { legislator_name_sil: 1 }).exec(function createCB(err, list){
      console.log("Soy", list);
      	for(subject in list){
				dip=list[subject];
				dipnames[dip.legislator_name_sil]=dip.id;
			}
			//console.log(dipnames);//
		});
		var listado={};
		var c = new Crawler({
		    maxConnections : 2,
		    forceUTF8:true,
		    callback : function (error, result, $) {
		    	var $=result.$;
          //console.log(result);
		    	$(".lista_gaceta").find("a").each(function(index,elem) {
					href=$(elem).attr("href");
          // console.log("Soy href : "+href);

          //console.log(result);
					nombre=$(elem).html();
					nombre = nombre.replace("<br>", " ");
					nombre=nombre.split("Sen. ")[1];

					if(href && href.includes("index")){
						idsen=href.split("id=")[1];
						//console.log(href,nombre);
						match=levPicker0(nombre,dipnames);
						//console.log(nombre,"-->",match);
						listado[idsen]={nombre:nombre, match:match, idsen:idsen};
            //console.log("Hola soy listado ",listado);
					}

				});
				//regreso({updated:listado});
				//console.log(Object.keys(listado).length,listado);

		    	async.forEachSeries(listado, function(legis, callback) {
		    		//console.log("[][]",legis,listado[legis]);
		    		app.models[ "legislators" ].update(legis.match[1],{
		    			idSenado:legis.idsen
		    		}).exec(function afterwards(err, updated){
					  	//console.log('Updated',updated,err);
					  	callback();
					});
		    	}, function(err) {
		    		regreso(listado);
		    		console.log("Done Id Senator");
		    	});

		    }
		});
		c.queue("http://www.senado.gob.mx/index.php?watch=4");

	}

}

function levPicker(str,obj){ //cicla un array para obtener el mejor match (levenshtein) en el
	max=100;
	maxname="none";
	for (name in obj) {
		if (str && str.length>0 && name && name.length>0) {
			ratio=levMatcher( standard(str) , standard(name) );
			if (ratio<max) {
				max=ratio;
				maxname=name;
			}
		}

	}
	if (max>20) {return ["-","-"];}
	else{
		return [standard(maxname),standard(obj[maxname]) ];
	}

}
function levPicker0(str,obj){ //cicla un array para obtener el mejor match (levenshtein) en el
	max=100;
	maxname="none";
	for (name in obj) {
		if (str && str.length>0 && name && name.length>0) {
			ratio=levMatcher( standard(str) , standard(name) );
			if (ratio<max) {
				max=ratio;
				maxname=name;
			}
		}

	}
	// if (max>20) {return ["-","-"];}
	// else{
		return [standard(maxname),standard(obj[maxname]) ];
	//}

}
function levMatcher(st1,st2){ //implementción de comparación de levenshtein
	var dl=new Levenshtein( st1, st2 );
	return dl.distance;
}
function partialMatcher(match,list){ //IMPORTANTE
	for(name in list){
		subject=list[name];
		console.log(112,subject);
	}
}
function standard(str){
	if (str) {
		str=str.toLowerCase();
		str=str.trim();
		return str;
	}
	else{
		return str;
	}
}
function printCSV(object){
	for (com in object) {
		console.log(com ,";", object[com].entrada , ";" ,object[com].salida);
	};
}
function cleancom(turno){
	r="";
	r=turno.replace(/Para dictamen/gi, "");
	r=r.replace(/Diputados/gi, "");
	r=r.replace(/Senadores/gi, "");
	r=r.replace(/Para opinión/gi, "");
	return r;
}
function getKlout(twt,cb){ //obtiene el klout score a partir de la cuenta de twuitter
	console.log("HOLA",twt);
	klout.getKloutIdentity(twt, function(error, klout_user) {
		   console.log("SALUDOS",error, klout_user);
		   klout.getUser(klout_user.id, function(error, klout_response) {
			    console.log("ADIOS",klout_response);
			    cb(klout_response);
			});
		});
}
