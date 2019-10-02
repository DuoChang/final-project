const mysql=require("../util/mysqlcon.js");
const createtoken=require("../util/createtoken.js");
const express = require('express');
const expressrouter = express.Router();

const bodyParser = require('body-parser');
expressrouter.use(bodyParser.json());
expressrouter.use(bodyParser.urlencoded({extended:true}));

expressrouter.post('/api/user/signin',(req,res)=>{

	console.log(req.body);

			/*--Check if http header content is correct--*/

	if( req.header('Content-Type') != "application/json" ){

		res.send("{\"error\": \"Invalid request body.\"}");	

	}else{

		if( req.body.provider == "customer" ){

						/*--確認註冊過--*/
			
			mysql.con.query( 'SELECT phone,password FROM user WHERE phone=\"' + req.body.phone + '\" AND password = \"' + req.body.password + '\"' ,(err,result)=>{

				if( err || result.length ===0 ){

					res.send("{\"error\": \"Invalid token.\"}");

				}else{

					let customertokentosave = createtoken(req.body.phone);

					mysql.con.query( 'Update user SET ? WHERE phone =\"' + req.body.phone + '\" AND password = \"' + req.body.password + '\"' , customertokentosave , (err,result)=>{

						if( err || result.length ===0 ){

							res.send("{\"error\": \"Invalid token.\"}");

						}else{

						    /*--SELECT data FROM DB--*/

							let queryuser = "SELECT * FROM user WHERE phone=\"" + req.body.phone + "\"" ;

							mysql.con.query( queryuser ,(err,result)=>{

								if( err || result.length ===0 ){

									res.send("{\"error\": \"Invalid token.\"}");

								}else{

									/*--SELECT result assemble to object--*/

									let userres = {};
									userres.id = result[0].userid;
									userres.name = result[0].name;
									userres.phone = result[0].phone;
									userres.address = result[0].address;

									let userdata = {};
									userdata.access_token = result[0].access_token;
									userdata.access_expired = result[0].access_expired;
									userdata.provider = 'customer';


									let usertotalres = {};
									usertotalres.data = userdata;
									res.json(usertotalres);

								}

							})

						}

					})
				
				}
			
			});

		}else if( req.body.provider == "master" ){

						/*--確認註冊過--*/
			
			mysql.con.query( 'SELECT phone,password FROM master WHERE phone=\"' + req.body.phone + '\" AND password = \"' + req.body.password + '\"' ,(err,result)=>{

				if( err || result.length ===0 ){

					res.send("{\"error\": \"Invalid token.\"}");

				}else{

					let techniciantokentosave = createtoken(req.body.phone);

					mysql.con.query('Update master SET ? WHERE phone =\"' + req.body.phone + '\" AND password = \"' + req.body.password + '\"' , techniciantokentosave , (err,result)=>{

						if( err || result.length ===0 ){

							res.send("{\"error\": \"Invalid token.\"}");

						}else{
						    /*--SELECT data FROM DB--*/

							let querymaster = "SELECT masterid,email FROM master WHERE phone=\"" + req.body.phone + "\"";

							mysql.con.query(querymaster,(err,result)=>{

								if( err || result.length ===0 ){

									res.send("{\"error\": \"Invalid token.\"}");

								}else{

									var masterid = result[0].masterid;

									let querycheckmail = "SELECT status FROM mailstatus WHERE email=\"" + result[0].email + "\"";

									console.log(querycheckmail);

									mysql.con.query(querycheckmail,(err,result)=>{

										if( err || result.length ===0 ){

											res.send("{\"error\": \"Invalid token.\"}");

										}else if( result[0].status == 'active'){

											let querymasterall = "SELECT master.masterid AS masterid,master.name AS name,master.phone AS phone,master.email AS email,master.access_token AS access_token,master.access_expired AS access_expired, GROUP_CONCAT(DISTINCT masterarea.area) AS area FROM master,masterarea WHERE master.masterid=" + masterid + " AND masterarea.masterid=" + masterid ;
											mysql.con.query(querymasterall,(err,result)=>{

												console.log(result);

												let masterdata = {};
												masterdata.access_token = result[0].access_token;
												masterdata.access_expired = result[0].access_expired;
												masterdata.provider = 'master';

												let mastertotalres = {};
												mastertotalres.data = masterdata;
												res.json(mastertotalres);										

											})

										}else{

											res.send("{\"message\": \"Account not active\"}");

										}

									})

								}

							})

						}

					})
				
				}
			
			});

		}

	}

})




module.exports = expressrouter;