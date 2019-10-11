const mysql=require("../util/mysqlcon.js");
const express = require('express');
const expressrouter = express.Router();

expressrouter.get('/checktoken/checkuserexpire/api/userprofile/customer',(req,res)=>{


	let queryuserdetail='SELECT * FROM user WHERE userid=' + req.userid ;

	mysql.con.query( queryuserdetail ,(err,result)=>{

		if( err ){

			res.send("{\"error\": \"Invalid token.\"}");

		}else{

			let usertotalres = {};
			usertotalres.data = result[0];
			res.json(usertotalres);

		}

	})


})




module.exports = expressrouter;