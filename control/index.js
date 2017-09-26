var crawler = require('crawler');
var url = require('url');
var fs = require('fs');
var async = require('async');
var moment = require('moment');

// Exportamos el modulo crowler y comenzamos ocn la busqueda de elementos
module.exports = {
	trabajo_fechas: function (params,app, finish){
		 app.models[ "legislative_work" ].find({select: ['work_date_present']}).sort({work_date_present: 1}).exec(function afterwards(err, found){//{trayectoria:dip.trayectoria , silid:dip.uriid}).exec(function afterwards(err, updated){
                    console.log('found',found);
              });

	},
	exportRanking:function (req, res, app, regreso){
		string='Nombre;Klout;Trabajo\n';
		app.models[ "legislstors" ].find({ legislator_chamber_sil:"senador" }, {
			legislator_name_sil: 1,
			legislator_chamber_sil: 1,
			estado: 1,
			kloutscore: 1
		}).populate("trabajo").exec(function createCB(err, list){
			console.log(list.length);
			for(subject in list){
				sub=list[subject];
				kloutscore=0;
				if(sub.kloutscore){kloutscore=sub.kloutscore.score}

				string+=sub.legislator_name_sil+";"
				+kloutscore+";"
				+sub.trabajo.length+";"
				+"\n";
			}
			console.log("string",string);
			regreso(string);
		});
	}

}
