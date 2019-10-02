const mysql=require("../util/mysqlcon.js");
const changeskill=require("../util/changeskill.js");
const datetype=require("../util/changedatetype.js");
const express = require('express');
const expressrouter = express.Router();
const crypto = require('crypto');
const moment = require('moment');

const cookieParser = require('cookie-parser');
expressrouter.use(cookieParser());

const bodyParser = require('body-parser');
expressrouter.use(bodyParser.json());
expressrouter.use(bodyParser.urlencoded({extended:true}));

expressrouter.get('/api/search/order/customer',(req,res)=>{

	console.log(req.query);

	if( !req.header('Authorization') || req.header('Authorization') == ''){
		console.log('898');
		res.send("{\"error\": \"Invalid request body.\"}");
	}else{

		let tokensplit = req.header('Authorization').split(' ');

		let timenow = Date.now();

		let checkauthorization = "SELECT userid,access_expired FROM user WHERE access_token=\"" + tokensplit[1] + "\"";

		mysql.con.query(checkauthorization,(err,result)=>{

			if(err || result.length===0 || tokensplit[0] !="Bearer"){

				console.log('title錯誤或未搜尋到內容');
			
				res.send("{\"error\": \"Invalid request body.\"}");
			
			}else{

				var userid = result[0].userid ;

				if( timenow > result[0].access_expired ){

					res.send("{\"error\": \"Invalid request body.\"}");
				
				}else{

					if( req.query.status && req.query.orderid ){

						if( req.query.status == 'created' ){
						
							var queryorder = 'SELECT userid,indexid,status,orderarea,orderskill,workdate,ordertext FROM orders WHERE indexid=' + req.query.orderid + ' AND status=\"created\"';
						
						}else if( req.query.status == 'quoted' ){
						
							var queryorder = 'SELECT userid,indexid,status,orderarea,orderskill,workdate,ordertext,originquote,finalquote,tooldetails,tooldetailsfinal FROM orders WHERE indexid=' + req.query.orderid + ' AND status=\"quoted\"';
						
						}else if( req.query.status == 'paid' ){
						
							var queryorder = 'SELECT userid,indexid,code,address,status,orderarea,orderskill,workdate,ordertext,originquote,finalquote,tooldetails,tooldetailsfinal FROM orders WHERE indexid=' + req.query.orderid + ' AND status=\"paid\"';
						
						}else if( req.query.status == 'closed' ){

							var queryorder = 'SELECT userid,indexid,code,address,status,orderarea,orderskill,workdate,ordertext,originquote,finalquote,tooldetails,tooldetailsfinal FROM orders WHERE indexid=' + req.query.orderid + ' AND status=\"closed\"';

						}

												

						mysql.con.query(queryorder,(err,result)=>{

							if( err ){

								res.send("{\"error\": \"Invalid token.\"}");

							}else if( result.length ===0 ){

								res.send("{\"message\": \"No result\"}");
							
							}else{

								if( userid == result[0].userid ){

									for(let q = 0 ; q < result.length ; q += 1 ){

										result[q].workdate = moment(result[q].workdate).format("YYYY-MM-DD");

									}

									result = changeskill.changeskill(result);

									console.log(result);

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

						console.log('7788');

						if ( req.query.status == 'created' || req.query.status == 'quoted' ){

							console.log('787879');

							var queryorderbystatus = 'SELECT indexid,orderarea,orderskill,orderdate,workdate,ordertext FROM orders WHERE userid=' + userid + ' AND status=\"' + req.query.status + '\" ORDER BY orderdate ASC';

							console.log('33',queryorderbystatus);

						}else if( req.query.status == 'paid' ){

							console.log('787880');

							var queryorderbystatus = 'SELECT indexid,orderarea,orderskill,orderdate,workdate,ordertext FROM orders WHERE userid=' + userid + ' AND status=\"' + req.query.status + '\" ORDER BY workdate ASC';

						}else if( req.query.status == 'closed' ){

							var queryorderbystatus = 'SELECT indexid,orderarea,orderskill,orderdate,workdate,ordertext FROM orders WHERE userid=' + userid + ' AND status=\"' + req.query.status + '\" ORDER BY workdate DESC';

						}

						console.log('34',queryorderbystatus);

						mysql.con.query(queryorderbystatus,(err,result)=>{

							if( err ){

								res.send("{\"error\": \"Invalid token.\"}");

							}else if( result.length ===0 ){

								res.send("{\"message\": \"No result\"}");
							
							}else{

								for(let q = 0 ; q < result.length ; q += 1 ){

									result[q].workdate = moment(result[q].workdate).format("YYYY-MM-DD");
									result[q].orderdate = moment(result[q].orderdate).format("YYYY-MM-DD");

								}

								result = changeskill.changeskill(result);

								let totalpage = Math.ceil( result.length / 4 );

								console.log(totalpage);

								let outputresult = [];

								if( req.query.page < totalpage ){

									console.log('AWA789');

									for( let i = ( (req.query.page -1 ) * 4 ) ; i < ( ( req.query.page * 4 ) ) ; i++ ){

										console.log(i);

										let count = i - ( ( req.query.page -1 ) * 4 ) ;

										console.log(count);

										outputresult[count] = result[i] ;

									}

								}else if( req.query.page == totalpage ){

									console.log('C3C4',result.length);

									for( let i =( (req.query.page -1 ) * 4 ) ; i < result.length ; i++ ){

										let count = i - ( ( req.query.page -1 ) * 4 ) ;

										outputresult[count] = result[i] ;

										console.log('C89',count,i);

									}

								}else{

									res.send("{\"message\": \"No result\"}");

								}

								let userorders = {};

								userorders.data = outputresult;

								userorders.page = totalpage;

								res.cookie('Authorization',req.header('Authorization'));

								res.send(userorders);

							}

						})	

					}else{

						res.send("{\"incorrect\": \"No result\"}");

					}

				}
			}
		})

	}

})


module.exports = expressrouter;