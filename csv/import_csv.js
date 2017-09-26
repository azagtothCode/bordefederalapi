var fs = require('fs');
var csv = require('fast-csv');
  // var stream = fs.createReadStream("/Users/Admin/documents/back_end/MEAN/bordefederalapi/csv/sample.csv");
 var stream = fs.createReadStream("csv/sample.csv");

module.exports = {

  import_csv:function(req, res, app){

    var legislstors = [];
    var csvStream = csv()

        .on("data", function(data){
             console.log(data);
        })
        .on("end", function(){
             console.log("done");
        });

          stream.pipe(csvStream);

  app.models[ "legislative_work" ].find({ select: ['id_legislative_work'] }).exec(function createCB(err_autor, found ){

    for (var i = 0; i < found.length; i++) {
      // console.log(found[i].id_legislative_work);
      if(found[i].id_legislative_work!=null){
        legislstors.push(found[i].id_legislative_work);
      }
    }
        // console.log(res = legislstors.toString());
        // console.log(res.split(','));

    csv
       .writeToPath("/Users/Admin/documents/back_end/MEAN/bordefederalapi/csv/out.csv", [
           {a: res}


       ], {
            headers: true,
            transform: function(row){
              console.log(row.a);
                // return {
                //     A: row.a,
                //     B: row.b
                // };
            }
       })
       .on("finish", function(){
          console.log("done!");
       });

  });


  // csv
  //    .writeToPath("/Users/Admin/documents/back_end/MEAN/bordefederalapi/csv/out.csv", [
  //        {a: "a1", b: "b1"},
  //        {a: "a2", b: "b2"}
  //    ], {
  //         headers: true,
  //         transform: function(row){
  //             return {
  //                 A: row.a,
  //                 B: row.b
  //             };
  //         }
  //    })
  //    .on("finish", function(){
  //       console.log("done!");
  //    });

   }
  }
