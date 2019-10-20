const mysql=require("../util/mysqlcon.js");
const express = require('express');
const express_router = express.Router();
const multer  = require('multer')
const upload = multer({ dest: 'uploads/' });
const node_xlsx = require('node-xlsx');
const fs = require('fs');
const request = require('request');

const cookie_parser = require('cookie-parser');
express_router.use(cookie_parser());

const body_parser = require('body-parser');
express_router.use(body_parser.json());
express_router.use(body_parser.urlencoded({extended:true}));

let cp_upload = upload.fields([{ name: 'quotefile', maxCount: 1 }]); 

express_router.post('/api/masterquote', cp_upload  ,(req,res)=>{

	if( !req.cookies.Authorization || req.cookies.Authorization == ''){

		return res.redirect('../masterquoteresult.html?status=6');

	}else{

		let token_split = req.cookies.Authorization.split(' ');

		let time_now = Date.now();

		let check_authorization = "SELECT access_expired FROM master WHERE access_token=\"" + token_split[1] + "\"";

		mysql.con.query(check_authorization, (err,result)=>{

			if(err || result.length===0 || token_split[0] !="Bearer"){

				return res.redirect('../masterquoteresult.html?status=6');
			
			}else{

				if( time_now > result[0].access_expired ){

					return res.redirect('../masterquoteresult.html?status=6');
				
				}else{				

					if( req.body.cost ){

						let orderid = req.body.orderid;
						let originquote = req.body.cost;

						if( req.files.quotefile != undefined ){

							let obj = node_xlsx.parse(req.files.quotefile[0].path);

							let excel_obj = obj[0].data;

							if( excel_obj[0][0] != "耗材編號" || excel_obj[0][1] != "耗材名稱" || excel_obj[0][2] != "耗材價錢(TWD)" || excel_obj.length != 3){

								fs.unlink( req.files.quotefile[0].path, function () {

								});

								return res.redirect('../masterquoteresult.html?status=2');

							}

							var get_pchome_price = new Promise(function(resolve,reject){

								let sum_of_materials_price = 0 ;

								let materail_obj = {};

								let material_obj_crawler_price = {};

								var count = 0;

								for( let i = 1 ; i < excel_obj.length ; i++ ){						

									if( typeof(excel_obj[i][1]) != 'string' ){

										fs.unlink(req.files.quotefile[0].path, function () {

										});

										return res.redirect('../masterquoteresult.html?status=3&row=' + (i+1) + '&column=B');
									
									}else if( typeof(excel_obj[i][2]) != 'number' || excel_obj[i][2] < 0 || ( excel_obj[i][2] - Math.floor(excel_obj[i][2]) ) > 0 ){

										fs.unlink(req.files.quotefile[0].path, function () {

										});

										return res.redirect('../masterquoteresult.html?status=3&row=' + (i+1) + '&column=C');

									}else{

										materail_obj[excel_obj[i][1]] = excel_obj[i][2];

										sum_of_materials_price = sum_of_materials_price + excel_obj[i][2] ;

										let material_item_string = encodeURIComponent(excel_obj[i][1]);

										let crawler_string = 'https://ecshweb.pchome.com.tw/search/v3.3/all/results?q=' + material_item_string + '&page=1&sort=sale/dc' ;

										let crawler_result = request( crawler_string, function (error, response, body) {

										    if ( !error && response.statusCode == 200) {

										        let crawler_data_back = JSON.parse(body);

										        count = count + 1 ;

										        material_obj_crawler_price[excel_obj[i][1]] = crawler_data_back.prods[0].price;

										        if( count == (excel_obj.length-1) ){

													let all_qoute_data = {};

													all_qoute_data.material_obj_crawler_price = material_obj_crawler_price;

													all_qoute_data.sum_of_materials_price = sum_of_materials_price;

													all_qoute_data.materail_obj = materail_obj;

													resolve(all_qoute_data);

													return get_pchome_price;

												}

										    }
										  								
										})

									}

								}

							})

							get_pchome_price.then((all_qoute_data)=>{

								let finalquote = + (originquote * 1.1).toFixed(0) + all_qoute_data.sum_of_materials_price ;

								let amount_pay_to_master = + originquote + all_qoute_data.sum_of_materials_price;

								material_string = JSON.stringify(all_qoute_data.materail_obj);

								material_obj_crawler_pricestring = JSON.stringify(all_qoute_data.material_obj_crawler_price);

								let update_order_items = {
									status:"quoted",
									originquote:originquote,
									finalquote:finalquote,
									tooldetails:material_string,
									tooldetailsfinal:material_obj_crawler_pricestring,
									paytomaster:amount_pay_to_master
								}

								let query_update_order = 'UPDATE orders SET ? WHERE indexid=' + orderid ;
								
								mysql.con.query( query_update_order , update_order_items ,(err,result)=>{

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

							let amount_pay_to_master = originquote;

							let update_order_items = {
								status:"quoted",
								originquote:originquote,
								finalquote:finalquote,
								paytomaster:amount_pay_to_master
							}
							
							let update_order_query = 'UPDATE orders SET ? WHERE indexid=' + orderid ;

							mysql.con.query( update_order_query , update_order_items ,(err,result)=>{

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

module.exports = express_router;