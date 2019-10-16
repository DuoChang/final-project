const mysql=require("../util/mysqlcon.js");
const express = require('express');
const createpasswordtoken=require("../util/createpasswordtoken.js");
const expressrouter = express.Router();

const bodyParser = require('body-parser');
expressrouter.use(bodyParser.json());
expressrouter.use(bodyParser.urlencoded({extended:true}));

expressrouter.post('/checktype/checktoken/checkuserexpire/api/update/customerprofile',(req,res)=>{

	let updatecustomerquery = 'UPDATE user SET ? WHERE userid=' + req.userid ;

	let updatecustomerdata = {};

	updatecustomerdata.address = req.body.address;

	if( req.body.password != '' ){

		let passwordtoken = createpasswordtoken(req.body.password) ;

		updatecustomerdata.password = passwordtoken;
	
	}

	mysql.con.query( updatecustomerquery , updatecustomerdata ,(err,result)=>{

		if( err ){

			res.send("{\"error\": \"error\"}");

		}else{

			res.send("{\"data\": \"success\"}");

		}

	})

})

module.exports = expressrouter;