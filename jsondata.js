// test suite id : we are iterating all tests in this test suite id 
// and append them in a separate file with name datanile.js
var test_suite_id = 927
var stoken = '905q96edq2vbjl4mhpci2526g7';

// libraries required for file writing, rest api call, async functionality 
var sys = require('sys');
var async = require('async');
var rest = require('restler');
var assert = require('assert');
var fs = require('fs');

var testid;
var test_ids_array=[];
var main_object = {};


var test_object = {};
var param_object = {};
var check_object = {};

// get list of test in specified test suite
rest.get("http://api.quadrillian.com/test_to_test_suite/select", 
      {
       'data' : 
          {
            'search_type' : 'exact',
            'search' : test_suite_id,          
            'ztest_suite_id': test_suite_id,
            'stoken'  : stoken
          }
          }).on('complete', function(res) {
            res = JSON.parse(res);  
            data =res.recs;

            for(var i=0 ; i < data.length ; i++){

              testid=data[i].test_id;               
              test_ids_array.push(testid);  

            }
            async.eachSeries(test_ids_array, test_file_generator, function(err){
            
           // console.log(JSON.stringify(test_suit_object));

            //creating test file with JSON data of test_suit
            fs.writeFile("run_test.js", "var data="+JSON.stringify(main_object)+"\n", function(err) {
              if(err) {
                return console.log(err);
                }
              });
       
            fs.readFile('test_engine.js', function (err, data) {
               if (err) throw err;

            fs.appendFile("run_test.js", data, function(err) {
               if(err) {
                  return console.log(err);
                }
            
            });
          });

      console.log("test execution finished "+JSON.stringify(main_object));
    });
});

// run function : run for each test 
function test_file_generator(testid, outerCallback){

  async.waterfall([

    function(callback){ 
       rest.get('http://api.quadrillian.com/test/select?', 
        {
         'data' : 
            {
              'ztest_id' : testid,
              'search_type' :'exact',
              'use_lookup_for' :'1',
              'search' :testid,
              'stoken' : stoken
            }
         }    
        
      ).on('complete', function(res) { 
    
        res = JSON.parse(res);  
        
        data =res.recs[0];
        
        //storing test details in object
        test_object.test_id = data.test_id;
        test_object.test_url = data.test_url;
        test_object.test_method =data.test_method;
        test_object.method_code=data.method_code;
        callback(null,data);
      
      });
    
    },
    
    function(testid,callback){ 

      rest.get('http://api.quadrillian.com/test_param/select', 
        {
         'data' : 
            {
              'ztest_id'     : testid,
              'search_type'  : 'exact',
              'search'    : testid,
              'sort'      :'test_param_id',
              'sort_dir'    :'asc' ,
              'stoken' : stoken
            }
         }    
        
      ).on('complete', function(res) {
     
          res= JSON.parse(res);  
          response=res.recs;

          var arr = [];

      //storing test param objects in array  
      for(var i = 0; i < response.length ; i++){
        
           var _param = {};
           _param.param_name = response[i].param_name;
            _param.param_value = response[i].param_value;
           _param.param_type = response[i].param_type;
           _param.enctype_code=response[i].enctype_code;
            arr.push(_param);  
      }

     param_object = arr;

      callback(null,data.test_id);
      });

    },
    
    function(testid,callback){ 

      rest.get('http://api.quadrillian.com/test_check/select', 
        {
         'data' : 
            {
              'ztest_id' :testid,
              'search_type' : 'exact',
              'search' :testid,
              'stoken' :stoken
            }
         }    
        
      ).on('complete', function(res) { //
     
      res= JSON.parse(res);
      data =res.recs;
      var arr = [];

       //storing test_check details in array
      for(var i = 0; i < data.length ; i++){
           var _check = {};
           _check.check_id = data[i].checkid;
            _check.test_id= data[i].test_id;
           _check.check_variable_name_1 = data[i].check_variable_name_1;
           _check.operand_code =data[i].operand_code;
           _check.check_value_2=data[i].check_value_2;
            arr.push(_check);  
      }
    
      check_object=arr;
      callback(null);
      
      });
    }
    

  ],

  // optional callback
    function(err, results){

      main_object.test = test_object;
      main_object.param = param_object;
      main_object.check = check_object;
     // test_suit_object.push(JSON.stringify(main_object));
     sys.puts("run test done."+JSON.stringify(main_object)+"\n\n");
      outerCallback();
  });

}















