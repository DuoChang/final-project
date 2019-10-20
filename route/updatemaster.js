const mysql=require("../util/mysqlcon.js");
const express = require('express');
const create_password_token=require("../util/createpasswordtoken.js");
const express_router = express.Router();

const body_parser = require('body-parser');
express_router.use(body_parser.json());
express_router.use(body_parser.urlencoded({extended:true}));

express_router.post('/checktype/checktoken/checkmasterexpire/api/update/masterprofile',(req,res)=>{

	if( req.body.update == 'basic'){

		let update_master_basic_query = 'UPDATE master SET ? WHERE masterid=' + req.body.masterid ;

		let master_basic_data = {};

		master_basic_data.phone = req.body.phone;

		if( req.body.password != '' ){

			let password_token = create_password_token( req.body.password) ;

			master_basic_data.password = password_token;
		
		}

		mysql.con.query( update_master_basic_query , master_basic_data ,(err,result)=>{

			if( err ){

				res.send("{\"error\": \"error\"}");

			}else{

				res.send("{\"data\": \"success\"}");

			}

		})

	}else if( req.body.update == 'skill' ){

		let delete_master_skill = ' DELETE FROM masterskill WHERE masterid=' + req.body.masterid ;

		mysql.con.query( delete_master_skill , (err,result)=>{

			if( err ){

				res.send("{\"error\": \"error\"}");

			}else{

				/*--存 technician skill 資料--*/

				let insert_master_skill = {
				
					masterid : req.body.masterid
				
				}

				let skill_size = req.body.skill.length;

				let skill_array = [];

				for( let i = 0 ; i < skill_size ; i += 1){

					insert_master_skill[req.body.skill[i]] = 1 ;

				}

				mysql.con.query( 'INSERT INTO masterskill SET ?', insert_master_skill ,(err,result)=>{

					if( err ){

						res.send("{\"error\": \"error\"}");

					}else{

						res.send("{\"data\": \"success\"}");
					}

				})

			}

		})

	}else if( req.body.update == 'area' ){

		let delete_master_area = 'DELETE FROM masterarea WHERE masterid=' + req.body.masterid ;

		mysql.con.query( delete_master_area , (err,result)=>{

			if( err ){

				res.send("{\"error\": \"error\"}");

			}else{

				let area_size = req.body.area.length;

				area_array = [];

				for( let i = 0 ; i < area_size ; i += 1){

					area_array[i] = '(' + req.body.masterid + ',\"' + req.body.area[i] + '\")' ;

				}

				let insert_new_master_skill = 'INSERT INTO masterarea(masterid,area) VALUES ' + area_array.toString();

				mysql.con.query( insert_new_master_skill , (err,result)=>{

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

module.exports = express_router;