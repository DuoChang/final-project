const moment = require('moment');

module.exports.changedatetype = function (result){

	for(let q = 0 ; q < result.length ; q += 1 ){

		result[q].commentdate = moment(result[q].commentdate).format("YYYY-MM-DD");

	}

	return result;
	
};
