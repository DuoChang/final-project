const mysql=require("../util/mysqlcon.js");
const change_skill=require("../util/changeskill.js");
const change_date_type=require("../util/changedatetype.js");
const express = require('express');
const express_router = express.Router();

const cookie_parser = require('cookie-parser');
express_router.use(cookie_parser());

express_router.get('/checktoken/checkmasterexpire/api/search/order/master',(req,res)=>{

	if( req.query.status && req.query.orderid ){

		let queryorderbyid = 'SELECT masterid,indexid,code,address,status,orderarea,orderskill,workdate,ordertext,originquote,tooldetails FROM orders WHERE indexid=' + req.query.orderid + ' AND status=\"' + req.query.status +'\"';
	
		mysql.con.query( queryorderbyid ,(err,result)=>{

			if( err ){

				res.send("{\"error\": \"Invalid token.\"}");

			}else if( result.length ===0 ){

				res.send("{\"message\": \"No result\"}");
			
			}else{

				if( req.masterid == result[0].masterid ){

					result = change_skill(result);

					result = change_date_type(result);

					let master_orders = {};

					master_orders.data = result;

					res.cookie('Authorization',req.header('Authorization'));

					res.send(master_orders);

				}else{

					res.send("{\"message\": \"No result\"}");

				}

			}

		})

	}else if( req.query.status && !req.query.orderid ){

		let query_order_by_status = 'SELECT indexid,orderarea,orderskill,orderdate,workdate,ordertext FROM orders WHERE masterid=' + req.masterid + ' AND status=\"' + req.query.status + '\"';

		if ( req.query.status == 'created' || req.query.status == 'quoted' ){

			query_order_by_status = query_order_by_status + ' ORDER BY orderdate ASC';

		}else if( req.query.status == 'paid' ){

			query_order_by_status = query_order_by_status + ' ORDER BY workdate ASC';

		}else if( req.query.status == 'closed' ){

			query_order_by_status = query_order_by_status + ' ORDER BY workdate DESC';

		}

		mysql.con.query(query_order_by_status,(err,result)=>{

			if( err ){

				res.send("{\"error\": \"Invalid token.\"}");

			}else if( result.length ===0 ){

				res.send("{\"message\": \"No result\"}");
			
			}else{

				result = change_skill(result);

				result = change_date_type(result);

				let total_page = Math.ceil( result.length / 4 );

				let search_master_order_result = [];

				if( req.query.page < total_page ){

					for( let i = ( (req.query.page -1 ) * 4 ) ; i < ( ( req.query.page * 4 ) ) ; i++ ){

						let count = i - ( ( req.query.page -1 ) * 4 ) ;

						search_master_order_result[count] = result[i] ;

					}

				}else if( req.query.page == total_page ){

					for( let i =( (req.query.page -1 ) * 4 ) ; i < result.length ; i++ ){

						let count = i - ( ( req.query.page -1 ) * 4 ) ;

						search_master_order_result[count] = result[i] ;

					}

				}else{

					res.send("{\"message\": \"No result\"}");

				}

				let master_orders = {};

				master_orders.data = search_master_order_result;

				master_orders.page = total_page;

				res.cookie('Authorization',req.header('Authorization'));

				res.send(master_orders);

			}

		})	

	}else{

		res.send("{\"incorrect\": \"No result\"}");

	}

})

module.exports = express_router;