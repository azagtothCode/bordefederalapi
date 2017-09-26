/// Importamos los modulos que vamos a ocupar dentro del api
var crawler = require('crawler');
var url = require('url');
var fs = require('fs');
var async = require('async');

module.exports = {

  legislativo_votation:function (req, res, app, regreso){
    console.log(req.body.direccion_sil);
    controlv={added:0,repetidos:0}
    var control_trabajo={}; // Variable para tener control de unicidad en trabajo legislativo
    app.models[ "legislative_votation" ].find({ select: ['id_legislative_votation'] }).exec(function createCB(err_autor, found ){
        // console.log("hola encontre",found);


          for (var i = found.length - 1; i >= 0; i--) {
            if (found[i].id_legislative_votation) {
                control_trabajo[found[i].id_legislative_votation]=1;
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
            console.log("Iniciative Page:",pagina)
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
          maxConnections : 10000,
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
                      iniciativa["id_legislative_votation"]=href;
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
                    break;
                    case 9: //Temas
                      //  var themes = [];
                       var only_text = $(td).text();
                       if(only_text==""){
                         only_text="S/T";
                       }
                       iniciativa["work_votation"]=only_text;
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
              if (control_trabajo[iniciativa["id_legislative_votation"]]==1 && iniciativa["id_legislative_votation"]) {

                 countRep+=1;
              }
              else{
                countAdded+=1;

                trabajo.push(iniciativa);
                //console.log(trabajo);

              }//else
            }); // EACH TR
            async.each(trabajo, function(inic, doneini){
              app.models[ "legislative_votation" ].create(inic).exec(function createCB(err, created){
                if(err!=null){
                  console.log("errcreating:",err);
                }

                 //console.log("body",created);
                 var iniini=created.id;
                 async.each(created.author_id, function(autor, cb){
                    app.models[ "legislators" ].find({id_legislator_sil:autor}).populate("trabajovotation").exec(function createCB(err_autor, found ){
                      console.log(found,created,">---",iniini);
                       if (found[0]) {
                          found[0].trabajovotation.add(iniini);
                           found[0].save(function(err_link){
                             console.log("Work legislative points created successfully :D error type ->",err_link);
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
