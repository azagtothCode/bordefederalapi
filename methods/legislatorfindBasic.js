"use strict();";


var _ = require('lodash')
	, async = require('async')
	, allowed = [ '_id',"ids", 'name' ]; // witch paths are allowed in the get request.

if (process.env.NODE_ENV=='development') console.log("API has loaded");

// All purpose array check for docs, And response, It calls the done that is attached to this via bind.

var returnDocs = function returnDocs ( err, docs )
{

	if ( ! _.isArray( docs ) ) docs = [ docs ];

	this.done( err, _.isEmpty( err ) ? docs : [] );

};

// All purpose async.auto done callback.

var autoDone =  function autoDone ( err, results )
{

	if ( _.isEmpty( err ) ) this.res.end( JSON.stringify( results.do ) );

	else
	{

		this.app.logger.error( err );

		this.res.status( 500 );

		// TODO: change this for a more slim response.
		if ( process.env.NODE_ENV == 'production' ) this.res.end( JSON.stringify( [ err ] ) );
		// dev mode answer.
		else this.res.end( JSON.stringify( [ err, results ] ) );

	}

	this.cb();

};

module.exports = module.export =
{

  post: function post ( req, res, app, cb )
{

      app.models[ "legislators_basic" ].create(req.body).exec(function createCB(err, created){
          console.log("err:"+err);
          console.log("body",req.body);
          res.end( JSON.stringify( created ) );
      });
      //res.end( JSON.stringify( {miau:"dens"} ) );
      //var q = app.models[ "diputados" ].find();
      //q.exec( function (err, allTheStuff) {
      //    console.log("err:"+err);
      //    res.end( JSON.stringify( allTheStuff ) );
      //});
  },

  get: function apiGET ( req, res, app, cb )
{

      console.log("geto",req.body);
      if (!req.body) {
          req.body={};
      }
			//  var www = JSON.stringify(req.body);
			 //
			//  var res = www.replace("{ legislator_score_sil: '50' }", "{ legislator_score_sil: {$qte:50} }");
			 //
			 //
			//  var myobj = JSON.parse(res);
			//  console.log(myobj);

  var q = app.models[ "legislators_basic" ].find().sort( { "legislator_score_sil": -1 }  ).where(req.body);//);
  if ( ! _.isEmpty( req.body.populate ) )
  {
    _.each( req.body.populate, function (p) {
      q.populate( p );
    } );
  }

  if ( ! _.isEmpty( req.body.paginate ) )
  {
    if ( ! _.isEmpty( req.body.paginate.page ) && ! _.isEmpty( req.body.paginate.limit ) )
      q.paginate( req.body.paginate.page, req.body.paginate.limit );
  }


  q.exec( function (err, theobject){
           console.log(err,theobject);
           if (req.body.bs) {
              app.models[ "bs" ].find().exec(function (err, bss){
                    if (err) {
                      console.log("err", err);
                    }
                    else{
                      res.end( JSON.stringify( {dip:theobject,bs:bss} ) );
                    }
              });
           }
           else{
              res.end( JSON.stringify( {dip:theobject} ) );
           }

  } );
}
};
