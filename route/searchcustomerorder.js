const mysql=require("../util/mysqlcon.js");
const change_skill=require("../util/changeskill.js");
const change_date_type=require("../util/changedatetype.js");
const express = require('express');
const express_router = express.Router();

const cookie_parser = require('cookie-parser');
express_router.use(cookie_parser());

express_router.get('/checktoken/checkuserexpire/api/search/order/customer',(req,res)=>{

	if( req.query.status && req.query.orderid ){

		let query_order_by_id = 'SELECT userid,indexid,code,address,status,orderarea,orderskill,workdate,ordertext,originquote,finalquote,tooldetails,tooldetailsfinal FROM orders WHERE indexid=' + req.query.orderid + ' AND status=\"' + req.query.status + '\"';

		mysql.con.query( query_order_by_id ,(err,result)=>{

			if( err ){

				res.send("{\"error\": \"Invalid token.\"}");

			}else if( result.length ===0 ){

				res.send("{\"message\": \"No result\"}");
			
			}else{

				if( req.userid == result[0].userid ){

					result = change_date_type( result );

					result = change_skill( result );

					let user_orders = {};

					user_orders.data = result;

					res.cookie('Authorization',req.header('Authorization'));

					res.send(user_orders);

				}else{

					res.send("{\"message\": \"No result\"}");

				}	

			}

		})

	}else if( req.query.status && !req.query.orderid ){

		let query_order_by_status = 'SELECT indexid,orderarea,orderskill,orderdate,workdate,ordertext FROM orders WHERE userid=' + req.userid + ' AND status=\"' + req.query.status + '\"';

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

				result = change_date_type( result );

				result = change_skill( result );

				let total_order_page = Math.ceil( result.length / 4 );

				let search_customer_order_result = [];

				if( req.query.page < total_order_page ){

					for( let i = ( (req.query.page -1 ) * 4 ) ; i < ( ( req.query.page * 4 ) ) ; i++ ){

						let count = i - ( ( req.query.page -1 ) * 4 ) ;

						search_customer_order_result[count] = result[i] ;

					}

				}else if( req.query.page == total_order_page ){

					for( let i =( (req.query.page -1 ) * 4 ) ; i < result.length ; i++ ){

						let count = i - ( ( req.query.page -1 ) * 4 ) ;

						search_customer_order_result[count] = result[i] ;

					}

				}else{

					res.send("{\"message\": \"No result\"}");

				}

				let user_orders = {};

				user_orders.data = search_customer_order_result;

				user_orders.page = total_order_page;

				res.cookie('Authorization',req.header('Authorization'));

				res.send(user_orders);

			}

		})	

	}else{

		res.send("{\"incorrect\": \"No result\"}");

	}

})


module.exports = express_router;