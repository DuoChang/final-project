const mysql=require("../util/mysqlcon.js");
const express = require('express');
const createpasswordtoken=require("../util/createpasswordtoken.js");
const expressrouter = express.Router();

const bodyParser = require('body-parser');
expressrouter.use(bodyParser.json());
expressrouter.use(bodyParser.urlencoded({extended:true}));

expressrouter.post('/checktype/checktoken/checkmasterexpire/api/update/masterprofile',(req,res)=>{

	if( req.body.update == 'basic'){

		let updatemasterbasicquery = 'UPDATE master SET ? WHERE masterid=' + req.body.masterid ;

		let masterbasicdata = {};

		masterbasicdata.phone = req.body.phone;

		if( req.body.password != '' ){

			let passwordtoken = createpasswordtoken(req.body.password) ;

			masterbasicdata.password = passwordtoken;
		
		}

		mysql.con.query( updatemasterbasicquery , masterbasicdata ,(err,result)=>{

			if( err ){

				res.send("{\"error\": \"error\"}");

			}else{

				res.send("{\"data\": \"success\"}");

			}

		})

	}else if( req.body.update == 'skill' ){

		let deletemasterskill = ' DELETE FROM masterskill WHERE masterid=' + req.body.masterid ;

		mysql.con.query( deletemasterskill , (err,result)=>{

			if( err ){

				res.send("{\"error\": \"error\"}");

			}else{

				/*--存 technician skill 資料--*/

				let insertmasterskill = {
				
					masterid : req.body.masterid
				
				}

				let skillsize = req.body.skill.length;

				let skillarray = [];

				for( let i = 0 ; i < skillsize ; i += 1){

					insertmasterskill[req.body.skill[i]] = 1 ;

				}

				mysql.con.query( 'INSERT INTO masterskill SET ?', insertmasterskill ,(err,result)=>{

					if( err ){

						res.send("{\"error\": \"error\"}");

					}else{

						res.send("{\"data\": \"success\"}");
					}

				})

			}

		})

	}else if( req.body.update == 'area' ){

		let deletemasterarea = 'DELETE FROM masterarea WHERE masterid=' + req.body.masterid ;

		mysql.con.query( deletemasterarea , (err,result)=>{

			if( err ){

				res.send("{\"error\": \"error\"}");

			}else{

				let areasize = req.body.area.length;

				areaarray = [];

				for( let i = 0 ; i < areasize ; i += 1){

					areaarray[i] = '(' + req.body.masterid + ',\"' + req.body.area[i] + '\")' ;

				}

				let insertnewmasterskill = 'INSERT INTO masterarea(masterid,area) VALUES ' + areaarray.toString();

				mysql.con.query( insertnewmasterskill , (err,result)=>{

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


})

module.exports = expressrouter;