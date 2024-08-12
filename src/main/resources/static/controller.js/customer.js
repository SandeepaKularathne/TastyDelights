
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
   userPrivilege = ajaxGetRequest("/privilege/bylogedusermodule/Customer");
  //privilege object eka global kara hamathanama use karanna oneh nissa 

   //tooltip unable
   $('[ data-bs-toggle="tooltip" ]').tooltip();

   //here calling the refresh function when the browswer is loading 
   refreshCustomerTable();

   //calling the form refresh function 
   refreshCustomerForm();

   // customer = new Object();
});

const refreshCustomerTable = () => {


   customers = ajaxGetRequest("/customer/findall");

   //text -----> string,number,data
   //function -----> object,array,boolean
   //column count = object count

   const displayPropertyList = [
      { property: 'cusno', datatype: 'string' }, { property: 'firstname', datatype: 'string' },
      { property: 'email', datatype: 'string' }, { property: 'mobile', datatype: 'string' },
      { property: 'address', datatype: 'string' }, { property: getCustomerStatus, datatype: 'function' }

   ];
   //call function fill data into table. this is an reusbale function 

   //(tableId,dataList,displayPropertyList, refillfunction name, delete function name, print function name, buttonvisibility)
   fillDataIntoTable(tableCustomer, customers, displayPropertyList,deleteDisableFunction, true , userPrivilege);

   divModify.classList.add('d-none'); //radio button functoin 

   divstatus.classList.add('d-none');

   //link for table search and sort item
   $("#tableCustomer").dataTable();

}

const deleteDisableFunction = (ob) => {  
   //record eka delete unama eka disbale krannai use karnnne ----> disable delete button 
   if (ob.customerstatus_id.name == "In-Active") {
      btnTableDelete.disabled = "disabled";
      
   }

   if (ob.customerstatus_id.name == "Active") {
      btnTableDelete.disabled = "";
   
   }
}

// form Refresh Function
const refreshCustomerForm = () => {
   // by creating an object its easy to connect the datas directly with backend 
   customer = new Object();

   customerStatuses = ajaxGetRequest("/customerstatus/findall");
   fillDataIntoSelect(selectCustomerStatus, 'Select Customer Status........!', customerStatuses, 'name',"Active");
   customer.customerstatus_id = JSON.parse(selectCustomerStatus.value); //meken html define karapu validator eka block welaa api asign karapu value eka penawa


   let mindate = new Date();
   let maxdate = new Date();

   let minMonth = mindate.getMonth();
   if (minMonth < 10) {
      minMonth = '0' + minMonth;
   }
   let minDaY = mindate.getDay();
   if (minDaY < 10) {
      minDaY = '0' + minDaY;
   }

   mindate.setFullYear(mindate.getFullYear() - 60);

   textdob.min = mindate.getFullYear() + '-' + minMonth + '-' + minDaY;

   let maxMonth = maxdate.getMonth();
   if (maxMonth < 10) {
      maxMonth = '0' + maxMonth;

   }
   let maxDaY = maxdate.getDay();
   if (maxDaY < 10) {
      maxDaY = '0' + maxDaY;
   }

   maxdate.setFullYear(maxdate.getFullYear() - 18);

   textdob.max = maxdate.getFullYear() + '-' + maxMonth + '-' + maxDaY;

   //need to emplty all elemnts
   textfirstName.value = '';
   //   textLastname.value = '';
   textlastName.value = '';
   textEmail.value = '';
   textContactNo.value = '';
   textAddress.value = '';
   textdob.value = '';
   // selectCustomerStatus.value = '';
   textnote.value = '';


   //need to set default color
   textfirstName.style.border = '1px solid #ced4da';
   // textLastname.style.border = '1px solid #ced4da';
   textlastName.style.border = '1px solid #ced4da';
   textEmail.style.border = '1px solid #ced4da';
   textContactNo.style.border = '1px solid #ced4da';
   textAddress.style.border = '1px solid #ced4da';
   textdob.style.border = '1px solid #ced4da';
   textnote.style.border = '1px solid #ced4da';
   selectCustomerStatus.style.border = '2px dashed green';
   selectCustomerStatus.style.color = 'green';

   textfirstName.classList.remove("is-valid");
   //  textLastname.classList.remove("is-valid");
   textlastName.classList.remove("is-valid");
   textEmail.classList.remove("is-valid");
   textContactNo.classList.remove("is-valid");
   textAddress.classList.remove("is-valid");
   textdob.classList.remove("is-valid");
   textnote.classList.remove("is-valid");
   selectCustomerStatus.classList.add("is-valid");

   btnUpdateCustomer.disabled = "disabled";
   // btnUpdateEmployee.style.cursor = "not-allowed";
   $("#btnUpdateCustomer").css("cursor" , "not-allowed");


   if (userPrivilege.insert) {
      btnAddCustomer.disabled = "";
      $("#btnAddCustomer").css("cursor", "pointer");
      
   } else {
      btnAddCustomer.disabled = "disabled";
      $("#btnAddCustomer").css("cursor", "not-allowed");
      
   }

}



const getCustomerStatus = (ob) => {


   if (ob.customerstatus_id.name == 'Active') {
      return '<p class = "button-active">' + ob.customerstatus_id.name + '</p>';
   }
   if (ob.customerstatus_id.name == 'In-Active') {
      return '<p class = "button-inactive">' + ob.customerstatus_id.name + '</p>';
   }

}


// function for edit customer record 
const refillCustomerForm = (ob, rowindex) => {

   console.log("edit");

   //we are comparing the newly updates customer object and old cutsomer object before update it 

   customer = JSON.parse(JSON.stringify(ob)); // updated customer
   oldcustomer = JSON.parse(JSON.stringify(ob));

   //offcanvas open
   $('#offcanvasTop').offcanvas('show');

   divstatus.classList.remove('d-none');
   

   //set Value into static element
   //elementid.value = ob.relevantProertyname

   textfirstName.value = ob.firstname;
   textlastName.value = ob.lastname;
   textEmail.value = ob.email;
   textContactNo.value = ob.mobile;
   textdob.value = ob.dob;
   textAddress.value = ob.address;

   //optional field 
   if (customer.note != null)
      textnote.value = ob.note; else textnote.value = "";

   //object eeken illaganawa property ekai eyage type ekai 
   fillDataIntoSelect(selectCustomerStatus, 'Select Customer....!', customerStatuses, 'name', customer.customerstatus_id.name);
   // name ----> final property      
   //final propert ekai display property ekai equal wenna oneh 

   
   if (userPrivilege.update) {
      btnUpdateCustomer.disabled = "";
      $("#btnUpdateCustomer").css("cursor" , "pointer");
      
   } else {
      btnUpdateCustomer.disabled = "disabled";
   // btnUpdateEmployee.style.cursor = "not-allowed";
   $("#btnUpdateCustomer").css("cursor" , "not-allowed");

      
   }
   btnAddCustomer.disabled = "disabled";
   $("#btnAddCustomer").css("cursor" , "not-allowed");

  
}


const checkFormUpdate = () => {
   let updates = "";

   //changes apply wenne employee ekata. propertyname != Oldemployee.propertyname

   if (customer.firstname != oldcustomer.firstname) {
      updates = updates + "First Name is Changed " + oldcustomer.firstname + "into" + customer.firstname + "\n";
   }

   if (customer.lastname != oldcustomer.lastname) {
      updates = updates + "Last Name is Changed " + oldcustomer.lastname + "into" + customer.lastname + "\n";
   }

   if (customer.email != oldcustomer.email) {
      updates = updates + "Email is Changed " + oldcustomer.email + "into" + customer.email + "\n";
   }

   if (customer.mobile != oldcustomer.mobile) {
      updates = updates + "Mobile is Changed " + oldcustomer.mobile + "into" + customer.mobile + "\n";
   }

   if (customer.dob != oldcustomer.dob) {
      updates = updates + "Date of Birth is Changed " + oldcustomer.dob + "into" + customer.dob + "\n";
   }

   if (customer.address != oldcustomer.address) {
      updates = updates + "Address is Changed " + oldcustomer.address + "into" + customer.address + "\n";
   }

   if (customer.city != oldcustomer.city) {
      updates = updates + "City is Changed " + oldcustomer.city + "into" + customer.city + "\n";
   }

   if (customer.note != oldcustomer.note) {
      updates = updates + "Note is Changed " + oldcustomer.note + "into" + customer.note + "\n";
   }
   if (customer.customerstatus_id.id != oldcustomer.customerstatus_id.id) {
      updates = updates + "Customer Status is Changed " + oldcustomer.customerstatus_id.id + "into" + customer.customerstatus_id.id + "\n";
   }

   return updates;
}


const buttonCustomerUpdate = () => {
   console.log("update");
   console.log(customer);
   console.log(oldcustomer);

   let errors = checkFormError();
   if (errors == "") {

      //check form update
      let updates = checkFormUpdate();
      //it means as updates thiyenawa....
      if (updates != "") {
         //user confirmation
         let userConfirm = confirm(updates + "\n Are you sure to update above changes........!"); //following changes tikka karanna onehda ...

         if (userConfirm) {
            //call put service is checked if its true 

            let serverResponce = ajaxRequestBody("/customer", "PUT", customer)
            //check put serviceresponse

            if (serverResponce == "OK") {
               alert("Update Successfully.....!");

               refreshCustomerTable(); //table reset
               formcustomer.reset(); // form reset
               refreshCustomerForm(); //dynamic elemet reset

               //offcanvas close 
               $('#offcanvasTop').offcanvas('hide');

            } else {
               alert("Fail to update changes....! \n" + serverResponce);
            }

         }

      }
   }

}


// here if we use the elemet the size of the data is high also if we use an id as obid it will be array its hard to catch in an order so its better to use index of a row 
const deleteCustomer = (ob, rowindex) => {

   customer = ob;
   // const userConfirm = confirm('Are You Sure to delete the following Customer details \n'+ customers[rowindex].firstName);
   const userConfirm = confirm('Are You Sure To Delete Following Customer...? \n'
      + '\n Customer ID is : ' + ob.cusno
      + '\n First Name is : ' + ob.firstname
      + '\n Email is : ' + ob.email
      + '\n Mobile is : ' + ob.mobile);

   if (userConfirm) {

      let serverResponce = ajaxRequestBody("/customer", "DELETE", customer);

      //call delete services 

      if (serverResponce == 'OK') {
         alert('Delete Successfully....! ');

         refreshCustomerTable(); //table reset
         formcustomer.reset(); // form reset
         refreshCustomerForm(); //dynamic elemet reset

      } else {
         alert('Delete not completed, you have following error \n' + serverResponce);
      }

   }
}

//create  function for print customer record
const printCustomer = (ob, rowIndex) => {

      //need to get full object of a row
      const customerPrint = ob;

                          //tableid.1th child ge length eka ganawa
      for (let i = 0; i < tableCustomer.children[1].children.length; i++) {
         tableCustomer.children[1].children[i].style.backgroundColor = 'white';
      }
      //tableid
      tableCustomer.children[1].children[rowIndex].style.backgroundColor = 'pink';

      tdNum.innerText = customerPrint.cusno;
      tdFirstname.innerText = customerPrint.firstname;
      tdEmail.innerText = customerPrint.email;
      tdMobile.innerText = customerPrint.mobile;
      tdAddress.innerText = customerPrint.address;
      tdCustomerStatus.innerText = customerPrint.customerstatus_id.name;
     

      
   /* ----------------------------------  Option 1 ----> new tab eke open wela print karana tikka preview balanawa -------*/

   // tdFullname.innerText = employeePrint.fullname;
   // tdCallingname.innerText = employeePrint.callingname;
   // tdNic.innerText = employeePrint.nic;
   // tdStatus.innerText = employeePrint.employeestatus_id.name;

   //     const newTab = window.open();
   //     newTab.document.write(
   //         '<head><title>Print Customer</title>' +
   //         '<link rel="stylesheet" href="resources/bootstrap-5.3.2/css/bootstrap.' +
   //         'min.css">'+
   //         '</head>' +
   //         '<h2 style="margin-top: 100px">Customer Detail</h2>' +

   //     printEmployeeTable.outerHTML +  //this one is written under the html part
   //         '<script>printEmployeeTable.removeAttribute("style");</script>'
   // );

   // This is a time interval - anith paththa open wela mili second 1000k giyata passe thamai
   // function eka athula execute wenne
   // time out handler function eka run wenne mili second gana giyata passe
   //     setInterval(
   //         function () {
   //             newTab.print();
   //         } , 1000
   //     )

   
    //option 2
    $('#modalPrintCustomer').modal('show');

    //need to refresh table
    //refreshEmployeeTable();

}


const PrintCustomerTableButton = () => {
   newTab = window.open();
   newTab.document.write(
       '<head><title>Print Customer</title>' +
       '<link rel="stylesheet" href="resources/bootstrap-5.3.2/css/bootstrap.' +
       'min.css">'+
       '</head>' +
       '<h2 style="margin-top: 100px">Customer Detail</h2>' +
      PrintCustomerTable.outerHTML
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
   refreshCustomerTable();

   //need to hide modal
   $('#modalPrintCustomer').modal('hide');
}

//create function for print employee table
const printCustomerFullTable = () => {
   const newTab = window.open();
   newTab.document.write(
       '<head><title>Print Customer</title>' +
       ' <script src="\script\jQuery.js"></script>' +
       '<link rel="stylesheet" href="resources/bootstrap-5.3.2/css/bootstrap.' +
       'min.css">'+
       '</head>' +
       '<h2 style="margin-top: 100px">Customer Details</h2>' +
       tableCustomer.outerHTML +
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


const checkFormError = () => {
   let errors = '';

   if (customer.firstname == null) {
      textfirstName.classList.add('is-invalid');
      textfirstName.classList.remove('is-valid');
      errors = errors + "First Name Can't Be Blank...! \n";
   }

   if (customer.lastname == null) {
      textlastName.classList.add('is-invalid');
      textlastName.classList.remove('is-valid');
      errors = errors + "Last Name Can't Be Blank...! \n";
   }

   if (customer.email == null) {
      textEmail.classList.add('is-invalid');
      textEmail.classList.remove('is-valid');
      errors = errors + "Expecting a  Valid E-mail Address....! \n";
   }

   if (customer.mobile == null) {
      textContactNo.classList.add('is-invalid');
      textContactNo.classList.remove('is-valid');
      errors = errors + "Enter Valid Mobile Number....! \n";
   }

   if (customer.address == null) {
      textAddress.classList.add('is-invalid');
      textAddress.classList.remove('is-valid');
      errors = errors + "Enter Proper Address....! \n";
   }

   if (customer.dob == null) {
      textdob.classList.add('is-invalid');
      textdob.classList.remove('is-valid');
      errors = errors + "Enter Valid Date ....! \n";
   }

   if (customer.customerstatus_id == null) {
      selectCustomerStatus.classList.add('is-invalid');
      selectCustomerStatus.classList.remove('is-valid');
      errors = errors + "Select Customer Status....! \n";
   }


   return errors;
}

//define function for submit customer
const submitCustomer = () => {

   //need to check error
   const errors = checkFormError();
   if (errors == '') {
      //need to get user confirmation
      let userConfirm = window.confirm('Are You Sure To Add Following Customer..... \n'
         + '\n First Name is : ' + customer.firstname
         + '\n Last Name is : ' + customer.lastname
         + '\n Email is : ' + customer.email
         + '\n Contact Number is : ' + customer.mobile);

      if (userConfirm) {

         //function predefined in common js for post put delete method
         let serverResponce = ajaxRequestBody("/customer", "POST", customer);

         if (serverResponce == 'OK') {
            alert('Saved Successfully.... :)');

            refreshCustomerTable(); //table reset
            formcustomer.reset(); // form reset
            refreshCustomerForm(); //dynamic elemet reset


            //offcanvas close 
            $('#offcanvasTop').offcanvas('hide');


         } else {
            alert('Save Not Sucessfully Completed...! have Some Errors \n' + serverResponce);
         }
      }

   } else {
      alert("Forms Contains Errors.. :( \n\n" + errors);
   }

}