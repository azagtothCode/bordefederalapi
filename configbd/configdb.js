  var export_models = require ('./modelos.js');
  /*
  *@var waterline
  *@desc variable que manda a llamar la instancia waterline para usar la bd
  */
  var waterline = require ("waterline");

  /*
  *@var con_mongo
  *@desc variable que manda a llamar la instancia para usar mongo-bd
  */
  var con_mongo = require ("sails-mongo");

  /*
  *@var waterline
  *@desc constructor de la instancia waterline
  */
  var construct_bd = new waterline();

  /*
  *@var config_bd
  *@desc variable que manda a llamar la instancia waterline para usar la bd
  */
  var config_bd =
  {
    adapters:{
      'default': 'mongo',
      mongo: con_mongo
    },
  connections:
  {
    baseborde:{
      adapter: 'mongo',
      host: '104.239.249.32',
      port: 27017,
      user: 'root',
      password: '',
      // database: 'baseprueba'
      // chida database: 'api_federal'
      database: 'api_federal'
    }

  }
 }

  var legislators  = waterline.Collection.extend(export_models.legislators);
  var legislative_work  = waterline.Collection.extend(export_models.legislative_work);
  var legislative_workpoint  = waterline.Collection.extend(export_models.legislative_workpoint);
  var legislative_votation  = waterline.Collection.extend(export_models.legislative_votation);
  var commissions  = waterline.Collection.extend(export_models.commissions);

  construct_bd.loadCollection(legislators);
  construct_bd.loadCollection(legislative_work);
  construct_bd.loadCollection(legislative_workpoint);
  construct_bd.loadCollection(legislative_votation);
  construct_bd.loadCollection(commissions);


      module.exports = function ( app )
      {

       construct_bd.initialize( config_bd, function( err, models )
       {

      if(err) console.error(err);

         app.models = models.collections;
         app.connections = models.connections;

       });

       return app;

      };
