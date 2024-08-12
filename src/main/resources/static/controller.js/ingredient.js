
/* console.log('Browser Load'); // Priority 1 

To catch the table in js we can use as,

1. Creating a const variable. here tableuser is an element 

const tableUser =document.querySelector('#tableUser');   // can use getelementbyid instead of query selector
console.log(tableUser); // output will be null becoz we have link the script tag in head part so to avoid it have to link in end of the body tag 

2. browser on load event 
a. By Creating Annonymous Function 
 window.onload = function() {
    console.log('Browser on Load'); // same priority 
 }

 b. event function 
 window.addEventListener ('load',() =>{
    console.log('Browser on Load-1');
 })

 */

// instead of load we can use DOMContentLoaded,  Priority 2
window.addEventListener('DOMContentLoaded', () => {

   //module name in module table should be same 
   userPrivilege = ajaxGetRequest("/privilege/bylogedusermodule/Ingredient");
   //privilege object eka global kara hamathanama use karanna oneh nissa 


   //tooltip unable
   $('[ data-bs-toggle="tooltip" ]').tooltip();

   //here calling the refresh function when the browswer is loading 
   refreshIngredientTable();

   //calling the form refresh function 
   refreshIngredientForm();


});

const refreshIngredientTable = () => {

   //creating an array for store employee  data list 
   ingredients = ajaxGetRequest("/ingredient/findall");

   //text -----> string,number,data
   //function -----> object,array,boolean
   //column count = object count
   const displayPropertyList = [
      { property: 'ingno', datatype: 'string' },
      { property: 'ingredientname', datatype: 'string' },
      { property: 'unitofmeasurment', datatype: 'string' },
      { property: 'costperunit', datatype: 'string' },
      { property: getIngredientStatus, datatype: 'function' }

   ];
   //call function fill data into table. this is an reusbale function 

   //(tableId,dataList,displayPropertyList, refillfunction name, delete function name, print function name, buttonvisibility)
   fillDataIntoTable(tableIngredient, ingredients, displayPropertyList, deleteDisableFunction, true, userPrivilege);

   divModify.classList.add('d-none');

   divstatus.classList.add('d-none');

    //link for table search and sort item
    $("#tableIngredient").dataTable();
}


const deleteDisableFunction = (ob) => {
   //record eka delete unama eka disbale krannai use karnnne ----> disable delete button 
   if (ob.ingredientstatus_id.name == "Not-Available") {
      btnTableDelete.disabled = "disabled";

   }

   if (ob.ingredientstatus_id.name == "Available") {
      btnTableDelete.disabled = "";

   }
}

// form Refresh Function
const refreshIngredientForm = () => {
   // by creating an object its easy to connect the datas directly with backend 
   ingredient = new Object();

   ingredientStatuses = ajaxGetRequest("/ingredientstatus/findall");

   fillDataIntoSelect(selectIngredientStatus, 'Selected Ingredient Status....!', ingredientStatuses, 'name', "Available");
   ingredient.ingredientstatus_id = JSON.parse(selectIngredientStatus.value); //meken html define karapu validator eka block welaa api asign karapu value eka penawaa


   //need to empty all elements
   textingredientName.value = '';
   textUnitofMeasurement.value = '';
   textCostPerUnit.value = '';
   textnote.value = '';

   //need to set default color
   textingredientName.style.border = '1px solid #ced4da';
   textUnitofMeasurement.style.border = '1px solid #ced4da';
   textCostPerUnit.style.border = '1px solid #ced4da';
   textnote.style.border = '1px solid #ced4da';
   selectIngredientStatus.style.border = '2px dashed green';
   selectIngredientStatus.style.color = 'green';

   textingredientName.classList.remove("is-valid");
   textUnitofMeasurement.classList.remove("is-valid");
   textCostPerUnit.classList.remove("is-valid");
   textnote.style.border = '1px solid #ced4da';
   selectIngredientStatus.classList.add("is-valid");


   btnUpdateIngredient.disabled = "disabled";
   // btnUpdateEmployee.style.cursor = "not-allowed";
   $("#btnUpdateIngredient").css("cursor", "not-allowed");


   if (userPrivilege.insert) {
      btnAddIngredientdisabled = "";
      $("#btnAddIngredient").css("cursor", "pointer");

   } else {
      btnAddIngredient.disabled = "disabled";
      $("#btnAddIngredient").css("cursor", "not-allowed");

   }

}


const getIngredientStatus = (ob) => {


   if (ob.ingredientstatus_id.name == 'Available') {
      return '<p class = "button-available">' + ob.ingredientstatus_id.name + '</p>';
   }
   if (ob.ingredientstatus_id.name == 'Not-Available') {
      return '<p class = "button-notavailable">' + ob.ingredientstatus_id.name + '</p>';
   }

}

// here if we use the elemet the size of the data is high also if we use an id as obid it will be array its hard to catch in an order so its better to use index of a row 
const deleteIngredient = (ob, rowindex) => {
   ingredient = ob;
   // const userConfirm = confirm('Are You Sure to delete the following Customer details \n'+ customers[rowindex].firstName);
   const userConfirm = confirm('Are You Sure To Delete Following Ingredient...? \n'

      + '\n Code is : ' + ob.ingno
      + '\n Ingredient Name is : ' + ob.ingredientname

   );

   if (userConfirm) {
      //call delete services 


      let serverResponce = ajaxRequestBody("/ingredient", "DELETE", ingredient);


      if (serverResponce == 'OK') {
         alert('Delete Successfully....! ');

         refreshIngredientTable(); //table reset
         formingredient.reset(); // form reset
         refreshIngredientForm();  //dynamic elemet reset

      } else {
         alert('Delete not completed, you have following error \n' + serverResponce);
      }

   }
}

//create  function for print customer record
const printIngredient = (ob, rowIndex) => {
      //need to get full object of a row
      const ingredientPrint = ob;

      //tableid.1th child ge length eka ganawa
for (let i = 0; i < tableIngredient.children[1].children.length; i++) {
tableIngredient.children[1].children[i].style.backgroundColor = 'white';
}
//tableid
tableIngredient.children[1].children[rowIndex].style.backgroundColor = 'pink';

tdNum.innerText = ingredientPrint.ingno;
tdIngredientname.innerText = ingredientPrint.ingredientname;
tdUoMeasurment.innerText = ingredientPrint.unitofmeasurment;
tdCostUnit.innerText = ingredientPrint.costperunit;
tdIngStatus.innerText = ingredientPrint.ingredientstatus_id.name;


                        
$('#modalPrintIngredient').modal('show');

//need to refresh table
//refreshEmployeeTable();

}
const PrintIngredientTableButton = () => {
   newTab = window.open();
   newTab.document.write(
       '<head><title>Print Ingredient</title>' +
       '<link rel="stylesheet" href="resources/bootstrap-5.3.2/css/bootstrap.' +
       'min.css">'+
       '</head>' +
       '<h2 style="margin-top: 100px">Ingredient Detail</h2>' +
       tableIngredient.outerHTML
);

   // This is a time interval - anith paththa open wela mili second 1000k giyata passe thamai
   // function eka athula execute wenne
   // time out handler function eka run wenne mili second gana giyata passe
   setInterval(
       function () {
           newTab.print();
       } , 1000
   )

   //need to refresh table and form
   refreshIngredientTable();

   //need to hide modal
   $('#modalPrintIngredient').modal('hide');
}

//create function for print employee table
const printIngredientFullTable = () => {
   const newTab = window.open();
   newTab.document.write(
       '<head><title>Print Ingredient</title>' +
       ' <script src="\script\jQuery.js"></script>' +
       '<link rel="stylesheet" href="resources/bootstrap-5.3.2/css/bootstrap.' +
       'min.css">'+
       '</head>' +
       '<h2 style="margin-top: 100px">Ingredient Details</h2>' +
       tableIngredient.outerHTML +
       '<script>$(".modify-button").css("display","none")</script>'

   );

   // This is a time interval - anith paththa open wela mili second 1000k giyata passe thamai
   // function eka athula execute wenne
   // time out handler function eka run wenne mili second gana giyata passe
   setInterval(
       function () {
           newTab.print();
       } , 1000
   )

}

// function for edit customer record 
const refillIngredientForm = (ob, rowindex) => {

   ingredient = JSON.parse(JSON.stringify(ob));
   oldingredient = JSON.parse(JSON.stringify(ob));

   //offcanvas open
   $('#offcanvasTop').offcanvas('show');

   divstatus.classList.remove('d-none');

   //set Value into static element
   //elementid.value = ob.relevantProertyname

   textingredientName.value = ob.ingredientname;
   textCostPerUnit.value = ob.costperunit;
   selectIngredientStatus.value = ob.ingredientstatus_id;

   //optional fields
   if (ingredient.unitofmeasurment != null)
      textUnitofMeasurement.value = ob.unitofmeasurment; else textUnitofMeasurement.value = "";

   if (ingredient.note != null)
      textnote.value = ob.note; else textnote.value = "";

   //object eeken illaganawa property ekai eyage type ekai 
   // name ----> final property      
   //final propert ekai display property ekai equal wenna oneh 

   fillDataIntoSelect(selectIngredientStatus, 'Select Ingredient Status....!', ingredientStatuses, 'name', ingredient.ingredientstatus_id.name);

   if (userPrivilege.update) {
      btnUpdateIngredient.disabled = "";
      $("#btnUpdateIngredient").css("cursor", "pointer");

   } else {
      btnUpdateIngredient.disabled = "disabled";
      // btnUpdateEmployee.style.cursor = "not-allowed";
      $("#btnUpdateIngredient").css("cursor", "not-allowed");


   }
   btnAddIngredient.disabled = "disabled";
   $("#btnAddIngredient").css("cursor", "not-allowed");

}


//define function for check form updates 
const checkFormUpdate = () => {
   let updates = "";
   //changes apply wenne employee ekata. propertyname != Oldemployee.propertyname
   if (ingredient.ingredientname != oldingredient.ingredientname) {
      updates = updates + "Ingredient Name is Changed " + oldingredient.ingredientname + " into " + ingredient.ingredientname + "\n";
   }

   if (ingredient.unitofmeasurment != oldingredient.unitofmeasurment) {
      updates = updates + "Ingredient Name is Changed " + oldingredient.unitofmeasurment + " into " + ingredient.unitofmeasurment + "\n";
   }

   if (ingredient.costperunit != oldingredient.costperunit) {
      updates = updates + "Ingredient Name is Changed " + oldingredient.costperunit + " into " + ingredient.costperunit + "\n";
   }

   if (ingredient.ingredientstatus_id.name != oldingredient.ingredientstatus_id.name) {
      updates = updates + "Ingredient Name is Changed " + oldingredient.ingredientstatus_id.name + " into " + ingredient.ingredientstatus_id.name + "\n";
   }

   if (ingredient.note != oldingredient.note) {
      updates = updates + "Ingredient Name is Changed " + oldingredient.note + " into " + ingredient.note + "\n";
   }


   return updates;
}


//define function for employee record
const buttonIngredientUpdate = () => {
   console.log("update");
   console.log(ingredient);
   console.log(oldingredient);

   //check form error
   let errors = checkFormError();
   if (errors == "") {

      //check form update
      let updates = checkFormUpdate();
      //it means as updates thiyenawa....
      if (updates != "") {
         //user confiramtion
         let userConfirm = confirm(updates + "\n Are you sure to update above changes........!"); //following changes...
         if (userConfirm) {
            //call put service is checked if its true 

            let serverResponce = ajaxRequestBody("/ingredient", "PUT", ingredient)
            //check put serviceresponse

            if (serverResponce == "OK") {
               alert("Update Successfully.....!");

               refreshIngredientTable(); //table reset
               formingredient.reset(); // form reset
               refreshIngredientForm();  //dynamic elemet reset

               //offcanvas close 
               $('#offcanvasTop').offcanvas('hide');

            } else {
               alert("Fail to update changes....! \n" + serverResponce);
            }
         }

      } else {
         alert("Nothing Updated....!");
      }
   } else {
      alert("Form Has Following Errors....! \n" + errors);
   }
}
const checkFormError = () => {
   let errors = '';

   if (ingredient.ingredientname == null) {
      textingredientName.classList.add('is-invalid');
      textingredientName.classList.remove('is-valid');
      errors = errors + "Ingredient Name Can't Be Blank...! \n";
   }

   if (ingredient.costperunit == null) {
      textCostPerUnit.classList.add('is-invalid');
      textCostPerUnit.classList.remove('is-valid');
      errors = errors + "Cost per Unit Can't Be Blank....! \n";
   }

   if (ingredient.ingredientstatus_id == null) {
      selectIngredientStatus.classList.add('is-invalid');
      selectIngredientStatus.classList.remove('is-valid');
      errors = errors + "Enter Proper Ingredient Status....! \n";
   }

   return errors;
}

//define function for submit customer
const submitIngredient = () => {

   //need to check error
   const errors = checkFormError();
   if (errors == '') {
      //need to get user confirmation
      let userConfirm = window.confirm('Are You Sure To Add Following Ingredient..... \n'

         + '\n Ingredient Name is : ' + ingredient.ingredientname
         + '\n Cost per Unit is : ' + ingredient.costperunit);

      if (userConfirm) {
         let serverResponce = ajaxRequestBody("/ingredient", "POST", ingredient);

         if (serverResponce == 'OK') {
            alert('Saved Successfully.... :)');

            refreshIngredientTable(); //table reset
            formingredient.reset(); // form reset
            refreshIngredientForm();  //dynamic elemet reset

            //offcanvas close 
            $('#offcanvasTop').offcanvas('hide');

         } else {
            alert('Save Not Sucessfully Completed...! have Some Errors \n' + serverResponce);
         }
      }

   } else {
      alert("Forms Contains Errors.. :) \n\n" + errors);
   }

}