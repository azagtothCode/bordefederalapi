var Crawler = require('crawler');
var url = require('url');
var fs = require('fs');
var async = require('async');


module.exports={
	asistencia: function(req, res, app, regreso){
		console.log("entrando");
		count=0;
		lista={};
		var c = new Crawler({
		    maxConnections : 150,
		    forceUTF8:true,
		    callback : function (error, result, done) {


				var $=result.$;
    			var uri = result.options.uri;
    			id=uri.split("id=")[1];
			    console.log("-->",id);
			    lista[id]={id:id}
			    $("table[cellpadding='10']").find("tr").each(function(index, elem) {
			    	todo=$(elem).text();

			    	switch (index) {
			    		case "JUSTIFICADAS:": //tipo7
			    		lista[id].justificadas=0;
                  		break;
                  		case 1: //tipo
                  		lista[id].asistencias=clean( todo.replace("ASISTENCIAS:","") );
                  		break;
                  		case 2: //tipo
                  		lista[id].ausencias=clean( todo.replace("AUSENCIAS:","") );
                  		break;
                  		case 3: //tipo
                  		lista[id].comision=clean( todo.replace("COMISIÓNOFICIAL:","") );
                  		break;
                  		case 4: //tipo
                  		lista[id].justificadas=clean( todo.replace("JUSTIFICADAS:","") );
                  		break;
			    	}
			    });
			    app.models[ "legisladores" ].update({idSenado:id},{asistencia:lista[id]}).exec(function afterwards(err, updated){//{trayectoria:dip.trayectoria , silid:dip.uriid}).exec(function afterwards(err, updated){
                    console.log('Updated');
                    done();
              	});


		    }
		});
		//c.queue('http://www.senado.gob.mx/index.php?watch=35&sm=3&id=675');
		app.models[ "legisladores" ].find({ select: ['idSenado'], camara:"senador" }).exec(function createCB(err_autor, found ){

			for (var i = found.length - 1; i >= 0; i--) {

	            if (found[i].idSenado) {

	              lista[found[i].idSenado]=found[i].id;
	              console.log("FF ",lista[found[i].idSenado],found[i].idSenado)
	              	c.queue('http://www.senado.gob.mx/index.php?watch=35&sm=3&id='+found[i].idSenado);
	            }
	          }
		});



	}
}
function clean(text){
	text=text.replace("\n","");
	text=text.replace("\t","");
	return text.trim();

}
