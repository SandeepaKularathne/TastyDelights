//define function for fill data into select element

const fillDataIntoSelect = (field, message,dataList, property,selectedValue) => {
    field.innerHTML = '';

    if (message != "") {
      const optionMsg = document.createElement('option');
      optionMsg.selected = "selected";
      optionMsg.disabled = "disabled";
      optionMsg.value = "";
      optionMsg.innerText = message;
      field.appendChild(optionMsg);
    }
  

    dataList.forEach(element => {
        const option = document.createElement('option');
        option.value = JSON.stringify(element);
        option.innerText = element[property];
        if (element[property]== selectedValue) //selected value eka display wecha property ekata equal kiyala balanawa
        {
            option.selected = "selected";
        }
        field.appendChild(option);
        
    });

    
}


const fillDataIntoSelect2 = (field, message,dataList, property,propertyTwo,selectedValue) => {
  field.innerHTML = '';

  if (message != "") {
    const optionMsg = document.createElement('option');
    optionMsg.selected = "selected";
    optionMsg.disabled = "disabled";
    optionMsg.value = "";
    optionMsg.innerText = message;
    field.appendChild(optionMsg);
  }


  dataList.forEach(element => {
      const option = document.createElement('option');
      option.value = JSON.stringify(element);
      option.innerText = element[property];
      if (element[property]== selectedValue) //selected value eka display wecha property ekata equal kiyala balanawa
      {
          option.selected = "selected";
      }
      option.innerText = element[property] + " - " + getDataFormObject(element,propertyTwo);

      field.appendChild(option);
      
  });

  
}

/* This us used get prpoerties from 2 tables (eg: In pricerequest module inner form: material name+ unit type name) */

// {name: "Kamal" , unittype_id:{id:1, name:"Kg"}} / "unittype_id.name"
const getDataFormObject = (objectData , propertyPath)=> {

  value = (ob, path) => {

   // [ "unittype_id" , "name"]
   let propertyPathList = path.split('.');
   if (propertyPathList.length > 1) {
     
     if ( typeof ob[propertyPathList[0]] === 'object') {
      return value(ob[propertyPathList[0]], propertyPathList.splice(1).join('.'));
     }
   }else{
     return ob[propertyPathList[0]];
   }
 }

 return value(objectData, propertyPath);

}

//define function for ajax get request mapping
const ajaxGetRequest = (url) => {

    let getRequestResponse ;

     /*   call jquery ajax function here we use ajax jquery to load data from the server. $jquery.ajax(url,[option]) this is used from EmployeeController file
        "ajax" method takes an object that specifies the details of the request, including the URL, */    

   /* Ajax eken call karama db eke thiyena data tikka apita frontend eken access karanna puluwan wei. mewa dynamic datas nissa meh tikka apita mokak hari add karanna oneh unoth db eken add karanna puluwan array wala innawata wadaa */ 
    
    $.ajax(url ,{
        /* true nm dhanna onenh na false nm thamai danna oneh true nm continue wenawaa reponse enkam balagena inne nah , false nm reponse eka enakam balagena innawaa. data or error kiyana response eka */

        async: false,
        data : 'json',
        // Request karana method eka -----> GET, POST, PUT,DELETE
        type: "GET",
        //data pass karaan format eka 
        contentType: "application/json",

          //data enah eka success nm 
        success: function (successOb){
         console.log("Success"); //output eka mehema enna oneh success nm
         getRequestResponse = successOb; //employee eka successResponceData ekata asign karanawa
        },

        //data enah eka failure nm 
        error: function (errorOb) {
         console.log("Fail" + errorOb);
         getRequestResponse = [];
        }
      });

      return getRequestResponse; // success or error data will return to this 
}


//define function for ajax request (Post, Put, Delete)
const ajaxRequestBody = (url,method,ob) =>{
    let serverResponce
    
   /* Ajax eken call karama db eke thiyena data tikka apita frontend eken access karanna puluwan wei. mewa dynamic datas nissa meh tikka apita mokak hari add karanna oneh unoth db eken add karanna puluwan array wala innawata wadaa */ 

    $.ajax(url, {
        //data pass karaan format eka 
        async: false,
        type : method,
        // Request karana method eka -----> GET, POST, PUT,DELETE
        contentType: "application/json",
        data : JSON.stringify(ob),
        
        /* true nm dhanna onenh na false nm thamai danna oneh 
        true nm continue wenawaa reponse enkam balagena inne nah , false nm reponse eka enakam balagena innawaa. data or error kiyana response eka */
    
        //data enah eka success nm 
        success: function (successResponceData) {
           console.log("success", successResponceData); //output eka mehema enna oneh success nm
           serverResponce = successResponceData; //employee eka successResponceData ekata asign karanawa
        },
    
        //data enah eka failure nm 
        error: function (failResponceData) {
           console.log("error", failResponceData);
           serverResponce = failResponceData;
        }
    
     });

     return serverResponce;
}






