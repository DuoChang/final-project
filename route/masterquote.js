const mysql=require("../util/mysqlcon.js");
const express = require('express');
const expressrouter = express.Router();
const multer  = require('multer')
const upload = multer({ dest: 'uploads/' });
const node_xlsx = require('node-xlsx');
const fs = require('fs');
const request = require('request');

const cookieParser = require('cookie-parser');
expressrouter.use(cookieParser());

const bodyParser = require('body-parser');
expressrouter.use(bodyParser.json());
expressrouter.use(bodyParser.urlencoded({extended:true}));

let cpUpload = upload.fields([{ name: 'quotefile', maxCount: 1 }]); 

expressrouter.post('/api/masterquote', cpUpload  ,(req,res)=>{

	if( !req.cookies.Authorization || req.cookies.Authorization == ''){

		return res.redirect('../masterquoteresult.html?status=6');

	}else{

		let tokensplit = req.cookies.Authorization.split(' ');

		let timenow = Date.now();

		let checkauthorization = "SELECT access_expired FROM master WHERE access_token=\"" + tokensplit[1] + "\"";

		mysql.con.query(checkauthorization, (err,result)=>{

			if(err || result.length===0 || tokensplit[0] !="Bearer"){

				return res.redirect('../masterquoteresult.html?status=6');
			
			}else{

				if( timenow > result[0].access_expired ){

					return res.redirect('../masterquoteresult.html?status=6');
				
				}else{				

					if( req.body.cost ){

						let orderid = req.body.orderid;
						let originquote = req.body.cost;

						if( req.files.quotefile != undefined ){

							let obj = node_xlsx.parse(req.files.quotefile[0].path);

							let excelobj = obj[0].data;

							if( excelobj[0][0] != "耗材編號" || excelobj[0][1] != "耗材名稱" || excelobj[0][2] != "耗材價錢(TWD)" || excelobj.length != 3){

								fs.unlink( req.files.quotefile[0].path, function () {

								});

								return res.redirect('../masterquoteresult.html?status=2');

							}

							var getpchomeprice = new Promise(function(resolve,reject){

								let sumofmaterialsprice = 0 ;

								let materailobj = {};

								let materialobjcrawlerprice = {};

								var count = 0;

								for( let i = 1 ; i < excelobj.length ; i++ ){						

									if( typeof(excelobj[i][1]) != 'string' ){

										fs.unlink(req.files.quotefile[0].path, function () {

										});

										return res.redirect('../masterquoteresult.html?status=3&row=' + (i+1) + '&column=B');
									
									}else if( typeof(excelobj[i][2]) != 'number' || excelobj[i][2] < 0 || ( excelobj[i][2] - Math.floor(excelobj[i][2]) ) > 0 ){

										fs.unlink(req.files.quotefile[0].path, function () {

										});

										return res.redirect('../masterquoteresult.html?status=3&row=' + (i+1) + '&column=C');

									}else{

										materailobj[excelobj[i][1]] = excelobj[i][2];

										sumofmaterialsprice = sumofmaterialsprice + excelobj[i][2] ;

										let materialitemstring = encodeURIComponent(excelobj[i][1]);

										let crawlerstring = 'https://ecshweb.pchome.com.tw/search/v3.3/all/results?q=' + materialitemstring + '&page=1&sort=sale/dc' ;

										let crawlerresult = request( crawlerstring, function (error, response, body) {

										    if ( !error && response.statusCode == 200) {

										        let crawlerdataback = JSON.parse(body);

										        count = count + 1 ;

										        materialobjcrawlerprice[excelobj[i][1]] = crawlerdataback.prods[0].price;

										        if( count == (excelobj.length-1) ){

													let allqoutedata = {};

													allqoutedata.materialobjcrawlerprice = materialobjcrawlerprice;

													allqoutedata.sumofmaterialsprice = sumofmaterialsprice;

													allqoutedata.materailobj = materailobj;

													resolve(allqoutedata);

													return getpchomeprice;

												}

										    }
										  								
										})

									}

								}

							})

							getpchomeprice.then((allqoutedata)=>{

								console.log('hi');

								let finalquote = + (originquote * 1.1).toFixed(0) + allqoutedata.sumofmaterialsprice ;

								let amountpaytomaster = + originquote + allqoutedata.sumofmaterialsprice;

								materailstring = JSON.stringify(allqoutedata.materailobj);

								materialobjcrawlerpricestring = JSON.stringify(allqoutedata.materialobjcrawlerprice);

								let updateorderitems = {
									status:"quoted",
									originquote:originquote,
									finalquote:finalquote,
									tooldetails:materailstring,
									tooldetailsfinal:materialobjcrawlerpricestring,
									paytomaster:amountpaytomaster
								}

								let queryupdateorder = 'UPDATE orders SET ? WHERE indexid=' + orderid ;
								
								mysql.con.query( queryupdateorder , updateorderitems ,(err,result)=>{

									if( err ){

										return res.redirect('../masterquoteresult.html?status=6');

									}else{

											/*-- 最後刪除 --*/

										fs.unlink(req.files.quotefile[0].path, function () {

										});

										return res.redirect('../masterquoteresult.html?status=4');

									}

								})


							})

						}else{

							let finalquote = (originquote * 1.1).toFixed(0);

							let amountpaytomaster = originquote;

							let updateorderitems = {
								status:"quoted",
								originquote:originquote,
								finalquote:finalquote,
								paytomaster:amountpaytomaster
							}
							
							let updateorderquery = 'UPDATE orders SET ? WHERE indexid=' + orderid ;

							mysql.con.query( updateorderquery , updateorderitems ,(err,result)=>{

								if( err ){

									return res.redirect('../masterquoteresult.html?status=6');

								}else{

									return res.redirect('../masterquoteresult.html?status=4');

								}

							})
						}

					}else{

						return res.redirect('../masterquoteresult.html?status=1');

					}

				}

			}

		})

	}

})

module.exports = expressrouter;