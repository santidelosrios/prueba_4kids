//Some helpers to format Javascript objects into mysql datetime
function twoDigits (d) {
    if(0 <= d && d < 10) return "0" + d.toString();
    if(-10 < d && d < 0) return "-0" + (-1*d).toString();
    return d.toString();
}

exports.toMysqlFormat = function(date) {
    return date.getUTCFullYear() + "-" + twoDigits(1 + date.getUTCMonth()) + "-" + twoDigits(date.getUTCDate()) + " " + twoDigits(date.getUTCHours()) + ":" + twoDigits(date.getUTCMinutes()) + ":" + twoDigits(date.getUTCSeconds());
};

//Helper to get the first date of the current week and the last one. Returns an array with both dates
exports.getCurrentWeekDates = function(){
  let current = new Date();
  let first = current.getDate() - current.getDay(); // First day is the day of the month - the day of the week
  let last = first + 6; //last day is the first day + 6

  let firstDay = new Date(current.setDate(first));
  let lastDay = new Date(current.setDate(last));

  return [firstDay,lastDay];
}

//Helpers to return a JSON with a list of all the kids_ids and its notes
exports.getKidsWithNotes = function(results){

  indexOfKid = 0;
  currentKid =  results[0].kid_id;
  let list = [];
  list.push({kid_id: results[0].kid_id,observaciones: []});
  list[0].observaciones.push({observacion_id: results[0].observacion_id,observacion_text: results[0].observacion_text,observacion_date:results[0].observacion_date,image_file:results[0].image_file});

  for(let i=1; i<results.length;i++){
    let search = searchKidIdInList(list,results[i].kid_id);
    if(search[0]){
      list[search[1]].observaciones.push({observacion_id: results[i].observacion_id,observacion_text: results[i].observacion_text,observacion_date:results[i].observacion_date,image_file:results[i].image_file});
    }else{
      list.push({kid_id: results[i].kid_id,observaciones: []});
      indexOfKid++;
      list[indexOfKid].observaciones.push({observacion_id: results[i].observacion_id,observacion_text: results[i].observacion_text,observacion_date:results[i].observacion_date,image_file:results[i].image_file});

    }
  }

  return list;
}

function searchKidIdInList (list,kidId){
  let listToReturn = [false,0];
  list.forEach((v,i)=>{
    if(v.kid_id == kidId){
      listToReturn[0] = true;
      listToReturn[1] = i;
    }
  });
  return listToReturn;
}
