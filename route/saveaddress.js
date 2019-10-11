const mysql=require("../util/mysqlcon.js");
const express = require('express');
const expressrouter = express.Router();

const bodyParser = require('body-parser');
expressrouter.use(bodyParser.json());
expressrouter.use(bodyParser.urlencoded({extended:true}));

expressrouter.post('/checktype/checktoken/checkuserexpire/api/order/saveaddress',(req,res)=>{

	console.log(req.header('Authorization'));

	console.log(req.body);

	let saveorderaddressquery = 'UPDATE orders SET address=\"' + req.body.address + '\" WHERE indexid=' + req.body.ordernumber;

	mysql.con.query( saveorderaddressquery ,(err,result)=>{

		if( err ){

			res.send("{\"error\": \"Invalid token.\"}");

		}else{

			res.send("{\"data\": \"Update success\"}");

		}

	})

})

module.exports = expressrouter;