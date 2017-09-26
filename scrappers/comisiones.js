var Crawler = require('crawler');
var url = require('url');
var fs = require('fs');
var async = require('async');


module.exports={
	senado: function(req, res, app, regreso){
		count=0;

    	var c = new Crawler({
		    maxConnections : 2,
		    forceUTF8:true,
		    callback : function (error, result, $) {

					list_senate={};
					legislator_commission_sil={};
		    	var $=result.$;
          var uri = result.options.uri;

					$("tr").each(function(index, elem) {
						value_td_zero=$(elem).find(".tddatosazul").eq(0).text();
						value_td_one=$(elem).find(".tddatosazul").eq(1).text();
						value_td_two=$(elem).find(".tddatosazul").eq(2).find("a").attr("href");
						if (value_td_two) {
							value_td_two=value_td_two.split("incluir(")[1];
							value_td_two=value_td_two.split(",")[0];
						}
						list_senate[value_td_two]={name_comission:value_td_one,type_comission:value_td_zero,id_comission:value_td_two,theme_comission:" "}
						console.log("Comission: ", value_td_zero , value_td_one , value_td_two);
					});

					async.each(list_senate, function(com, cb){
							app.models[ "commissions" ].create(com).exec(function afterwards(err, updated){
							console.log('Updated ',count," Comissions senate... ");
							if(updated){
								console.log('Updating comissions senate, Await...');
							}
							if(!updated || err!=null){
								console.log('ERROR DETECTED :(',updated,err);
							}else{
								console.log("No errors detected :D");
							}
							count+=1;
							cb();
					});
				}, function(err) {
					regreso({found:count})
				});

		    }
		});
		c.queue('http://sil.gobernacion.gob.mx/Librerias/pp_ListComision.php?TIPOCOMISION=5&Camara=2&Legislatura=63&SID=&strEstatus=A');
	},
	diputados: function(req, res, app, regreso){
		count=0;

    	var c = new Crawler({
		    maxConnections : 2,
		    forceUTF8:true,
		    callback : function (error, result, $) {
		    	list_deputy={};
		    	var $=result.$;
            	var uri = result.options.uri;
							$("tr").each(function(index, elem) {
            		value_td_zero=$(elem).find(".tddatosazul").eq(0).text();
            		value_td_one=$(elem).find(".tddatosazul").eq(1).text();
            		value_td_two=$(elem).find(".tddatosazul").eq(2).find("a").attr("href");
            		if (value_td_two) {
            			value_td_two=value_td_two.split("incluir(")[1];
            			value_td_two=value_td_two.split(",")[0];
            		}
            		list_deputy[value_td_two]={name_comission:value_td_one,type_comission:value_td_zero,id_comission:value_td_two,theme_comission:" "}
            		console.log("Comission: ", value_td_zero , value_td_one , value_td_two);
            	});

        		async.each(list_deputy, function(com, cb){
                app.models[ "commissions" ].create(com).exec(function afterwards(err, updated){
								console.log('Updated ',count," Comissions deputy... ");
								if(updated){
									console.log('Updating comissions deputy, Await...');
								}
								if(!updated || err!=null){
									console.log('ERROR DETECTED :(',updated,err);
								}else{
									console.log("No errors detected :D");
								}
						  	count+=1;
						  	cb();
						});
		    	}, function(err) {
		    		regreso({found:count})
		    	});

		    }
		});
		c.queue('http://sil.gobernacion.gob.mx/Librerias/pp_ListComision.php?TIPOCOMISION=5&Camara=1&Legislatura=63&SID=&strEstatus=');
	}
}
