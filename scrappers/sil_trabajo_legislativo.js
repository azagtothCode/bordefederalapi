/// Importamos los modulos que vamos a ocupar dentro del api
var crawler = require('crawler');
var url = require('url');
var fs = require('fs');
var async = require('async');

module.exports = {

  legislativo_info:function (req, res, app, regreso){
    controlv={added:0,repetidos:0}
    var control_trabajo={}; // Variable para tener control de unicidad en trabajo legislativo
    app.models[ "legislative_work" ].find({ select: ['id_legislative_work'] }).exec(function createCB(err_autor, found ){
        // console.log("hola encontre",found);


          for (var i = found.length - 1; i >= 0; i--) {
            if (found[i].id_legislative_work) {
                control_trabajo[found[i].id_legislative_work]=1;
                // console.log("Hola soy control trabajo",control_trabajo);
            }
          }

          pagnum=req.body.direccion_sil.split("Paginas=")[1];
          paginas=[];
          registros=req.body.direccion_sil.split("Reg=")[1].split("&")[0];
          urlcount=Math.ceil(registros/pagnum);//http://sil.gobernacion.gob.mx/Busquedas/Basica/ResultadosBusquedaBasica.php?SID=07fbfff611eb72643a8178547affa52b&Serial=c01eb727c0a90ca519bcecc2d21357f8&Reg=2618&Paginas=100&pagina=1

          for (i=1;i<=urlcount;i++) {//http://sil.gobernacion.gob.mx/Busquedas/Basica/ResultadosBusquedaBasica.php?SID=07fbfff611eb72643a8178547affa52b&Origen=BB&Serial=c01eb727c0a90ca519bcecc2d21357f8&Reg=2618&Paginas=100&pagina=1
            paginas[i]=req.body.direccion_sil.split("Reg=")[0]+"Reg="+registros+"&Origen=BB&Paginas="+pagnum+"&pagina="+i;
          }

           async.each(paginas, function(pagina, donecrawl){
            // console.log("Iniciative Page:",pagina)
            paginaSilCrawl(app,control_trabajo,pagina,function(resultado){
              controlv.added+=resultado.added;
              controlv.repetidos+=resultado.repetidos;
              donecrawl();

            });
           },function(err){
              console.log("welcome control", controlv);
              regreso(controlv);
            });
     });
  }
}
function paginaSilCrawl(app,control_trabajo,url,finish){
    countRep=0;
    countAdded=0;
    var c = new crawler({
          forceUTF8:true,
          maxConnections :5000,
          callback : function (error, result, done) {
            var $=result.$;
            var uri = result.options.uri;
            //var table = $('table[border="1"]');
            var trabajo = [];
            $('table[border="1"]').find("tr").each(function(index, elem) {

              var iniciativa = {};

              $(elem).find(".tddatosazulrep, .tddatosnaranja").each(function(indextd, td) {

                //indextd devuelve el numero de elementos encontrados en la tabla
                //td devuelve la informacion correspondiente
                switch (indextd) {

                  case 1: //tipo
                      iniciativa["work_type"]=$(td).text();
                  break;
                  case 2: //denominación
                      iniciativa["work_description"]=$(td).text();
                      var href = $(td).find("a").attr("onclick");

                      var unico = href.split('Clave=')[1].split('",')[0];
                      iniciativa["id_legislative_work"]=unico;
                  break;
                  case 3: // sub-clasificación
                      iniciativa["work_clasification"]=$(td).text();
                  break;
                  case 4: //Presentada en
                      iniciativa["work_place_present"]=$(td).text();
                  break;
                  case 5: //Fecha presentación
                    iniciativa["work_date_present"]=$(td).text();
                    break;
                  case 6: //
                      var autores = [];
                      iniciativa["work_author_present"]=$(td).text();

                      $(td).find("a").each(function(indexa, elema){
                        var href = $(elema).attr("onclick");
                        if(href){
                          var unico = href.split('Referencia=')[1].split('",')[0];
                          autores.push(unico);
                        }
                      });
                      iniciativa["author_id"]=autores;
                      // console.log(iniciativa["author_id"]);
                    break;
                    case 9: //Temas
                       iniciativa["work_themes"] = [];
                       var only_text = $(td).text();
                       if(only_text==""){
                         only_text="S/T";
                       }

                       theme = only_text

                            .replace("1.-Diputados -","Dip.,")
                            .replace("2.-Diputados -","Dip.,")
                            .replace("3.-Diputados -","Dip.,")
                            .replace("4.-Diputados -","Dip.,")
                            .replace("5.-Diputados -","Dip.,")
                            .replace("6.-Diputados -","Dip.,")

                            .replace("1.-Senado -","Sen.,")
                            .replace("2.-Senado -",",Sen.,")
                            .replace("3.-Senado -",",Sen.,")
                            .replace("4.-Senado -",",Sen.,")
                            .replace("5.-Senado -",",Sen.,")
                            .replace("6.-Senado -",",Sen.,")

                            .replace("Primera.-Para dictamen","")
                            .replace("Segunda.-Para dictamen","")

                            .replace("dictamen","")
                            .replace(".-Para","")

                            .replace("Para dictamen","")
                            .replace(".-Para dictamen","");

                            newtheme = theme.trim();
                            themeArray = newtheme.split(",");
                            themeEmpty = JSON.stringify(themeArray.filter(function(entry) { return entry.trim() != ''; }));
                            themeArrayEmpty = newtheme.split(",");
                            //Eliminamos campos de Array Vacios
                            themeArrayEmpty = themeArrayEmpty.filter((value, index, themeArrayy) => (themeArrayEmpty.slice(0, index)).indexOf(value) === -1);
                            //Convertimos unico el Array
                            filter_array(themeArrayEmpty);


                          var  uno = [];
                          if(themeArrayEmpty[0].toString()== "Dip." || themeArrayEmpty[0].toString()== "Sen."){

                            if(themeArrayEmpty[1]){uno.push(themeArrayEmpty[1].toString().trim());}
                            if(themeArrayEmpty[2]){uno.push(themeArrayEmpty[2].toString().trim());}
                            if(themeArrayEmpty[3]){uno.push(themeArrayEmpty[3].toString().trim());}
                            if(themeArrayEmpty[4]){uno.push(themeArrayEmpty[4].toString().trim());}
                            if(themeArrayEmpty[5]){uno.push(themeArrayEmpty[5].toString().trim());}
                            if(themeArrayEmpty[6]){uno.push(themeArrayEmpty[6].toString().trim());}

                              iniciativa["work_themes"].push({iniciativa_type:themeArrayEmpty[0], iniciativa_name:uno});
                            }

                      break;
                    case 10: //Temas
                       var status = [];
                       var only_text = $(td).text();
                       status.push(only_text);
                       iniciativa["work_status"]=status;
                    break;
                  default:

                }

              });
              if (control_trabajo[iniciativa["id_legislative_work"]]==1 && iniciativa["id_legislative_work"]) {

                 countRep+=1;
              }
              else{
                countAdded+=1;

                trabajo.push(iniciativa);
                //console.log(trabajo);

              }//else
            }); // EACH TR
            async.each(trabajo, function(inic, doneini){
              app.models[ "legislative_work" ].create(inic).exec(function createCB(err, created){
                if(err!=null){
                  console.log("errcreating:",err);
                }

                 //console.log("body",created);
                 var iniini=created.id;
                 async.each(created.author_id, function(autor, cb){
                    app.models[ "legislators" ].find({id_legislator_sil:autor}).populate("trabajo").exec(function createCB(err_autor, found ){
                      // console.log(found,created,">---",iniini);
                       if (found[0]) {
                          found[0].trabajo.add(iniini);
                           found[0].save(function(err_link){
                             console.log("Work legislative created successfully :D error type ->",err_link);
                           });
                       }
                    });
                     cb();
                     //console.log("Author Names: "+autor);
                   },function(err){
                     doneini();
                   });//add
              });//create
            },function(err){

              finish({added:countRep,repetidos:countAdded});

            });//add
          } //callback
        }); //CRAWL
    c.queue(url);
}

function filter_array(test_array) {
    var index = -1,
        arr_length = test_array ? test_array.length : 0,
        resIndex = -1,
        result = [];

    while (++index < arr_length) {
        var value = test_array[index];

        if (value) {
            result[++resIndex] = value;
        }
    }

    return result;
}
