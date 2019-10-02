const mysql=require("../util/mysqlcon.js");
const express = require('express');
const expressrouter = express.Router();
const crypto = require('crypto');
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

const nodemailer = require('nodemailer');
const credentials = require('../util/credentials.js');
const mailTransport = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: credentials.gmail.user,
    pass: credentials.gmail.pass
  }
});

let cpUpload = upload.fields([{ name: 'quotefile', maxCount: 1 }]); 

expressrouter.post('/api/masterquote', cpUpload  ,(req,res)=>{

	if( !req.cookies.Authorization || req.cookies.Authorization == ''){
		console.log('898');

		return res.redirect('/master/quoteresult?status=6');

	}else{

		let tokensplit = req.cookies.Authorization.split(' ');

		let timenow = Date.now();

		let checkauthorization = "SELECT masterid,access_expired FROM master WHERE access_token=\"" + tokensplit[1] + "\"";

		mysql.con.query(checkauthorization, (err,result)=>{

			if(err || result.length===0 || tokensplit[0] !="Bearer"){

				console.log('title錯誤或未搜尋到內容');
			
				return res.redirect('/master/quoteresult?status=6');
			
			}else{

				let masterid = result[0].masterid ;

				if( timenow > result[0].access_expired ){

					return res.redirect('/master/quoteresult?status=6');
				
				}else{				

					if( req.body.cost ){

						let ordernum = req.body.orderid;
						let originquote = req.body.cost;

						if( req.files.quotefile != undefined ){

							let obj = node_xlsx.parse(req.files.quotefile[0].path);

							let excelObj = obj[0].data;

							console.log(excelObj);

							if( excelObj[0][0] != "耗材編號" || excelObj[0][1] != "耗材名稱" || excelObj[0][2] != "耗材價錢(TWD)" || excelObj.length != 3){

								fs.unlink(req.files.quotefile[0].path, function () {

								});

								return res.redirect('/master/quoteresult?status=2');

							}

							var getpchomeprice = new Promise(function(resolve,reject){

								let sumofmaterials = 0 ;

								let materailobj = {};

								let materialobjcrawler = {};

								var count = 0;

								for( let i = 1 ; i < excelObj.length ; i++ ){

									console.log(i);							

									if( typeof(excelObj[i][1]) != 'string' ){

										fs.unlink(req.files.quotefile[0].path, function () {

										});

										return res.redirect('/master/quoteresult?status=3&row=' + (i+1) + '&column=B');
									
									}else if( typeof(excelObj[i][2]) != 'number' || excelObj[i][2] < 0 || ( excelObj[i][2] - Math.floor(excelObj[i][2]) ) > 0 ){

										fs.unlink(req.files.quotefile[0].path, function () {

										});

										return res.redirect('/master/quoteresult?status=3&row=' + (i+1) + '&column=C');

									}else{

										materailobj[excelObj[i][1]] = excelObj[i][2];

										sumofmaterials = sumofmaterials + excelObj[i][2] ;

										let materialitemstring = encodeURIComponent(excelObj[i][1]);

										let crawlerstring = 'https://ecshweb.pchome.com.tw/search/v3.3/all/results?q=' + materialitemstring + '&page=1&sort=sale/dc' ;

										let requestresult = request( crawlerstring, function (error, response, body) {

										    if (!error && response.statusCode == 200) {

										        let databack = JSON.parse(body);

										        count = count + 1 ;

										        console.log( count );

										        console.log('0520',databack.prods[0].price);

										        materialobjcrawler[excelObj[i][1]] = databack.prods[0].price;

										        if( count == (excelObj.length-1) ){

													console.log( 'B7B7' , (excelObj.length-1) );

													let getprice = {};

													getprice.materialobjcrawler = materialobjcrawler;

													getprice.sumofmaterials = sumofmaterials;

													getprice.materailobj = materailobj;

													resolve(getprice);

													return getpchomeprice;

												}

										    }
										  								
										})

									}

								}

							})

							getpchomeprice.then((getprice)=>{

								console.log('hi');

								let finalquote = + (originquote * 1.1).toFixed(0) + getprice.sumofmaterials ;

								let paidtomaster = + originquote + getprice.sumofmaterials;

								materailstring = JSON.stringify(getprice.materailobj);

								materialobjcrawlerstring = JSON.stringify(getprice.materialobjcrawler);

								console.log('A7A8',materialobjcrawlerstring);

								let updateorderitems = {
									status:"quoted",
									originquote:originquote,
									finalquote:finalquote,
									tooldetails:materailstring,
									tooldetailsfinal:materialobjcrawlerstring,
									paytomaster:paidtomaster
								}

								let updateorderquery = 'UPDATE orders SET ? WHERE indexid=' + ordernum ;
								
								mysql.con.query( updateorderquery , updateorderitems ,(err,result)=>{

									if( err ){

										return res.redirect('/master/quoteresult?status=6');

									}else{

											/*-- 最後刪除 --*/

										console.log('AAA');

										fs.unlink(req.files.quotefile[0].path, function () {

										});

										return res.redirect('/master/quoteresult?status=4');

									}

								})


							})

						}else{

							let finalquote = (originquote * 1.1).toFixed(0);

							let paidtomaster = originquote;

							let updateorderitems = {
								status:"quoted",
								originquote:originquote,
								finalquote:finalquote,
								paytomaster:paidtomaster
							}
							
							let updateorderquery = 'UPDATE orders SET ? WHERE indexid=' + ordernum ;

							mysql.con.query( updateorderquery , updateorderitems ,(err,result)=>{

								if( err ){

									return res.redirect('/master/quoteresult?status=6');

								}else{

									return res.redirect('/master/quoteresult?status=4');

								}

							})
						}

					}else{

						return res.redirect('/master/quoteresult?status=1');

					}

				}

			}

		})

	}

})

module.exports = expressrouter;