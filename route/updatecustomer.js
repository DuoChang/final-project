const mysql=require("../util/mysqlcon.js");
const express = require('express');
const expressrouter = express.Router();

const bodyParser = require('body-parser');
expressrouter.use(bodyParser.json());
expressrouter.use(bodyParser.urlencoded({extended:true}));

expressrouter.post('/api/update/customerprofile',(req,res)=>{

	if( !req.header('Authorization') || req.header('Authorization') == ''){
		console.log('898');
		res.send("{\"error\": \"Invalid request body.\"}");
	}else{

		let tokensplit = req.header('Authorization').split(' ');

		let timenow = Date.now();

		let checkauthorization = "SELECT userid,access_expired FROM user WHERE access_token=\"" + tokensplit[1] + "\"";

		mysql.con.query(checkauthorization,(err,result)=>{

			if(err || result.length===0 || tokensplit[0] !="Bearer"){

				console.log('title錯誤或未搜尋到內容');
			
				res.send("{\"error\": \"Invalid request body.\"}");
			
			}else{

				var userid = result[0].userid ;

				if( timenow > result[0].access_expired ){

					res.send("{\"error\": \"Invalid request body.\"}");
				
				}else{

					let updatecustomerquery = 'UPDATE user SET ? WHERE userid=' + userid ;

					let updatedata = {};

					updatedata.address = req.body.address;

					if( req.body.password != '' ){

						updatedata.password = req.body.password;
					
					}

					mysql.con.query( updatecustomerquery , updatedata ,(err,result)=>{

						if( err ){

							res.send("{\"error\": \"error\"}");

						}else{

							res.send("{\"data\": \"success\"}");

						}

					})


				}
			}
		})

	}

})

module.exports = expressrouter;