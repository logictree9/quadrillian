var async = require('async');
var rest = require('restler');
var stoken = '905q96edq2vbjl4mhpci2526g7';


testrun();

//run test
function testrun(){ 

 	var main_object=[];   	
	var obj = {};
    var head={};
    var cook={};

	//fething url params from json
	for(var i=0;i<data.param.length;i++){	

        if(data.param[i].enctype_code=="HEAD"){

            head[data.param[i].param_name]=data.param[i].param_value

        }else if(data.param[i].enctype_code=="COOK"){  

            cook["cookie"]=data.param[i].param_name+":"+data.param[i].param_value

        }else{

            obj[data.param[i].param_name]=data.param[i].param_value
        }
		
	}

	obj.stoken="905q96edq2vbjl4mhpci2526g7"; 

    var options=[];
    options.method="post";
    options.data=obj;
    options.headers=cook;



    rest.post(data.test.test_url, options).on('complete', function(response){

    	for(var i=0;i<data.check.length;i++){
    		if(data.check[i].check_variable_name_1=data.check[i].check_value_2){
    			console.log("test passed...........\n");
    		}else{
    			console.log("test failed...........\n");
    		}
    	}
    	console.log(JSON.stringify(response));
    
    });
}
