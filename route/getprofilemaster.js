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

					var querytechnicianalldataobj = new Promise(function(resolve,reject){

						let querymasterall = "SELECT master.account AS account,master.masterid AS masterid,master.name AS name,master.phone AS phone,master.email AS email,master.access_token AS access_token,master.access_expired AS access_expired,GROUP_CONCAT(DISTINCT masterarea.area) AS area FROM master,masterarea WHERE master.masterid=" + masterid + " AND masterarea.masterid=" + masterid ;
					
						mysql.con.query( querymasterall ,(err,result)=>{

							if( err ){

								res.send("{\"error\": \"Invalid token.\"}");

							}else{

								console.log(result);

								let technicianres = {};
								technicianres.id = result[0].masterid;
								technicianres.name = result[0].name;
								technicianres.phone = result[0].phone;
								technicianres.email = result[0].email;
								technicianres.area = result[0].area;
								technicianres.account = result[0].account;

								let techniciandata = {};
								techniciandata.access_token = result[0].access_token;
								techniciandata.access_expired = result[0].access_expired;
								techniciandata.provider = 'master';
								techniciandata.basic = technicianres;

								resolve(techniciandata);

							}									

						})

						return querytechnicianalldataobj;

					})

					querytechnicianalldataobj.then((techniciandata)=>{

						let querytechnicianskill = 'SELECT * FROM masterskill WHERE masterid=' + masterid;

						mysql.con.query( querytechnicianskill ,(err,result)=>{

							if( err ){

								res.send("{\"error\": \"Invalid token.\"}");

							}else{

								let technicianskillarray = [];

								if( result[0].light == 1){
									technicianskillarray.push('light');
								}
								if( result[0].toilet ==1 ){
									technicianskillarray.push('toilet');
								}
								if( result[0].waterheater ==1 ){
									technicianskillarray.push('waterheater');
								}
								if( result[0].pipe ==1 ){
									technicianskillarray.push('pipe');
								}
								if( result[0].faucet ==1 ){
									technicianskillarray.push('faucet');
								}
								if( result[0].bathtub ==1 ){
									technicianskillarray.push('bathtub');
								}
								if( result[0].wire ==1 ){
									technicianskillarray.push('wire');
								}
								if( result[0].soil ==1 ){
									technicianskillarray.push('soil');
								}
								if( result[0].paint ==1 ){
									technicianskillarray.push('paint');
								}
								if( result[0].wallpaper ==1 ){
									technicianskillarray.push('wallpaper');
								}
								if( result[0].tile ==1 ){
									technicianskillarray.push('tile');
								}


								techniciandata.skill = technicianskillarray;

								console.log(techniciandata);

								let techniciantotalres = {};
								techniciantotalres.data = techniciandata;
								res.json(techniciantotalres);

							}

						})

					})

				}
			}
		})		
	}

})




module.exports = expressrouter;