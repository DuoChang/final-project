const mysql=require("../util/mysqlcon.js");
const changeskill=require("../util/changeskill.js");
const changedatetype=require("../util/changedatetype.js");
const express = require('express');
const expressrouter = express.Router();

const cookieParser = require('cookie-parser');
expressrouter.use(cookieParser());

expressrouter.get('/checktoken/checkmasterexpire/api/search/order/master',(req,res)=>{

	if( req.query.status && req.query.orderid ){

		let queryorderbyid = 'SELECT masterid,indexid,code,address,status,orderarea,orderskill,workdate,ordertext,originquote,tooldetails FROM orders WHERE indexid=' + req.query.orderid + ' AND status=\"' + req.query.status +'\"';
	
		mysql.con.query( queryorderbyid ,(err,result)=>{

			if( err ){

				res.send("{\"error\": \"Invalid token.\"}");

			}else if( result.length ===0 ){

				res.send("{\"message\": \"No result\"}");
			
			}else{

				if( req.masterid == result[0].masterid ){

					result = changeskill(result);

					result = changedatetype(result);

					console.log(result);

					let masterorders = {};

					masterorders.data = result;

					res.cookie('Authorization',req.header('Authorization'));

					res.send(masterorders);

				}else{

					res.send("{\"message\": \"No result\"}");

				}

			}

		})

	}else if( req.query.status && !req.query.orderid ){

		console.log('7788');

		let queryorderbystatus = 'SELECT indexid,orderarea,orderskill,orderdate,workdate,ordertext FROM orders WHERE masterid=' + req.masterid + ' AND status=\"' + req.query.status + '\"';

		if ( req.query.status == 'created' || req.query.status == 'quoted' ){

			queryorderbystatus = queryorderbystatus + ' ORDER BY orderdate ASC';

		}else if( req.query.status == 'paid' ){

			queryorderbystatus = queryorderbystatus + ' ORDER BY workdate ASC';

		}else if( req.query.status == 'closed' ){

			queryorderbystatus = queryorderbystatus + ' ORDER BY workdate DESC';

		}

		console.log('34',queryorderbystatus);

		mysql.con.query(queryorderbystatus,(err,result)=>{

			if( err ){

				res.send("{\"error\": \"Invalid token.\"}");

			}else if( result.length ===0 ){

				res.send("{\"message\": \"No result\"}");
			
			}else{

				result = changeskill(result);

				result = changedatetype(result);

				let totalpage = Math.ceil( result.length / 4 );

				console.log(totalpage);

				let searchmasterorderresult = [];

				if( req.query.page < totalpage ){

					console.log('AWA789');

					for( let i = ( (req.query.page -1 ) * 4 ) ; i < ( ( req.query.page * 4 ) ) ; i++ ){

						console.log(i);

						let count = i - ( ( req.query.page -1 ) * 4 ) ;

						console.log(count);

						searchmasterorderresult[count] = result[i] ;

					}

				}else if( req.query.page == totalpage ){

					console.log('C3C4',result.length);

					for( let i =( (req.query.page -1 ) * 4 ) ; i < result.length ; i++ ){

						let count = i - ( ( req.query.page -1 ) * 4 ) ;

						searchmasterorderresult[count] = result[i] ;

						console.log('C89',count,i);

					}

				}else{

					res.send("{\"message\": \"No result\"}");

				}

				let masterorders = {};

				masterorders.data = searchmasterorderresult;

				masterorders.page = totalpage;

				res.cookie('Authorization',req.header('Authorization'));

				res.send(masterorders);

			}

		})	

	}else{

		res.send("{\"incorrect\": \"No result\"}");

	}


})


module.exports = expressrouter;