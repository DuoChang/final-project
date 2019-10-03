const express = require('express');
const app = express();

app.use(express.static( __dirname + '/pages' ));
app.use(express.static( __dirname + '/uploads' ));

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