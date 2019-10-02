module.exports.today = function (){

	let today = new Date();

	let thisyear = '' + today.getFullYear();

	let thismonth = today.getMonth() + 1;

	if( thismonth < 10 ){

		thismonth = '0' + thismonth;
	
	}

	let thisday = '' + today.getDate();

	if( thisday < 10 ){

		thisday = '0' + thisday;
	
	}

	let orderday = thisyear + '-' + thismonth + '-' + thisday ;

	return orderday;
	
};
