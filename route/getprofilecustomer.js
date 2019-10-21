const mysql=require("../util/mysqlcon.js");
const express = require('express');
const express_router = express.Router();

express_router.get('/checktoken/checkuserexpire/api/userprofile/customer',(req,res)=>{

	let query_user_detail='SELECT * FROM user WHERE userid=' + req.userid ;

	mysql.con.query( query_user_detail ,(err,result)=>{

		if( err ){

			res.send("{\"error\": \"Invalid token.\"}");

		}else{

			let user_total_res = {};
			user_total_res.data = result[0];
			res.json(user_total_res);

		}

	})

})

module.exports = express_router;