const mysql=require("../util/mysqlcon.js");
const express = require('express');
const express_router = express.Router();
const stripe = require("stripe")(process.env.STRIPE_KEY);

const body_parser = require('body-parser');
express_router.use(body_parser.json());
express_router.use(body_parser.urlencoded({extended:true}));

express_router.post('/checktype/checktoken/checkmasterexpire/api/master/order/close' ,(req,res)=>{

	if( req.body.code ){

		let query_pay_master_detail = 'SELECT paytomaster,masterid,indexid,paymentid,code FROM orders WHERE indexid=' + req.body.orderid;

		mysql.con.query( query_pay_master_detail ,(err,result)=>{

			if( err ){

				res.send("{\"error\": \"request body.\"}");

			}else if( result.length ===0 ){

				res.send("{\"message\": \"No result\"}");
			
			}else{

				let paymentid = result[0].paymentid;

				let orderid = result[0].indexid;

				let paytomaster = result[0].paytomaster;

				if( result[0].code == req.body.code ){

					let query_get_master_account = 'SELECT account FROM master WHERE masterid=' + result[0].masterid ;

					mysql.con.query( query_get_master_account ,(err,result)=>{

						if( err ){

							res.send("{\"error\": \"request body.\"}");

						}else if( result.length ===0 ){

							res.send("{\"message\": \"No result\"}");
						
						}else{

							stripe.transfers.create({
							  amount: paytomaster*100,
							  currency: "usd",
							  destination: result[0].account,
							  source_transaction:paymentid,
							  transfer_group: orderid
							}).then(function(transfer) {

							  	// asynchronously called

								let query_close_order = 'UPDATE orders SET transactionid=\"' + transfer.id + '\",status=\"closed\" WHERE code=\"' + req.body.code + '\" AND indexid=' + orderid;

								mysql.con.query( query_close_order ,(err,result)=>{

									if( err ){

										res.send("{\"error\": \"Invalid token.\"}");

									}else{

										res.send("{\"data\": \"Update success\"}");
									
									}

								})							

							}).catch(err=>{

								console.log(err);
								res.send("{\"error\": \"Invalid token.\"}");

							});
						}

					})

				}else{

					res.send("{\"message\": \"No result\"}");

				}

			}
		
		})

	}else{

		res.send("{\"message\": \"No result\"}");
	
	}

})

module.exports = express_router;