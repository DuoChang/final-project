const mysql=require("../util/mysqlcon.js");
const express = require('express');
const expressrouter = express.Router();
const stripe = require("stripe")(process.env.STRIPE_KEY);

const bodyParser = require('body-parser');
expressrouter.use(bodyParser.json());
expressrouter.use(bodyParser.urlencoded({extended:true}));

expressrouter.post('/checktype/checktoken/checkmasterexpire/api/master/order/close' ,(req,res)=>{

	if( req.body.code ){

		let querypaymasterdetail = 'SELECT paytomaster,masterid,indexid,paymentid,code FROM orders WHERE indexid=' + req.body.orderid;

		mysql.con.query( querypaymasterdetail ,(err,result)=>{

			if( err ){

				res.send("{\"error\": \"request body.\"}");

			}else if( result.length ===0 ){

				res.send("{\"message\": \"No result\"}");
			
			}else{

				let paymentid = result[0].paymentid;

				let orderid = result[0].indexid;

				let paytomaster = result[0].paytomaster;

				if( result[0].code == req.body.code ){

					let querygetmasteraccount = 'SELECT account FROM master WHERE masterid=' + result[0].masterid ;

					mysql.con.query( querygetmasteraccount ,(err,result)=>{

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

								let querycloseorder = 'UPDATE orders SET transactionid=\"' + transfer.id + '\",status=\"closed\" WHERE code=\"' + req.body.code + '\" AND indexid=' + orderid;

								mysql.con.query( querycloseorder ,(err,result)=>{

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

module.exports = expressrouter;