const mysql=require("../util/mysqlcon.js");
const express = require('express');
const expressrouter = express.Router();

const bodyParser = require('body-parser');
expressrouter.use(bodyParser.json());
expressrouter.use(bodyParser.urlencoded({extended:true}));


expressrouter.get('/api/userprofile/customer',(req,res)=>{

	if( !req.header('Authorization') || req.header('Authorization') == '' ){
		res.send("{\"error\": \"Invalid request body.\"}");
	}else{
		let tokensplit = req.header('Authorization').split(' ');

		let timenow = Date.now();

		var checkauthorization = "SELECT userid,access_expired FROM user WHERE access_token=\"" + tokensplit[1] + "\"";

		mysql.con.query(checkauthorization,(err,result)=>{

			if(err || result.length===0 || tokensplit[0] !="Bearer"){

				console.log('title錯誤或未搜尋到內容');
			
				res.send("{\"error\": \"Invalid request body.\"}");
			
			}else{

				let userid = result[0].userid ;

				if( timenow > result[0].access_expired ){

					res.send("{\"error\": \"Invalid request body.\"}");
				
				}else{

					let queryuserdeatil='SELECT * FROM user WHERE userid=' + userid;

					mysql.con.query(queryuserdeatil,(err,result)=>{

						if( err ){

							res.send("{\"error\": \"Invalid token.\"}");

						}else{

							let mastertotalres = {};
							mastertotalres.data = result[0];
							res.json(mastertotalres);

						}

					})

				}
			}
		})		
	}

})




module.exports = expressrouter;