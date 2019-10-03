const mysql=require("../util/mysqlcon.js");
const express = require('express');
const expressrouter = express.Router();

expressrouter.get('/api/userprofile/master',(req,res)=>{

	if( !req.header('Authorization') || req.header('Authorization') == '' ){
		res.send("{\"error\": \"Invalid request body.\"}");
	}else{
		let tokensplit = req.header('Authorization').split(' ');

		let timenow = Date.now();

		var checkauthorization = "SELECT masterid,access_expired FROM master WHERE access_token=\"" + tokensplit[1] + "\"";

		mysql.con.query(checkauthorization,(err,result)=>{

			if(err || result.length===0 || tokensplit[0] !="Bearer"){

				console.log('title錯誤或未搜尋到內容');
			
				res.send("{\"error\": \"Invalid request body.\"}");
			
			}else{

				let masterid = result[0].masterid ;

				if( timenow > result[0].access_expired ){

					res.send("{\"error\": \"Invalid request body.\"}");
				
				}else{

					var querymasteralldataobj = new Promise(function(resolve,reject){

						let querymasterall = "SELECT master.account AS account,master.masterid AS masterid,master.name AS name,master.phone AS phone,master.email AS email,master.access_token AS access_token,master.access_expired AS access_expired,GROUP_CONCAT(DISTINCT masterarea.area) AS area FROM master,masterarea WHERE master.masterid=" + masterid + " AND masterarea.masterid=" + masterid ;
					
						mysql.con.query( querymasterall ,(err,result)=>{

							if( err ){

								res.send("{\"error\": \"Invalid token.\"}");

							}else{

								console.log(result);

								let masterres = {};
								masterres.id = result[0].masterid;
								masterres.name = result[0].name;
								masterres.phone = result[0].phone;
								masterres.email = result[0].email;
								masterres.area = result[0].area;
								masterres.account = result[0].account;

								let masterdata = {};
								masterdata.access_token = result[0].access_token;
								masterdata.access_expired = result[0].access_expired;
								masterdata.provider = 'master';
								masterdata.basic = masterres;

								resolve(masterdata);

							}									

						})

						return querymasteralldataobj;

					})

					querymasteralldataobj.then((masterdata)=>{

						let querymasterskill = 'SELECT * FROM masterskill WHERE masterid=' + masterid;

						mysql.con.query( querymasterskill ,(err,result)=>{

							if( err ){

								res.send("{\"error\": \"Invalid token.\"}");

							}else{

								let masterskillarray = [];

								if( result[0].light == 1){
									masterskillarray.push('light');
								}
								if( result[0].toilet ==1 ){
									masterskillarray.push('toilet');
								}
								if( result[0].waterheater ==1 ){
									masterskillarray.push('waterheater');
								}
								if( result[0].pipe ==1 ){
									masterskillarray.push('pipe');
								}
								if( result[0].faucet ==1 ){
									masterskillarray.push('faucet');
								}
								if( result[0].bathtub ==1 ){
									masterskillarray.push('bathtub');
								}
								if( result[0].wire ==1 ){
									masterskillarray.push('wire');
								}
								if( result[0].soil ==1 ){
									masterskillarray.push('soil');
								}
								if( result[0].paint ==1 ){
									masterskillarray.push('paint');
								}
								if( result[0].wallpaper ==1 ){
									masterskillarray.push('wallpaper');
								}
								if( result[0].tile ==1 ){
									masterskillarray.push('tile');
								}


								masterdata.skill = masterskillarray;

								console.log(masterdata);

								let mastertotalres = {};
								mastertotalres.data = masterdata;
								res.json(mastertotalres);

							}

						})

					})

				}
			}
		})		
	}

})




module.exports = expressrouter;