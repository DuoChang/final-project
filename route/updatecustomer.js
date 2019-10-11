const mysql=require("../util/mysqlcon.js");
const express = require('express');
const expressrouter = express.Router();

const bodyParser = require('body-parser');
expressrouter.use(bodyParser.json());
expressrouter.use(bodyParser.urlencoded({extended:true}));

expressrouter.post('/checktype/checktoken/checkuserexpire/api/update/customerprofile',(req,res)=>{

	let updatecustomerquery = 'UPDATE user SET ? WHERE userid=' + result[0].userid ;

	let updatecustomerdata = {};

	updatecustomerdata.address = req.body.address;

	if( req.body.password != '' ){

		updatecustomerdata.password = req.body.password;
	
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