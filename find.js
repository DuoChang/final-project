const express = require('express');
const app = express();
const mysql=require("./util/mysqlcon.js");

app.use(express.static( __dirname + '/pages' ));
app.use(express.static( __dirname + '/uploads' ));

app.use("*/checktype/*", function(req, res, next){

	if( req.header( 'Content-Type') != "application/json" ){

		res.send("{\"error\": \"Invalid request body.\"}");	

	}else{

		next();

	}

});

app.use("*/checktoken/*", function(req, res, next){
	
	if( !req.header('Authorization') || req.header('Authorization') == ''){

		res.send("{\"error\": \"Invalid request body.\"}");
	
	}else{

		let token_split = req.header('Authorization').split(' ');

		if( token_split[0] !="Bearer" ){

			res.send("{\"error\": \"Invalid request body.\"}");

		}else{

			next();

		}

	}

});

app.use("*/checkuserexpire/*", function(req, res, next){

	let time_now = Date.now();

	let token_split = req.header('Authorization').split(' ');

	let check_authorization = "SELECT name,userid,access_expired FROM user WHERE access_token=\"" + token_split[1] + "\"";

	mysql.con.query(check_authorization,(err,result)=>{

		if( err || result.length===0 ){
		
			res.send("{\"error\": \"Invalid request body.\"}");
		
		}else{

			if( time_now > result[0].access_expired ){

				res.send("{\"error\": \"Invalid request body.\"}");
			
			}else{

				req.username = result[0].name;
				req.userid = result[0].userid ;

				next();

			}

		}

	})

});

app.use("*/checkmasterexpire/*", function(req, res, next){

	let time_now = Date.now();

	let token_split = req.header('Authorization').split(' ');

	let check_authorization = "SELECT masterid,access_expired FROM master WHERE access_token=\"" + token_split[1] + "\"";

	mysql.con.query(check_authorization,(err,result)=>{

		if( err || result.length===0 ){
		
			res.send("{\"error\": \"Invalid request body.\"}");
		
		}else{

			if( time_now > result[0].access_expired ){

				res.send("{\"error\": \"Invalid request body.\"}");
			
			}else{

				req.masterid = result[0].masterid ;

				next();

			}

		}

	})

});


const router_signin = require('./route/signin.js');
const router_signup = require('./route/signup.js');
const router_mail_verify = require('./route/mailverify.js');
const router_get_profile_master = require('./route/getprofilemaster.js');
const router_update_master = require('./route/updatemaster.js');
const router_search_master = require('./route/searchmaster.js');
const router_create_order = require('./route/createorder.js');
const router_search_master_order = require('./route/searchmasterorder.js');
const router_master_quote = require('./route/masterquote.js');
const router_master_close = require('./route/masterclose.js');
const router_search_customer_order = require('./route/searchcustomerorder.js');
const router_quote_reject = require('./route/quotereject.js');
const router_quote_accept = require('./route/quoteaccept.js');
const router_get_profile_customer = require('./route/getprofilecustomer.js');
const router_update_customer = require('./route/updatecustomer.js');
const router_save_address = require('./route/saveaddress.js');
const router_get_comment = require('./route/getcomment.js');
const router_save_comment = require('./route/savecomment.js');

app.use(router_signin);
app.use(router_signup);
app.use(router_mail_verify);
app.use(router_get_profile_master);
app.use(router_update_master);
app.use(router_search_master);
app.use(router_create_order);
app.use(router_search_master_order);
app.use(router_master_quote);
app.use(router_master_close);
app.use(router_search_customer_order);
app.use(router_quote_reject);
app.use(router_quote_accept);
app.use(router_get_profile_customer);
app.use(router_update_customer);
app.use(router_save_address);
app.use(router_get_comment);
app.use(router_save_comment);


app.listen(3000);