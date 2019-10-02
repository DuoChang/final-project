const mysql=require("../util/mysqlcon.js");
const express = require('express');
const expressrouter = express.Router();
const crypto = require('crypto');
const stripe = require("stripe")("sk_test_1UIhmFMbhl0lO9w4Hdp6jNnC00MXi9WabT");

const bodyParser = require('body-parser');
expressrouter.use(bodyParser.json());
expressrouter.use(bodyParser.urlencoded({extended:true}));


expressrouter.post('/api/master/order/close' ,(req,res)=>{

	console.log('AAA',req.body);

	if( !req.header('Authorization') || req.header('Authorization') == ''){
		console.log('898');
		res.send("{\"error\": \"Invalid Token.\"}");
	}else{

		let tokensplit = req.header('Authorization').split(' ');

		let timenow = Date.now();

		let checkauthorization = "SELECT masterid,access_expired FROM master WHERE access_token=\"" + tokensplit[1] + "\"";

		mysql.con.query(checkauthorization,(err,result)=>{

			if(err || result.length===0 || tokensplit[0] !="Bearer"){

				console.log('title錯誤或未搜尋到內容');
			
				res.send("{\"error\": \"Invalid Token.\"}");
			
			}else{

				let masterid = result[0].masterid ;

				if( timenow > result[0].access_expired ){

					console.log('A7A');

					res.send("{\"error\": \"Invalid token.\"}");
				
				}else{

					if( req.body.code ){

						console.log('A8A');

						let getordercode = 'SELECT paytomaster,masterid,indexid,paymentid,code FROM orders WHERE indexid=' + req.body.orderid;

						mysql.con.query( getordercode ,(err,result)=>{

							if( err ){

								console.log('A9A');

								res.send("{\"error\": \"request body.\"}");

							}else if( result.length ===0 ){

								console.log('A10A');

								res.send("{\"message\": \"No result\"}");
							
							}else{

								var paymentid = result[0].paymentid;

								var orderid = result[0].indexid;

								var paytomaster = result[0].paytomaster;

								if( result[0].code == req.body.code ){

									let getaccountquery = 'SELECT account FROM master WHERE masterid=' + result[0].masterid ;

									mysql.con.query( getaccountquery ,(err,result)=>{

										if( err ){

											console.log('A9A',err);

											res.send("{\"error\": \"request body.\"}");

										}else if( result.length ===0 ){

											console.log('A10A');

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

											  	console.log(transfer.id);

												console.log('A1A1A');

												let closeorderquery = 'UPDATE orders SET transactionid=\"' + transfer.id + '\",status=\"closed\" WHERE code=\"' + req.body.code + '\" AND indexid=' + orderid;

												console.log(closeorderquery);

												mysql.con.query( closeorderquery ,(err,result)=>{

													console.log('A3A3A');

													if( err ){

														console.log(err);

														res.send("{\"error\": \"Invalid token.\"}");

													}else{

														
														console.log('7788A');
														res.send("{\"data\": \"Update success\"}");
													
													}

												})							

											}).catch(err=>{

												console.log('A8936A',err);
												res.send("{\"error\": \"Invalid token.\"}");
											});
										}

									})

								}else{

									console.log('A2A2A');

									res.send("{\"message\": \"No result\"}");

								}

							}
						
						})

					}else{

						console.log('334455');

						res.send("{\"message\": \"No result\"}");
					
					}

				}

			}

		})

	}

})

module.exports = expressrouter;