const mysql=require("../util/mysqlcon.js");
const express = require('express');
const expressrouter = express.Router();

const bodyParser = require('body-parser');
expressrouter.use(bodyParser.json());
expressrouter.use(bodyParser.urlencoded({extended:true}));

expressrouter.post('/api/update/masterprofile',(req,res)=>{

	if( !req.header('Authorization') || req.header('Authorization') == ''){
		console.log('898');
		res.send("{\"error\": \"Invalid request body.\"}");
	}else{

		let tokensplit = req.header('Authorization').split(' ');

		let timenow = Date.now();

		let checkauthorization = "SELECT access_expired FROM master WHERE access_token=\"" + tokensplit[1] + "\"";

		mysql.con.query( checkauthorization ,(err,result)=>{

			if(err || result.length===0 || tokensplit[0] !="Bearer"){

				console.log('title錯誤或未搜尋到內容');
			
				res.send("{\"error\": \"Invalid request body.\"}");
			
			}else{

				if( timenow > result[0].access_expired ){

					res.send("{\"error\": \"Invalid request body.\"}");
				
				}else{

					if( req.body.update == 'basic'){

						let updatetechnicianbasicquery = 'UPDATE master SET ? WHERE masterid=' + req.body.masterid ;

						let technicianbasicdata = {};

						technicianbasicdata.phone = req.body.phone;

						if( req.body.password != '' ){

							technicianbasicdata.password = req.body.password;
						
						}

						mysql.con.query( updatetechnicianbasicquery , technicianbasicdata ,(err,result)=>{

							if( err ){

								res.send("{\"error\": \"error\"}");

							}else{

								res.send("{\"data\": \"success\"}");

							}

						})

					}else if( req.body.update == 'skill' ){

						console.log('2');

						let deletetechnicianskill = ' DELETE FROM masterskill WHERE masterid=' + req.body.masterid ;

						mysql.con.query( deletetechnicianskill , (err,result)=>{

							if( err ){

								res.send("{\"error\": \"error\"}");

							}else{

								/*--存 technician skill 資料--*/

								let inserttechnicianskill = {
								
									masterid : req.body.masterid
								
								}

								let skillsize = req.body.skill.length;

								console.log(req.body.skill);

								let skillarray = [];

								for( let i = 0 ; i < skillsize ; i += 1){

									inserttechnicianskill[req.body.skill[i]] = 1 ;

								}

								console.log(inserttechnicianskill);

								mysql.con.query( 'INSERT INTO masterskill SET ?', inserttechnicianskill ,(err,result)=>{

									console.log('12.5',result);

									if( err ){

										res.send("{\"error\": \"error\"}");

									}else{

										res.send("{\"data\": \"success\"}");
									}

								})

							}

						})

					}else if( req.body.update == 'area' ){

						let deletetechnicianarea = 'DELETE FROM masterarea WHERE masterid=' + req.body.masterid ;

						mysql.con.query( deletetechnicianarea , (err,result)=>{

							if( err ){

								res.send("{\"error\": \"error\"}");

							}else{

								let areasize = req.body.area.length;

								areaarray = [];

								for( let i = 0 ; i < areasize ; i += 1){

									areaarray[i] = '(' + req.body.masterid + ',\"' + req.body.area[i] + '\")' ;

								}

								let insertnewtechnicianskill = 'INSERT INTO masterarea(masterid,area) VALUES ' + areaarray.toString();

								mysql.con.query( insertnewtechnicianskill , (err,result)=>{

									if( err ){

										res.send("{\"error\": \"error\"}");

									}else{

										res.send("{\"data\": \"success\"}");

									}

								})

							}

						})


					}else{

						res.send("{\"error\": \"Invalid request body.\"}");

					}

				}

			}

		})

	}

		


})

module.exports = expressrouter;