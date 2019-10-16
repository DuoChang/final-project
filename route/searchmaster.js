const mysql=require("../util/mysqlcon.js");
const changedatetype=require("../util/changedatetype.js");
const express = require('express');
const expressrouter = express.Router();

const bodyParser = require('body-parser');
expressrouter.use(bodyParser.json());
expressrouter.use(bodyParser.urlencoded({extended:true}));

expressrouter.post('/checktype/checktoken/checkuserexpire/api/search/master',(req,res)=>{

	var selectbyarea = new Promise(function(resolve,reject){

		let querygetmasterbyarea = 'SELECT masterid FROM masterarea WHERE area=\"' + req.body.area + '\"';
		
		mysql.con.query( querygetmasterbyarea ,(err,result)=>{

			if( err ){

				res.send("{\"error\": \"Invalid token.\"}");

			}else if( result.length ===0 ){

				res.send("{\"message\": \"No result\"}");
			
			}else{

				resolve(result);

			}
		
		});

		return selectbyarea;

	})

	var selectbymailstatus = new Promise(function(resolve,reject){

		selectbyarea.then((masterid)=>{

			let masterarray = [] ;

			for( let i = 0 ; i < masterid.length ; i++ ){

				masterarray[i] = masterid[i].masterid ;

			}

			let querygetemailstatus = 'SELECT masterid,email FROM master WHERE masterid IN (' + masterarray.toString() + ')'

			mysql.con.query( querygetemailstatus ,(err,result)=>{

				if( err ){

					res.send("{\"error\": \"Invalid token.\"}");

				}else{

					let emailarray = [];

					let emailarrayforcheck = [] ;

					let masteridarray = [];

					for( let i = 0 ; i < result.length ; i++ ){

						emailarray[i] = '\"' + result[i].email + '\"' ;
						emailarrayforcheck[i] = result[i].email;
						masteridarray[i] = result[i].masterid;

					}

					let querycheckemailstatus = 'SELECT email FROM mailstatus WHERE email IN (' + emailarray.toString() + ') AND status=\"active\"' ;

					mysql.con.query( querycheckemailstatus ,(err,result)=>{

						if( err ){

							res.send("{\"error\": \"Invalid token.\"}");

						}else{

							let masteridbystatus = [];

							var count = 0 ;

							for( let i = 0 ; i < emailarrayforcheck.length ; i++ ){

								for( let j = 0 ; j < result.length ; j++ ){

									if( emailarrayforcheck[i] == result[j].email ){

										masteridbystatus.push( masteridarray[i] );

									}

								}

								count += 1;

								if( count == (emailarrayforcheck.length) ){

									if( masteridbystatus.length == 0 ){

										res.send("{\"message\": \"No result\"}");

									}else{

										resolve(masteridbystatus);

									}

								}

							}
							
						}

					})

				}

			})

			return selectbyarea; 

		})

		return selectbymailstatus;

	})



	var selectbydate = new Promise(function(resolve,reject){

		selectbymailstatus.then((masterid)=>{

			let querymasterdate = 'SELECT masterid FROM masterdate WHERE workdate=\"' + req.body.workdate + '\" AND masterid IN (' + masterid.toString() + ')';

			mysql.con.query( querymasterdate ,(err,result)=>{

				if( err ){

					res.send("{\"error\": \"Invalid token.\"}");

				}else{

					let resultarray = [];

					for( let j = 0 ; j < result.length ; j++ ){

						resultarray[j] = result[j].masterid ;

					}

					let masteridarraybydate = [] ;

					for( let i = 0 ; i < masterid.length ; i++ ){

						if( resultarray.indexOf(masterid[i]) == -1 ){

							masteridarraybydate.push(masterid[i]);						

						}

					}

					resolve(masteridarraybydate);

				}

			})

			return selectbymailstatus;

		})

		return selectbydate;

	})

	var selectbyskill = new Promise(function(resolve,reject){

		selectbydate.then((masteridarraybydate)=>{

			
			if( masteridarraybydate.length == 0 ){

				res.send("{\"message\": \"No result\"}");

			}else{

				let skillsize = req.body.skill.length;
				
				let skillarray = [];

				let checkskillarray = [];

				for( let i = 0 ; i < skillsize ; i += 1){

					skillarray[i] = req.body.skill[i] ;
					checkskillarray[i] = 1;

				}

				let querymasterbyskill = 'SELECT masterid FROM masterskill WHERE (' + skillarray.toString() + ') IN ((' + checkskillarray.toString() + '))';

				mysql.con.query( querymasterbyskill ,(err,result)=>{

					if( err ){

						res.send("{\"error\": \"Invalid token.\"}");

					}else if( result.length ===0 ){

						res.send("{\"message\": \"No result\"}");
					
					}else{

						let masterarray = [] ;

						for( let i = 0 ; i < masteridarraybydate.length ; i++ ){

							for( let j = 0 ; j < result.length ; j++ ){

								if( masteridarraybydate[i] == result[j].masterid ){

									masterarray.push(masteridarraybydate[i]);

								}

							}

							if( i == (masteridarraybydate.length-1)){

								resolve(masterarray);

							}

						}


					}


				})

			}

			return selectbyarea;

		})

		return selectbyskill;

	})

	selectbyskill.then((masterarray)=>{

		var masteraveragerate = new Promise(function(resolve,reject){

			if( masterarray.length == 0 ){

				res.send("{\"message\": \"No result\"}");

			}else{

				let querygetmasterrate = 'SELECT masterid,COUNT(*) AS count,SUM(heartrate)/COUNT(*) AS ave FROM comments WHERE masterid IN(' + masterarray.toString() + ') GROUP BY masterid ORDER BY ave DESC';

				mysql.con.query( querygetmasterrate ,(err,result)=>{

					if( err ){

						res.send("{\"error\": \"Invalid token.\"}");

					}else if( result.length == 0 ){

						let masterrate = [];

						for( let l = 0 ; l < masterarray.length ; l++ ){								

							let nocommentobj = {};
							nocommentobj.masterid = masterarray[l];
							nocommentobj.rate = 'no';
							nocommentobj.count = 0 ;
							nocommentobj.comments = 'no';
							masterrate.push(nocommentobj);

						}
						
						let searchmasterresult = {};

						searchmasterresult.result = masterrate;	

						return res.send(searchmasterresult);

					}else{

						resolve(result);

					}

				})

			}				

			return masteraveragerate;

		})

		masteraveragerate.then((countrate)=>{

			let querygetcomments = 'SELECT * FROM comments WHERE masterid IN(' + masterarray.toString() + ')';

			mysql.con.query( querygetcomments ,(err,result)=>{

				if( err ){

					res.send("{\"error\": \"Invalid token.\"}");

				}else{

					result = changedatetype(result);

					let masterrate = [];

					for( let i = 0 ; i < countrate.length ; i++ ){

						let mastercomments= [];

						for( let j = 0 ; j < result.length ; j++ ){

							if( countrate[i].masterid == result[j].masterid ){

								mastercomments.push(result[j]);

							}

						}

						let masterdata = {};

						masterdata.masterid = countrate[i].masterid;
						
						let averagerate = countrate[i].ave ;

						averagerate = averagerate.toFixed(1);

						masterdata.rate = averagerate;

						masterdata.count = countrate[i].count;

						masterdata.comments = mastercomments;

						masterrate.push(masterdata);

					}

					let checkcommentidarray = [];

					for( let a = 0 ; a < countrate.length ; a++ ){

						checkcommentidarray[a] = countrate[a].masterid;

					}

					for( let l = 0 ; l < masterarray.length ; l++ ){

						if(checkcommentidarray.indexOf(masterarray[l]) == -1){

							let nocommentobj = {};
							nocommentobj.masterid = masterarray[l];
							nocommentobj.rate = 'no';
							nocommentobj.count = 0 ;
							nocommentobj.comments = 'no';
							masterrate.push(nocommentobj);

						}

					}			

					let searchmasterresult = {};

					searchmasterresult.result = masterrate;

					res.send(searchmasterresult);

				}

			})

		})

	})

})


module.exports = expressrouter;