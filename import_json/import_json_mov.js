// Import node modules for API operation
var crawler = require('crawler');
var url = require('url');
var fs = require('fs');
var async = require('async');

// Started module crawler
module.exports = {

    import_file:function(app, return_import){

      //Creamos una variable para guardar la informacion del archivo a importar
      var obj_legislators;

      //cargamos el archivo JSON
      //err manda errores
      //data guarda la informacion
      fs.readFile('./senators/list_mov.json', 'utf8', function (err, data) {

        //Si hubo problema al cargar el archivo avisamos
        if (err) throw err;

        //Hacemos una variable que se encargara de manipular el conteo de cada uno de los datos en el archivo
        count=0;

        //convertimos la informcion del archivo a lenguaje JSON y la asignamos
        obj_legislators = JSON.parse(data);

        //contamos cada uno de los registros dentro del objeto
        //value    valor dentro del archivo JSON
        //key      identificador de cada registro
        //callback metodo que se ejecuta despues de cada conteo
        async.forEachOf(obj_legislators, function(value, key, callback) {

          //imprimimos el archivo
       		//console.log(value, key);

          //guardamos los registros dentro del modelo legisladores
          app.models[ "legislators" ].create({id_legislator_sil:key, legislator_chamber_sil:value}).exec(function createCB(err, created){

            //variable que se encraga del conteo en cada inserccion
            count+=1;

             //imprimimos la consulta ejecutada
             //console.log("errcreating:",err);
             //console.log("body",created);

             //ejecutamos el metodo callback para que ejecute nuevamente la accion
             callback();
           });

             //si no hubo problema se devuelve el total de registros afectados
         }, function(err) {
            return_import(count);
         });
      });
    }
}
