// Import node modules for API operation
var crawler = require('crawler');
var url = require('url');
var fs = require('fs');
var async = require('async');

// Started module crawler
module.exports = {
  info_basic_get_sil:function (req, res, app, return_info_basic){
    var legislstors_all = [];
     var c = new crawler({
        forceUTF8:true,
		    maxConnections : 1000,
		    callback : function (error, result, done) {

            var $=result.$;
			    	var uri = result.options.uri;

			    	id=uri.split("Referencia=")[1];
			    	dip={};
			    	//dip.legislator_id_sil=id;
            console.log("Updating legislator information await...");
            console.log("Find " + id);
			    	$('table[border="1"]').eq(0).find(".tdcriterio").each(function(index, elem) {
			    		cat=$(elem).text();
			    		valelem=$(elem).parent("tr").find(".tddatosazul");
			    		val=$(elem).parent("tr").find(".tddatosazul").text();

			    		if (cat.indexOf("Nombre")>-1) { // guardamos el nombre

			    			val=$(elem).parent("tr").find(".tddatosazul").find("b").text();//.find("b").text();
			    			vals=val.split(", ");

			    			dip["legislator_name_sil"]=vals[1]+" "+vals[0];
			    			dip["legislator_last_name_sil"]=vals[0];
			    			dip["legislator_first_name_sil"]=vals[1];

			    		}
			    		else if (cat.indexOf("Partido")>-1) { //
			    			dip["legislator_party_sil"]=val;
			    		}
			    		else if (cat.indexOf("Correo")>-1) { // name

			    			dip["legislator_mail_sil"]=val;
			    		}
			    		else if (cat.indexOf("Zona")>-1) { // name
			    			val=$(elem).parent("tr").find(".tddatosazul").html();
			    			vals=val.split("<br>")
			    			vals2=vals[0].split("Entidad: ")
			    			dip["legislator_state_sil"]=vals2[1];
			    		}
			    		else if (cat.indexOf("Principio de")>-1) { // name
			    			if (val.indexOf("Relativa")>-1) {
			    				val="MR";
			    			}
			    			else if (val.indexOf("Minor")>-1) {
			    				val="PM";
			    			}
			    			else if (val.indexOf("Proporcional")>-1) {
			    				val="RP";
			    			}
			    			dip["legislator_election_sil"]=val;
			    		}

			    	});
					num=0;
					tit="";
          dip["legislator_commission_sil"]=[];
					$("img").each(function(index,elem) {
						src=$(elem).attr("src");

					});
					$('table[border="1"]').eq(1).find("tr").each(function(index, elem) {
						if(num==0){
							tit=$(elem).find("td").eq(0).text();
						}
						else{
							if(tit=="Comisión"){
								all=$(elem).text();
					    		//console.log("-_-"+ all)
					    		puesto=cleanText( $(elem).find("td").eq(1).text() );
					    		comision=cleanText( $(elem).find("td").eq(0).text() );
                  status=$(elem).find("td").eq(4).text() ;
                  if(status == "ACTIVO" && comision.indexOf("(Com. Perm.)") == -1 ){
                    comision=comision.replace(" (C. Diputados)",",Dip.").replace(" (C. Senadores)",",Sen.");
                    arr_commission = comision.split(",");
                     dip["legislator_commission_sil"].push({legislator_post_sil:puesto, legislator_namecom_sil:arr_commission[0], legislator_status_sil:status });

                  }
							}
						}
						num+=1;

			    	});

			    	dip["legislator_image_sil"]=$('img[alt="Foto del Legislador"]').attr("src");
            dip["legislator_order_sil"]="Federal";
  					dip["legislator_score_sil"]=0;
  					//dip["legislator_sil_id"]=id;

                  app.models[ "legislators_basic" ].update({id_legislator_sil:id},dip).exec(function afterwards(err, updated){//{trayectoria:dip.trayectoria , silid:dip.uriid}).exec(function afterwards(err, updated){
                  //console.log('Updated Legislator');
              });
			    }
			});


			////////////
      app.models[ "legislators_basic" ].find().exec(function (err, dips){
            if (err) {
                console.log("Error ----> ",err);
            }
            else{
                console.log("legislators found", dips.length);
            }
              for (var i = 0; i < dips.length; i++) {
                legislstors_all.push(dips[i].id_legislator_sil);
              }

                for(i=0; i<legislstors_all.length; i++){
                  c.queue("http://sil.gobernacion.gob.mx/Librerias/pp_PerfilLegislador.php?SID=&Referencia="+legislstors_all[i]);
                }
            return_info_basic({Legislators_Updated:legislstors_all.length})
        });
  },
}

function cleanText(txt){
   txt=txt.trim();
   txt=txt.replace("Sen. ", "");
   txt=txt.replace("Dip. ", "");
   txt=txt.replace("\r", "");
   txt=txt.replace("\n", "");
   txt.replace("\t", "");
   txt.replace(" (C. Diputados)", "");
   txt.replace(" (C. Senadores)", "");
   txt=txt.trim();
   return txt;
}
