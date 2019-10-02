const mysql=require("../util/mysqlcon.js");
const datetype=require("../util/changedatetype.js");
const express = require('express');
const expressrouter = express.Router();
const crypto = require('crypto');

const bodyParser = require('body-parser');
expressrouter.use(bodyParser.json());
expressrouter.use(bodyParser.urlencoded({extended:true}));

expressrouter.post('/api/search/master',(req,res)=>{

	if( !req.header('Authorization') || req.header('Authorization') == ''){
		res.send("{\"error\": \"Invalid request body.\"}");
	}else{

		console.log(req.body);

		let tokensplit = req.header('Authorization').split(' ');

		let timenow = Date.now();

		let checkauthorization = "SELECT userid,access_expired FROM user WHERE access_token=\"" + tokensplit[1] + "\"";

		mysql.con.query(checkauthorization,(err,result)=>{

			if(err || result.length===0 || tokensplit[0] !="Bearer"){

				console.log('title錯誤或未搜尋到內容');
			
				res.send("{\"error\": \"Invalid request body.\"}");
			
			}else{

				var selectbyarea = new Promise(function(resolve,reject){

					let areaquerymaster = 'SELECT masterid FROM masterarea WHERE area=\"' + req.body.area + '\"';
					
					mysql.con.query( areaquerymaster ,(err,result)=>{

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

						let getstatus = 'SELECT masterid,email FROM master WHERE masterid IN (' + masterarray.toString() + ')'

						mysql.con.query( getstatus ,(err,result)=>{

							if( err ){

								res.send("{\"error\": \"Invalid token.\"}");

							}else{

								var mailarray = [];

								var mailarrayforcheck = [] ;

								var masteridarray = [];

								for( let i = 0 ; i < result.length ; i++ ){

									mailarray[i] = '\"' + result[i].email + '\"' ;
									mailarrayforcheck[i] = result[i].email;
									masteridarray[i] = result[i].masterid;

								}

								let checkemailstatus = 'SELECT email,status FROM mailstatus WHERE email IN (' + mailarray.toString() + ')';

								console.log('F123456',checkemailstatus);

								mysql.con.query( checkemailstatus ,(err,result)=>{

									if( err ){

										console.log('R33',err);

										res.send("{\"error\": \"Invalid token.\"}");

									}else{

										console.log('R3D3',result);

										var masteridbystatus = [];

										var count = 0 ;

										for( let i = 0 ; i < mailarrayforcheck.length ; i++ ){

											for( let j = 0 ; j < result.length ; j++ ){

												console.log(mailarrayforcheck[i],result[j].email,result[j].status);

												if( mailarrayforcheck[i] == result[j].email && result[j].status == 'active' ){

													masteridbystatus.push( masteridarray[i] );

												}

											}

											count += 1;

											console.log(count);

											if( count == (mailarrayforcheck.length) ){

												console.log('R2D2',masteridbystatus);

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

						console.log('check status',masterid);

						let datequerymaster = 'SELECT masterid FROM masterdate WHERE workdate=\"' + req.body.workdate + '\" AND masterid IN (' + masterid.toString() + ')';

						console.log('D999',datequerymaster);

						mysql.con.query( datequerymaster ,(err,result)=>{

							if( err ){

								res.send("{\"error\": \"Invalid token.\"}");

							}else{

								let resultarray = [];

								for( let j = 0 ; j < result.length ; j++ ){

									resultarray[j] = result[j].masterid ;

								}

								var masteridarraybydate = [] ;

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

							console.log(req.body.skill);

							let skillarray = [];
							let checkskillarray = [];

							for( let i = 0 ; i < skillsize ; i += 1){

								skillarray[i] = req.body.skill[i] ;
								checkskillarray[i] = 1;

							}

							let querymasterbyskill = 'SELECT masterid FROM masterskill WHERE (' + skillarray.toString() + ') IN ((' + checkskillarray.toString() + '))';

							console.log(querymasterbyskill);

							mysql.con.query(querymasterbyskill,(err,result)=>{

								if( err ){

									res.send("{\"error\": \"Invalid token.\"}");

								}else if( result.length ===0 ){

									res.send("{\"message\": \"No result\"}");
								
								}else{

									var masterarray = [] ;

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

							let getmasterrate = 'SELECT masterid,COUNT(*) AS count,SUM(heartrate)/COUNT(*) AS ave FROM comments WHERE masterid IN(' + masterarray.toString() + ') GROUP BY masterid ORDER BY ave DESC';

							mysql.con.query( getmasterrate ,(err,result)=>{

								if( err ){

									console.log('388');

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

									console.log('A8A9');

									return res.send(searchmasterresult);

								}else{

									resolve(result);

								}

							})

						}				

						return masteraveragerate;

					})

					masteraveragerate.then((countrate)=>{

						let getcomments = 'SELECT * FROM comments WHERE masterid IN(' + masterarray.toString() + ')';

						console.log('B89');

						mysql.con.query(getcomments,(err,result)=>{

							if( err ){

								console.log('BBB');

								res.send("{\"error\": \"Invalid token.\"}");

							}else{

								console.log('C387');

								result = datetype.changedatetype(result);

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

			}

		})
	}

})


module.exports = expressrouter;