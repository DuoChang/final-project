const mysql=require("../util/mysqlcon.js");
const express = require('express');
const create_password_token=require("../util/createpasswordtoken.js");
const express_router = express.Router();

const body_parser = require('body-parser');
express_router.use(body_parser.json());
express_router.use(body_parser.urlencoded({extended:true}));

express_router.post('/checktype/checktoken/checkuserexpire/api/update/customerprofile',(req,res)=>{

	let update_customer_query = 'UPDATE user SET ? WHERE userid=' + req.userid ;

	let update_customer_data = {};

	update_customer_data.address = req.body.address;

	if( req.body.password != '' ){

		let password_token = create_password_token(req.body.password) ;

		update_customer_data.password = password_token;
	
	}

	mysql.con.query( update_customer_query , update_customer_data ,(err,result)=>{

		if( err ){

			res.send("{\"error\": \"error\"}");

		}else{

			res.send("{\"data\": \"success\"}");

		}

	})

})

module.exports = express_router;