
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

   //tooltip unable
   $('[ data-bs-toggle="tooltip" ]').tooltip();

   //module name in module table should be same 
   userPrivilege = ajaxGetRequest("/privilege/bylogedusermodule/Employee");
   //privilege object eka global kara hamathanama use karanna oneh nissa 

   //here calling the refresh function when the browswer is loading 
   refreshEmployeeTable();

   //calling the form refresh function 
   refreshEmployeeForm();


   //create object

   //1.method
   //employee = {};

   //2.method
   // employee = new Object();

});

const refreshEmployeeTable = () => {

   employees = ajaxGetRequest("/employee/findall");

   //text -----> string,number,data
   //function -----> object,array,boolean
   //column count = object count

   const displayPropertyList = [
      { property: 'empno', datatype: 'string' },
      { property: 'fullname', datatype: 'string' },
      { property: getEmployeePhoto, datatype: 'function' },
      { property: 'nic', datatype: 'string' },
      { property: 'mobile', datatype: 'string' },
      { property: 'email', datatype: 'string' },
      { property: getDesignation, datatype: 'function' },
      { property: getEmployeeStatus, datatype: 'function' }];

   //call function fill data into table. this is an reusbale function 

   //(tableId,dataList,displayPropertyList, refillfunction name, delete function name, print function name, buttonvisibility, privilegeOb)
   fillDataIntoTable(tableEmployee, employees, displayPropertyList, deleteDisableFunction, true, userPrivilege);

   divModify.classList.add('d-none');

   divstatus.classList.add('d-none');

   //link for table search and sort item
   $("#tableEmployee").dataTable();

}

const deleteDisableFunction = (ob) => {
   //record eka delete unama eka disbale krannai use karnnne ----> disable delete button 
   if (ob.employeestatus_id.name == "Deleted") {
      btnTableDelete.disabled = "disabled";

   }

   if (ob.employeestatus_id.name == "Working") {
      btnTableDelete.disabled = "";

   }
}
// form Refresh Function
const refreshEmployeeForm = () => {
   // by creating an object its easy to connect the datas directly with backend 
   employee = new Object();

   designations = ajaxGetRequest("/designation/findall");

   fillDataIntoSelect(selectDesignation, 'Select Designation...!', designations, 'name');

   employeeStatuses = ajaxGetRequest("/employeestatus/findall");

   fillDataIntoSelect(selectEmployeeStatus, 'Select Employee Status....!', employeeStatuses, 'name', "Working");
   employee.employeestatus_id = JSON.parse(selectEmployeeStatus.value); //meken html define karapu validator eka block welaa api asign karapu value eka penawaa


   //need to empty all elements
   textfullName.value = '';
   textCallingName.value = '';
   textNameTitle.value = '';
   textnic.value = '';
   radioMale.classList.remove("is-valid");
   radioFemale.classList.remove("is-valid");
   txtdob.value = '';
   textMobile.value = '';
   textMobile2.value = '';
   textEmail.value = '';
   textaddress.value = '';
   textnote.value = '';
   selectCivilstatus.value = '';

   employee.design == null;
   fileProPhoto.files = null;
   imgProPhoto.src = "images/user/default.png";
   textfullName.value = "";

   //need to set default color
   textfullName.style.border = '1px solid #ced4da';
   textCallingName.style.border = '1px solid #ced4da';
   textNameTitle.style.border = '1px solid #ced4da';
   textnic.style.border = '1px solid #ced4da';
   radioMale.classList.remove("is-valid");
   radioFemale.classList.remove("is-valid");
   txtdob.style.border = '1px solid #ced4da';
   textMobile.style.border = '1px solid #ced4da';
   textMobile2.style.border = '1px solid #ced4da';
   textEmail.style.border = '1px solid #ced4da';
   textaddress.style.border = '1px solid #ced4da';
   textnote.style.border = '1px solid #ced4da';
   selectCivilstatus.style.border = '1px solid #ced4da';
   selectDesignation.style.border = '1px solid #ced4da';
   selectEmployeeStatus.style.border = '2px dashed green';
   selectEmployeeStatus.style.color = 'green';



   textfullName.classList.remove("is-valid");
   textCallingName.classList.remove("is-valid");
   textNameTitle.classList.remove("is-valid");
   textnic.classList.remove("is-valid");
   radioMale.classList.remove("is-valid");
   radioFemale.classList.remove("is-valid");
   txtdob.classList.remove("is-valid");
   textMobile.classList.remove("is-valid");
   textMobile2.classList.remove("is-valid");
   textEmail.classList.remove("is-valid");
   textaddress.classList.remove("is-valid");
   textnote.classList.remove("is-valid");
   selectCivilstatus.classList.remove("is-valid");
   selectDesignation.classList.remove("is-valid");
   selectEmployeeStatus.classList.add("is-valid");


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

   txtdob.min = mindate.getFullYear() + '-' + minMonth + '-' + minDaY;

   let maxMonth = maxdate.getMonth();
   if (maxMonth < 10) {
      maxMonth = '0' + maxMonth;

   }
   let maxDaY = maxdate.getDay();
   if (maxDaY < 10) {
      maxDaY = '0' + maxDaY;
   }

   maxdate.setFullYear(maxdate.getFullYear() - 18);

   txtdob.max = maxdate.getFullYear() + '-' + maxMonth + '-' + maxDaY;


   btnUpdateEmployee.disabled = "disabled";
   // btnUpdateEmployee.style.cursor = "not-allowed";
   $("#btnUpdateEmployee").css("cursor", "not-allowed");


   if (userPrivilege.insert) {
      btnAddEmployee.disabled = "";
      $("#btnAddEmployee").css("cursor", "pointer");

   } else {
      btnAddEmployee.disabled = "disabled";
      $("#btnAddEmployee").css("cursor", "not-allowed");

   }


}

const getEmployeePhoto = (ob) => {
   if (ob.design == null) {
      return "<img src='images/user/default.png' style='width:50px;height:50px'>";
  }
  else {
      return "<img style='width:50px;height:50px' src='"+atob(ob.design)+"'>";

  }

}

const getDesignation = (ob) => {

   return ob.designation_id.name;
}

//create function get employee status
const getEmployeeStatus = (ob) => {


   if (ob.employeestatus_id.name == 'Deleted') {
      return '<p class = "button-delete">' + ob.employeestatus_id.name + '</p>';
   }
   if (ob.employeestatus_id.name == 'Working') {
      return '<p class = "button-working">' + ob.employeestatus_id.name + '</p>';
   }
   if (ob.employeestatus_id.name == 'Resigned') {
      return '<p class = "button-resigned">' + ob.employeestatus_id.name + '</p>';
   }


}

// function for edit customer record 
const refillEmployeeForm = (ob, rowindex) => {

   employee = JSON.parse(JSON.stringify(ob));
   oldemployee = JSON.parse(JSON.stringify(ob));

   //offcanvas open
   $('#offcanvasTop').offcanvas('show');

   divstatus.classList.remove('d-none');


   //set Value into static element
   //elementid.value = ob.relevantProertyname
   textfullName.value = ob.fullname;
   textCallingName.value = ob.callingname;
   textnic.value = ob.nic;
   txtdob.value = ob.dob;
   textEmail.value = ob.email;
   textMobile.value = ob.mobile;
   textaddress.value = ob.address;
   selectCivilstatus.value = ob.civilstatus;

   //optional fields
   if (employee.landno != null)
      textMobile2.value = ob.mobile2; else textMobile2.value = "";

   if (employee.note != null)
      textnote.value = ob.note; else textnote.value = "";

   //set value into radio element
   if (ob.gender == "Male") {
      radioMale.checked = true;
   } else {
      radioFemale.checked = true;
   }

   //design refill
   
   if (employee.design == null) {
      imgProPhoto.src = "images/user/default.png";
      textProPhoto.value = "";
      
   } else {
      imgProPhoto.src = btoa(employee.design);
      textProPhoto.value = employee.designname;
      
   }


   //object eeken illaganawa property ekai eyage type ekai 
   fillDataIntoSelect(selectDesignation, 'Select Designation....!', designations, 'name', employee.designation_id.name);
   // name ----> final property      
   //final propert ekai display property ekai equal wenna oneh 

   fillDataIntoSelect(selectEmployeeStatus, 'Select Employee Status....!', employeeStatuses, 'name', employee.employeestatus_id.name);


   if (userPrivilege.update) {
      btnUpdateEmployee.disabled = "";
      $("#btnUpdateEmployee").css("cursor", "pointer");

   } else {
      btnUpdateEmployee.disabled = "disabled";
      // btnUpdateEmployee.style.cursor = "not-allowed";
      $("#btnUpdateEmployee").css("cursor", "not-allowed");


   }
   btnAddEmployee.disabled = "disabled";
   $("#btnAddEmployee").css("cursor", "not-allowed");


}


//define function for check form updates 
const checkFormUpdate = () => {
   let updates = "";
   //changes apply wenne employee ekata. propertyname != Oldemployee.propertyname
   if (employee.fullname != oldemployee.fullname) {
      updates = updates + "Full Name is Changed " + oldemployee.fullname + " into " + employee.fullname + "\n";
   }

   if (employee.callingname != oldemployee.callingname) {
      updates = updates + "Calling Name is Changed " + oldemployee.callingname + " into " + employee.callingname + "\n";
   }

   if (employee.nic != oldemployee.nic) {
      updates = updates + "NIC is Changed " + oldemployee.nic + " into " + employee.nic + "\n";
   }

   if (employee.gender != oldemployee.gender) {
      updates = updates + "Gender is Changed " + oldemployee.gender + " into " + employee.gender + "\n";
   }

   if (employee.dob != oldemployee.dob) {
      updates = updates + "Date of Birth is Changed " + oldemployee.dob + " into " + employee.dob + "\n";
   }

   if (employee.email != oldemployee.email) {
      updates = updates + "Email is Changed " + oldemployee.email + " into " + employee.email + "\n";
   }

   if (employee.mobile != oldemployee.mobile) {
      updates = updates + "Mobile is Changed " + oldemployee.mobile + " into " + employee.mobile + "\n";
   }

   if (employee.mobile2 != oldemployee.mobile2) {
      updates = updates + "Mobile2 is Changed " + oldemployee.mobile2 + " into " + employee.mobile2 + "\n";
   }
   
   if (employee.design != oldemployee.design) {
      updates = updates + "Design " + oldemployee.design + " is changed into " + employee.design + "\n";

   }

   if (employee.address != oldemployee.address) {
      updates = updates + "Address is Changed " + oldemployee.address + " into " + employee.address + "\n";
   }
   if (employee.note != oldemployee.note) {
      updates = updates + "Note is Changed " + oldemployee.note + " into " + employee.note + "\n";
   }

   if (employee.civilstatus != oldemployee.civilstatus) {
      updates = updates + "Civilstatus is Changed " + oldemployee.civilstatus + " into " + employee.civilstatus + "\n";
   }

   if (employee.designation_id.name != oldemployee.designation_id.name) {
      updates = updates + "Designation Id is Changed " + oldemployee.designation_id.name + " into " + employee.designation_id.name + "\n";
   }

   if (employee.employeestatus_id.name != oldemployee.employeestatus_id.name) {
      updates = updates + "EmployeeStatus " + oldemployee.employeestatus_id.name + " is changed into " + employee.employeestatus_id.name + "\n";
   }

   return updates;
}

//define function for employee record
const buttonEmployeeUpdate = () => {
   console.log("update");
   console.log(employee);
   console.log(oldemployee);

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

            let serverResponce = ajaxRequestBody("/employee", "PUT", employee)
            //check put serviceresponse

            if (serverResponce == "OK") {
               alert("Update Successfully.....!");

               refreshEmployeeTable(); //table reset
               formemployee.reset(); // form reset
               refreshEmployeeForm(); //dynamic elemet reset

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

// here if we use the elemet the size of the data is high also if we use an id as obid it will be array its hard to catch in an order so its better to use index of a row 
const deleteEmployee = (ob, rowindex) => {

   employee = ob;
   // const userConfirm = confirm('Are You Sure to delete the following Customer details \n'+ customers[rowindex].firstName);
   const userConfirm = confirm('Are You Sure To Delete Following Customer...? \n'
      + '\n Employee ID is : ' + ob.empno
      + '\n Full Name is : ' + ob.fullname
      + '\n Designation is : ' + ob.designation_id.name
      + '\n Mobile is : ' + ob.mobile);

   if (userConfirm) {

      let serverResponce = ajaxRequestBody("/employee", "DELETE", employee);

      //call delete services 

      if (serverResponce == 'OK') {
         alert('Delete Successfully....! ');

         refreshEmployeeTable(); //table reset
         formemployee.reset(); // form reset
         refreshEmployeeForm(); //dynamic elemet reset

      } else {
         alert('Delete not completed, you have following error \n' + serverResponce);
      }

   }
}

//create  function for print customer record
const printEmployee = (ob, rowIndex) => {

   //need to get full object of a row
   const employeePrint = ob;

   //tableid.1th child ge length eka ganawa
   for (let i = 0; i < tableEmployee.children[1].children.length; i++) {
      tableEmployee.children[1].children[i].style.backgroundColor = 'white';
   }
   //tableid
   tableEmployee.children[1].children[rowIndex].style.backgroundColor = 'pink';

   tdNum.innerText = employeePrint.empno;
   tdFullname.innerText = employeePrint.fullname;
   tdEmployeeImg.innerText = productPrint.design;
   tdNic.innerText = employeePrint.nic;
   tdMobile.innerText = employeePrint.mobile;
   tdEmail.innerText = employeePrint.email;
   tdDesignation.innerText = employeePrint.designation_id.name;
   tdStatus.innerText = employeePrint.employeestatus_id.name;


   /* ----------------------------------  Option 1 ----> new tab eke open wela print karana tikka preview balanawa -------*/

   // tdFullname.innerText = employeePrint.fullname;
   // tdCallingname.innerText = employeePrint.callingname;
   // tdNic.innerText = employeePrint.nic;
   // tdStatus.innerText = employeePrint.employeestatus_id.name;

   //     const newTab = window.open();
   //     newTab.document.write(
   //         '<head><title>Print Employee</title>' +
   //         '<link rel="stylesheet" href="resources/bootstrap-5.3.2/css/bootstrap.' +
   //         'min.css">'+
   //         '</head>' +
   //         '<h2 style="margin-top: 100px">Employee Detail</h2>' +

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
    $('#modalPrintEmployee').modal('show');

    //need to refresh table
    //refreshEmployeeTable();



}

const printEmployeeTableButton = () => {
   newTab = window.open();
   newTab.document.write(
       '<head><title>Print Employee</title>' +
       '<link rel="stylesheet" href="resources/bootstrap-5.3.2/css/bootstrap.' +
       'min.css">'+
       '</head>' +
       '<h2 style="margin-top: 100px">Employee Detail</h2>' +
   printEmployeeTable.outerHTML
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
   refreshEmployeeTable();

   //need to hide modal
   $('#modalPrintEmployee').modal('hide');
}

//create function for print employee table
const printEmployeeFullTable = () => {
   const newTab = window.open();
   newTab.document.write(
       '<head><title>Print Employee</title>' +
       ' <script src="\script\jQuery.js"></script>' +
       '<link rel="stylesheet" href="resources/bootstrap-5.3.2/css/bootstrap.' +
       'min.css">'+
       '</head>' +
       '<h2 style="margin-top: 100px">Employee Details</h2>' +
       tableEmployee.outerHTML +
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

   if (employee.fullname == null) {
      textfullName.classList.add('is-invalid');
      textfullName.classList.remove('is-valid');
      errors = errors + "Full Name Can't Be Blank";
   }

   if (employee.nic == null) {
      textnic.classList.add('is-invalid');
      textnic.classList.remove('is-valid');
      errors = errors + "Expecting a Valid NIC";
   }

   if (employee.dob == null) {
      txtdob.classList.add('is-invalid');
      txtdob.classList.remove('is-valid');
      errors = errors + "Please enter valid date of birth...!";
   }

 if (employee.gender == null){
        errors= errors + 'Please enter valid gender...! \n';
    }

   if (employee.mobile == null) {
      textMobile.classList.add('is-invalid');
      textMobile.classList.remove('is-valid');
      errors = errors + "Enter Valid Mobile Number";
   }

   if (employee.email == null) {
      textEmail.classList.add('is-invalid');
      textEmail.classList.remove('is-valid');
      errors = errors + "Expecting a Valid E-mail Address";
   }

   if (employee.address == null) {
      textaddress.classList.add('is-invalid');
      textaddress.classList.remove('is-valid');
      errors = errors + "Enter Proper Address";
   }

   if (employee.designation_id == null) {
      selectDesignation.classList.add('is-invalid');
      selectDesignation.classList.remove('is-valid');
      errors = errors + "Select Designation";
   }

   if (employee.civilstatus == null) {
      selectCivilstatus.classList.add('is-invalid');
      selectCivilstatus.classList.remove('is-valid');
      errors = errors + "Select Civil Status";
   }

   if (employee.employeestatus_id == null) {
      selectEmployeeStatus.classList.add('is-invalid');
      selectEmployeeStatus.classList.remove('is-valid');
      errors = errors + "Select Employee Status";
   }

   return errors;
}

//define function for submit customer
const submitEmployee = () => {

   //need to check error
   const errors = checkFormError();
   if (errors == '') {
      //need to get user confirmation
      let userConfirm = window.confirm('Are You Sure To Add Following Employee..... \n'
         + '\n First Name is : ' + employee.fullname
         + '\n NIC is : ' + employee.nic
         + '\n Email is : ' + employee.email
         + '\n Contact Number is : ' + employee.mobile);

      if (userConfirm) {

         //function predefined in common js for post put delete method
         let serverResponce = ajaxRequestBody("/employee", "POST", employee);



         if (serverResponce == 'OK') {
            alert('Saved Successfully.... :)');

            refreshEmployeeTable(); //table reset
            formemployee.reset(); // form reset
            refreshEmployeeForm(); //dynamic elemet reset

            //offcanvas close 
            $('#offcanvasTop').offcanvas('hide');

         } else {
            alert('Save Not Sucessfully Completed...! have Some Errors \n' + serverResponce);
         }
      }

   } else {
      alert("Forms Contains Errors.. :( \n" + errors);
   }

}

const buttonClearImage = () => {
   if (employee.design != null) {
      const userConfirm = confirm("Are you sure to reset employee image");
      if (userConfirm) {
         employee.design == null;
         fileProPhoto.files = null;
         imgProPhoto.src = "images/user/default.png";
         textproductName.value = "";
         
      }
      
   } else {
      employee.design == null;
      imgProPhoto.src = "images/user/default.png";
      textproductName.value = "";
      
   }
  
}


//define function for fullName validator and generate calling name list
const textFullNameValidator = (field, pattern) => {
   if (new RegExp(pattern).test(field.value)) {
      //valid
      field.classList.remove("is-invalid");
      field.classList.add("is-valid");


      field.style.border = '3px dashed green';
      field.style.color = 'green';
      employee.fullname = field.value;

      //generate calling name list
      dlNameParts.innerHTML = '';
      fullNamePartList = field.value.split(' ');

      fullNamePartList.forEach(element => {
         const fullNamePartOption = document.createElement('option');
         fullNamePartOption.value = element;
         dlNameParts.appendChild(fullNamePartOption);

      });
   } else {
      //invalid
      field.classList.remove('is-valid');
      field.classList.add('is-invalid');


      field.style.border = '3px dashed red';
      field.style.color = 'red';
      employee.fullname = null;
   }
}

//define function for validate calling name
const textCallingNameValidator = (field) => {
   const fieldValue = field.value;
   const extIndex = fullNamePartList.map(element => element).indexOf(fieldValue);

   if (extIndex != -1) {
      //valid
      field.classList.remove("is-invalid");
      field.classList.add("is-valid");


      field.style.border = '3px dashed green';
      field.style.color = 'green';
      employee.callingname = field.value;
   }
   else {
      field.classList.remove('is-valid');
      field.classList.add('is-invalid');


      field.style.border = '3px dashed red';
      field.style.color = 'red';
      employee.callingname = null;
   }
}
