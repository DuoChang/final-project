const moment = require('moment');

module.exports = function (result){

	for(let q = 0 ; q < result.length ; q += 1 ){

		if( result[q].commentdate ){

			result[q].commentdate = moment(result[q].commentdate).format("YYYY-MM-DD");

		}
		if( result[q].workdate ){

			result[q].workdate = moment(result[q].workdate).format("YYYY-MM-DD");

		}
		if( result[q].orderdate ){

			result[q].orderdate = moment(result[q].orderdate).format("YYYY-MM-DD");
			
		}

	}

	return result;
	
};
