const mysql=require("../util/mysqlcon.js");
const express = require('express');
const express_router = express.Router();

const body_parser = require('body-parser');
express_router.use(body_parser.json());
express_router.use(body_parser.urlencoded({extended:true}));

express_router.post('/checktype/checktoken/checkuserexpire/api/order/saveaddress',(req,res)=>{

	let save_order_address_query = 'UPDATE orders SET address=\"' + req.body.address + '\" WHERE indexid=' + req.body.ordernumber;

	mysql.con.query( save_order_address_query ,(err,result)=>{

		if( err ){

			res.send("{\"error\": \"Invalid token.\"}");

		}else{

			res.send("{\"data\": \"Update success\"}");

		}

	})

})

module.exports = express_router;