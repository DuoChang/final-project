const express = require('express');
const app = express();
const mysql=require("./util/mysqlcon.js");

app.use(express.static( __dirname + '/pages' ));
app.use(express.static( __dirname + '/uploads' ));

app.use("*/checktype/*", function(req, res, next){

	console.log('check Content-Type');

	if( req.header('Content-Type') != "application/json" ){

		res.send("{\"error\": \"Invalid request body.\"}");	

	}else{

		next();

	}

});

app.use("*/checktoken/*", function(req, res, next){

	console.log('enter check Authorization');
	
	if( !req.header('Authorization') || req.header('Authorization') == ''){

		res.send("{\"error\": \"Invalid request body.\"}");
	
	}else{

		let tokensplit = req.header('Authorization').split(' ');

		if( tokensplit[0] !="Bearer" ){

			res.send("{\"error\": \"Invalid request body.\"}");

		}else{

			next();

		}

	}

});

app.use("*/checkuserexpire/*", function(req, res, next){

	console.log('enter check user expired');

	let timenow = Date.now();

	let tokensplit = req.header('Authorization').split(' ');

	let checkauthorization = "SELECT userid,access_expired FROM user WHERE access_token=\"" + tokensplit[1] + "\"";

	mysql.con.query(checkauthorization,(err,result)=>{

		if( err || result.length===0 ){

			console.log('title錯誤或未搜尋到內容');
		
			res.send("{\"error\": \"Invalid request body.\"}");
		
		}else{

			if( timenow > result[0].access_expired ){

				res.send("{\"error\": \"Invalid request body.\"}");
			
			}else{

				req.userid = result[0].userid ;

				next();

			}

		}

	})

});

app.use("*/checkmasterexpire/*", function(req, res, next){

	console.log('enter check master expired');

	let timenow = Date.now();

	let tokensplit = req.header('Authorization').split(' ');

	let checkauthorization = "SELECT masterid,access_expired FROM master WHERE access_token=\"" + tokensplit[1] + "\"";

	mysql.con.query(checkauthorization,(err,result)=>{

		if( err || result.length===0 ){

			console.log('title錯誤或未搜尋到內容');
		
			res.send("{\"error\": \"Invalid request body.\"}");
		
		}else{

			if( timenow > result[0].access_expired ){

				res.send("{\"error\": \"Invalid request body.\"}");
			
			}else{

				req.masterid = result[0].masterid ;

				next();

			}

		}

	})

});


const routersignin = require('./route/signin.js');
const routersignup = require('./route/signup.js');
const routermailverify = require('./route/mailverify.js');
const routergetprofilemaster = require('./route/getprofilemaster.js');
const routerupdatemaster = require('./route/updatemaster.js');
const routersearchmaster = require('./route/searchmaster.js');
const routercreateorder = require('./route/createorder.js');
const routersearchmasterorder = require('./route/searchmasterorder.js');
const routermasterquote = require('./route/masterquote.js');
const routermasterclose = require('./route/masterclose.js');
const routersearchcustomerorder = require('./route/searchcustomerorder.js');
const routerquotereject = require('./route/quotereject.js');
const routerquoteaccept = require('./route/quoteaccept.js');
const routergetprofilecustomer = require('./route/getprofilecustomer.js');
const routerupdatecustomer = require('./route/updatecustomer.js');
const routersaveaddress = require('./route/saveaddress.js');
const routergetcomment = require('./route/getcomment.js');
const routersavecomment = require('./route/savecomment.js');

app.use(routersignin);
app.use(routersignup);
app.use(routermailverify);
app.use(routergetprofilemaster);
app.use(routerupdatemaster);
app.use(routersearchmaster);
app.use(routercreateorder);
app.use(routersearchmasterorder);
app.use(routermasterquote);
app.use(routermasterclose);
app.use(routersearchcustomerorder);
app.use(routerquotereject);
app.use(routerquoteaccept);
app.use(routergetprofilecustomer);
app.use(routerupdatecustomer);
app.use(routersaveaddress);
app.use(routergetcomment);
app.use(routersavecomment);


app.listen(3000);