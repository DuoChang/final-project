const mysql=require("../util/mysqlcon.js");
const changeskill=require("../util/changeskill.js");
const changedatetype=require("../util/changedatetype.js");
const express = require('express');
const expressrouter = express.Router();

const cookieParser = require('cookie-parser');
expressrouter.use(cookieParser());

expressrouter.get('/checktoken/checkuserexpire/api/search/order/customer',(req,res)=>{

	if( req.query.status && req.query.orderid ){

		let queryorderbyid = 'SELECT userid,indexid,code,address,status,orderarea,orderskill,workdate,ordertext,originquote,finalquote,tooldetails,tooldetailsfinal FROM orders WHERE indexid=' + req.query.orderid + ' AND status=\"' + req.query.status + '\"';

		mysql.con.query( queryorderbyid ,(err,result)=>{

			if( err ){

				res.send("{\"error\": \"Invalid token.\"}");

			}else if( result.length ===0 ){

				res.send("{\"message\": \"No result\"}");
			
			}else{

				if( req.userid == result[0].userid ){

					result = changedatetype( result );

					result = changeskill( result );

					let userorders = {};

					userorders.data = result;

					res.cookie('Authorization',req.header('Authorization'));

					res.send(userorders);

				}else{

					res.send("{\"message\": \"No result\"}");

				}

				

			}

		})

	}else if( req.query.status && !req.query.orderid ){

		let queryorderbystatus = 'SELECT indexid,orderarea,orderskill,orderdate,workdate,ordertext FROM orders WHERE userid=' + req.userid + ' AND status=\"' + req.query.status + '\"';

		if ( req.query.status == 'created' || req.query.status == 'quoted' ){

			queryorderbystatus = queryorderbystatus + ' ORDER BY orderdate ASC';

		}else if( req.query.status == 'paid' ){

			queryorderbystatus = queryorderbystatus + ' ORDER BY workdate ASC';

		}else if( req.query.status == 'closed' ){

			queryorderbystatus = queryorderbystatus + ' ORDER BY workdate DESC';

		}

		mysql.con.query(queryorderbystatus,(err,result)=>{

			if( err ){

				res.send("{\"error\": \"Invalid token.\"}");

			}else if( result.length ===0 ){

				res.send("{\"message\": \"No result\"}");
			
			}else{

				result = changedatetype( result );

				result = changeskill( result );

				let totalorderpage = Math.ceil( result.length / 4 );

				let searchcustomerorderresult = [];

				if( req.query.page < totalorderpage ){

					for( let i = ( (req.query.page -1 ) * 4 ) ; i < ( ( req.query.page * 4 ) ) ; i++ ){

						let count = i - ( ( req.query.page -1 ) * 4 ) ;

						searchcustomerorderresult[count] = result[i] ;

					}

				}else if( req.query.page == totalorderpage ){

					for( let i =( (req.query.page -1 ) * 4 ) ; i < result.length ; i++ ){

						let count = i - ( ( req.query.page -1 ) * 4 ) ;

						searchcustomerorderresult[count] = result[i] ;

					}

				}else{

					res.send("{\"message\": \"No result\"}");

				}

				let userorders = {};

				userorders.data = searchcustomerorderresult;

				userorders.page = totalorderpage;

				res.cookie('Authorization',req.header('Authorization'));

				res.send(userorders);

			}

		})	

	}else{

		res.send("{\"incorrect\": \"No result\"}");

	}

})


module.exports = expressrouter;