const express = require('express');
const NodeCache = require( "node-cache" );
const app = express();

const routersignin = require('./route/signin.js');
const routersignup = require('./route/signup.js');
const routermailverify = require('./route/mailverify.js');
const routergetprofilemaster = require('./route/getprofilemaster.js');
const routerupdatemaster = require('./route/updatemaster.js');
const routersearchmaster = require('./route/searchmaster.js');
const routercreateorder = require('./route/createorder.js');
const routersearchmasterorder = require('./route/searchmasterorder.js');
const routermasterquote = require('./route/masterquote.js');
const routermasterclose = require('./route/masterclose.js');
const routersearchcustomerorder = require('./route/searchcustomerorder.js');
const routerquotereject = require('./route/quotereject.js');
const routerquoteaccept = require('./route/quoteaccept.js');
const routergetprofilecustomer = require('./route/getprofilecustomer.js');
const routerupdatecustomer = require('./route/updatecustomer.js');
const routersaveaddress = require('./route/saveaddress.js');
const routergetcomment = require('./route/getcomment.js');
const routersavecomment = require('./route/savecomment.js');


app.use(express.static( __dirname ));
app.use(express.static( __dirname + '/pages' ));
app.use(express.static( __dirname + '/pages/css' ));
app.use(express.static( __dirname + '/uploads' ));

/*-- Basics --*/

app.use('/', express.static('./pages/signup-customer.html') );
app.use('/process/master', express.static('./pages/masterprocess.html') );
app.use('/process/searchmaster', express.static('./pages/mastersearchprocess.html') );
app.use('/process/customer', express.static('./pages/customerprocess.html') );
app.use('/process/searchcustomer', express.static('./pages/customersearchprocess.html') );
app.use('/user/signin', express.static('./pages/signin.html') );
app.use('/user/signup/customer', express.static('./pages/signup-customer.html') );
app.use('/user/signup/master', express.static('./pages/signup-master.html') );
app.use('/user/mailsend', express.static('./pages/mailsend.html') );
app.use('/user/verify', express.static('./pages/mailverify.html') );
app.use('/user/verify/fail', express.static('./pages/mailverifyfail.html') );
app.use('/user/profile/master', express.static('./pages/masterprofile.html') );
app.use('/user/profile/customer', express.static('./pages/customerprofile.html') );
app.use('/user/errordirect', express.static('./pages/errordirect.html') );

/*-- Customer --*/
app.use('/customer/searchmaster', express.static('./pages/searchmaster.html') );
app.use('/customer/searchorders', express.static('./pages/searchcustomerorder.html') );
app.use('/customer/checkorder/created', express.static('./pages/customerrequestcheck.html') );
app.use('/customer/checkorder/quoted', express.static('./pages/customercheckquote.html') );
app.use('/customer/checkorder/paid', express.static('./pages/customerpaidcheck.html') );
app.use('/customer/paidresult', express.static('./pages/customerpaidresult.html') );
app.use('/customer/checkorder/closed', express.static('./pages/customerorderclose.html') );

/*-- Master --*/
app.use('/master/searchorders', express.static('./pages/searchmasterorder.html') );
app.use('/master/checkorder/quoted', express.static('./pages/masterpostcheck.html') );
app.use('/master/checkorder/created', express.static('./pages/masterpost.html') );
app.use('/master/quoteresult', express.static('./pages/masterpostresult.html') );
app.use('/master/checkorder/inputcode', express.static('./pages/masterinputcode.html') );
app.use('/master/checkorder/closed', express.static('./pages/masterorderclose.html') );

/*-- APIs --*/

app.use(routersignin);
app.use(routersignup);
app.use(routermailverify);
app.use(routergetprofilemaster);
app.use(routerupdatemaster);
app.use(routersearchmaster);
app.use(routercreateorder);
app.use(routersearchmasterorder);
app.use(routermasterquote);
app.use(routermasterclose);
app.use(routersearchcustomerorder);
app.use(routerquotereject);
app.use(routerquoteaccept);
app.use(routergetprofilecustomer);
app.use(routerupdatecustomer);
app.use(routersaveaddress);
app.use(routergetcomment);
app.use(routersavecomment);


app.listen(3000);