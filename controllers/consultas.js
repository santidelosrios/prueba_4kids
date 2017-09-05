let helpers = require('../helpers/helpers.js');


/*
  Controller to get all notes by date range. If date range not sent, get all notes of the current week.
  Parameters: startDate - String in YYYY-MM-DD format. finishDate - String in YYYY-MM-DD
  return: if something goes wrong - {err:err_msg}, if query goes well - {data: [results]
*/
exports.observacionesByDate = function (req,res,connection){

  //Check if date range is present, if not, get note of last week
  if(req.query.startDate && req.query.finishDate){
    //get request parameters and create Javascript Date objects
    let startDate = new Date(req.query.startDate);
    let finishDate = new Date(req.query.finishDate);

    //Format to mysql datetime
    let mysqlStartDate = helpers.toMysqlFormat(startDate);
    let mysqlFinishDate = helpers.toMysqlFormat(finishDate);

    connection.query('SELECT observacion_text,image_file,kid_id FROM 4kids.observaciones WHERE observacion_date BETWEEN ? AND ?',[mysqlStartDate,mysqlFinishDate],function (err,results,fields){
      if(err){
        res.send({"error": err,data:[]});
      }else{
        res.send({"data":results})
      }
    });
  }else{
    //Get an array with the first date of the week and the last one
    let currentWeekDates = helpers.getCurrentWeekDates();

    //Format to mysql datetime
    let mysqlCurrentWeekDates = [helpers.toMysqlFormat(currentWeekDates[0]),helpers.toMysqlFormat(currentWeekDates[1])];

    connection.query('SELECT observacion_text,image_file,kid_id FROM 4kids.observaciones WHERE observacion_date BETWEEN ? AND ?',[mysqlCurrentWeekDates[0],mysqlCurrentWeekDates[1]],function (err,results,fields){
      if(err){
        res.send({"error": err,data:[]});
      }else{
        res.send({"data":results})
      }
    });
  }
}

/*
  Controller to get all kids of the same teacher
  Parameters: teacher - String with the id of the teacher to lookup
  return: if something goes wrong - {err:err_msg}, if query goes well - {data: [results]
*/
exports.kidsByTeacher = function(req,res,connection){
  //get request parameters for teacher id, in case of not present, return a err message to client
  if(req.query.teacher){
    let teacherId = req.query.teacher;

    connection.query('SELECT kid.kid_name, kid.kid_age FROM 4kids.maestras INNER JOIN kid ON maestras.maestra_id = kid.maestra_id_fk WHERE maestras.maestra_id=?',[teacherId],function(err,results,fields){
      if(err){
        res.send({"error":err});
      }else{
        res.send({"data":results});
      }
    })
  }else{
    res.send({"error":"Información de maestra no presente"});
  }
}

/*
  Controller to ger all notes of a given children in a given date range
  Parameters: kid - String with the id of the kid to lookup
  return: if something goes wrong - {err:err_msg}, if query goes well - {data: [results]
*/
exports.observacionesByKid = function(req,res,connection){
  if(req.query.kid){

    kidId = req.query.kid;

    //get request parameters and create Javascript Date objects
    let startDate = new Date(req.query.startDate);
    let finishDate = new Date(req.query.finishDate);

    //Format to mysql datetime
    let mysqlStartDate = helpers.toMysqlFormat(startDate);
    let mysqlFinishDate = helpers.toMysqlFormat(finishDate);

    connection.query('SELECT observaciones.observacion_text,observaciones.observacion_date,observaciones.image_file FROM 4kids.observaciones WHERE observaciones.kid_id = ? AND observaciones.observacion_date BETWEEN ? AND ?',[kidId,mysqlStartDate,mysqlFinishDate],function (err,results,fields) {
      if(err){
        res.send({"error":err});
      }else{
        res.send({"data":results});
      }
    })
  }else{
    res.send({"error":"Información del nino no presente"});
  }
}

/*
  Controller to get all the kids with their notes
  return: if something goes wrong - {err:err_msg}, if query goes well - {data: [results]
*/
exports.kidsWithObservaciones = function(req,res,connection){

  connection.query('SELECT * FROM 4kids.observaciones',function (err,results,fields) {
    if(err){
      res.send({"error":err});
    }else{
      res.send({"data": helpers.getKidsWithNotes(results)});
    }
  })
}

exports.updateObservacion = function(req,res,connection){

}
