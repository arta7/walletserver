var  config = require('./dbconfig');
var mysql = require('mysql');



async  function  AddUsers(order,res,response) {
    try {
      let  pool = await  mysql.createConnection(config);
      console.log('order.body.Mobile  : ',order.body)
      var Name = order.body.Name ;
      var Family = order.body.Family ;
      var Mobile = order.body.Mobile ;
      var Gender = order.body.Gender ;
      var Education = order.body.Education ;
      var Password = order.body.Password ;
      console.log('pool : ',pool)
      pool.connect(async function(err) {
        
        if (err) throw err;
        console.log("Connected!");
      })
      pool.query("SELECT COUNT(*) as Counts FROM Users where Mobile=?",[Mobile], function (err, result) {
        if (err) throw err;
        console.log( 'result :',result[0].Counts,Mobile);
        if(result[0].Counts == 0)
        {
          pool.query('INSERT INTO `Users`(`Name`, `Family`, `Mobile`,`Gender`,`Education`,`SignUpDate`,`Password`) VALUES (?,?,?,?,?,CURRENT_TIMESTAMP(),?) '
          ,[Name,Family,Mobile,Gender,Education,Password], function (err, result) {
            if (err) throw err;
            response.send({ 'data': '200'})
            console.log( 'data : ', result);
          })
           
          // 
        }
        else
        {
          response.send({ 'data': '400'})
          console.log( 'Error :  Data Duplicated');
        }
       
    });
    }
    catch (error) {
      console.log('error get',error);
      return false;
    }
  }

  async  function  CheckUserLogin(order,res,response) {
    try {
      let  pool = await  mysql.createConnection(config);
      console.log('order.body.Mobile  : ',order.body)
      var Mobile = order.body.Mobile ;
      var Password = order.body.Password ;
      console.log('pool : ',pool)
      pool.connect(async function(err) {
        
        if (err) throw err;
        console.log("Connected!");
      })
      pool.query("SELECT *  FROM Users where Mobile=? and Password=?",[Mobile,Password], function (err, result) {
        if (err) throw err;
        console.log( 'result :',result.length);
        if(result.length >0)
        {
            response.send({ 'data': '200'})
            console.log( 'data : ', result);
        }
        else
        {
          response.send({ 'data': '400'})
          console.log( 'Error :  Data not Found');
        }
       
    });
    }
    catch (error) {
      console.log('error get',error);
      return false;
    }
  }



  async  function  UpdateUsers(order,res,response) {
    try {
      let  pool = await  mysql.createConnection(config);
      console.log('order.body.Mobile  : ',order.body)
      var Name = order.body.Name ;
      var Family = order.body.Family ;
      var Mobile = order.body.Mobile ;
      var Gender = order.body.Gender ;
      var Education = order.body.Education ;
      console.log('pool : ',pool)
      pool.connect(async function(err) {
        
        if (err) throw err;
        console.log("Connected!");
      })
      pool.query("SELECT COUNT(*) as Counts FROM Users where Mobile=?",[Mobile], function (err, result) {
        if (err) throw err;
        console.log( 'result :',result[0].Counts,Mobile);
        if(result[0].Counts == 1)
        {
          pool.query('Update Users set `Name`=?, `Family`=?,`Gender`=?,`Education`=? Where `Mobile` =?'
          ,[Name,Family,Gender,Education,Mobile], function (err, result) {
            if (err) throw err;
            response.send({ 'data': '200'})
            console.log( 'data : ', result);
          })
        }
        else
        {
          response.send({ 'data': '400'})
          console.log( 'Error :  Data Duplicated');
        }
       
    });
    }
    catch (error) {
      console.log('error get',error);
      return false;
    }
  }



  async  function  UpdateCountersProducts(order) {
    try {
      let  pool = await  sql.connect(config);
    let x =  await  pool.request()
      .input('ItemId', sql.Int, order.ItemId)
      .input('Description', sql.NVarChar,order.Description)
      .input('TypeId', sql.Int,order.TypeId)
      .input('Counters', sql.Float, order.Counters)
      //.execute('UseDetails');
      .query("insert into UseDetails(ItemId,Description,TypeId,Counters) values(@ItemId,@Description,@TypeId,@Counters)");
      console.log('true')
      return  true;
    }
    catch (error) {
      console.log('error get',error);
      return  false;
    }
  }

  module.exports = {
    AddUsers:  AddUsers,
    UpdateUsers:UpdateUsers,
    CheckUserLogin:CheckUserLogin,
    UpdateCountersProducts:UpdateCountersProducts
  }