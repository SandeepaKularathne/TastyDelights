
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
   userPrivilege = ajaxGetRequest("/privilege/bylogedusermodule/Privilege");
   //privilege object eka global kara hamathanama use karanna oneh nissa 
  

   //tooltip unable
   $('[ data-bs-toggle="tooltip" ]').tooltip();

   //here calling the refresh function when the browswer is loading 
   refreshPrivilegeTable();

   //calling the form refresh function 
   refreshPrivilegeForm();


   //create object

   //1.method
   //employee = {};

   //2.method
   privilege = new Object();

  

});


const refreshPrivilegeTable = () => {

   privileges = ajaxGetRequest("/privilege/findall");

   //text -----> string,number,data
   //function -----> object,array,boolean
   //column count = object count

   const displayPropertyList = [
      { property: getRole, datatype: 'function' },
      { property: getModule, datatype: 'function' },
      { property: getSelect, datatype: 'function' },
      { property: getInsert, datatype: 'function' },
      { property: getUpdate, datatype: 'function' },
      { property: getDelete, datatype: 'function' }
   ];

   //call function fill data into table. this is an reusbale function 

   //(tableId,dataList,displayPropertyList, refillfunction name, delete function name, print function name, buttonvisibility)
   fillDataIntoTable2(tablePrivilege, privileges, displayPropertyList,true, userPrivilege);

   divModify.classList.add('d-none');

   //link for table search and sort item
   $("#tablePrivilege").dataTable();


}


//define function for filter module list by given role id 

const generateModuleList = () =>{
   //role value eka object form eke thiyena  json sting ekak widhihatai thiyenne so json.parse ekn liyala object eka pass karaal id eka illagana oneh 
modulesByRole = ajaxGetRequest("/module/listbyrole?roleid=" + JSON.parse(selectRole.value).id);
fillDataIntoSelect(selectModule,'Select Module',modulesByRole,'name');

 
selectModule.disabled = false;
}



// form Refresh Function
const refreshPrivilegeForm = () => {
   // by creating an object its easy to connect the datas directly with backend 
   privilege = new Object();

   //get data list for select element
   roles = ajaxGetRequest("/role/listwithoutadmin");
   fillDataIntoSelect(selectRole,'Select Role',roles,'name');
   selectRole.disabled = false

   modules = ajaxGetRequest("/module/list");
   fillDataIntoSelect(selectModule,'Select Module',modules,'name');selectModule.disabled = true;

   selectRole.style.border = '1px solid #ced4da';
   selectModule.style.border = '1px solid #ced4da';

   selectRole.style.color = 'black';
   selectModule.style.color = 'black';

   selectRole.classList.remove("is-valid");
   selectModule.classList.remove("is-valid");

   privilege.priv_sel = false;
   privilege.priv_ins = false;
   privilege.priv_upd = false;
   privilege.priv_del = false;

   labelCBSelect.innerText = "Not-Granted";
   labelCBInsert.innerText = "Not-Granted";
   labelCBUpdate.innerText = "Not-Granted";
   labelCBDelete.innerText = "Not-Granted";


     
   btnUpdatePrivilege.disabled = "disabled";
   // btnUpdatePrivilege.style.cursor = "not-allowed";
   $("#btnUpdatePrivilege").css("cursor" , "not-allowed");


   if (userPrivilege.insert) {
      btnAddPrivilege.disabled = "";
      $("#btnAddPrivilege").css("cursor", "pointer");
      
   } else {
      btnAddPrivilege.disabled = "disabled";
      $("#btnAddPrivilege").css("cursor", "not-allowed");
      
   }





}

//Role Name
const getRole = (ob) => {
   return ob.role_id.name;

}

//Module Name
const getModule = (ob) => {
   return ob.module_id.name;

}

//select Name
const getSelect = (ob) => {
   if(ob.priv_sel == true){
      return '<i class="fa-solid fa-user-check fa-fade" style="color: #04390f;"></i>';
     
   }else{
      return '<i class="fa-solid fa-user-xmark fa-fade" style="color: #d90808;"></i>';
     
   }

}

//insert name
const getInsert = (ob) => {
   if(ob.priv_ins){
      return '<i class="fa-solid fa-user-check fa-fade" style="color: #04390f;"></i>';
   }else{
      return '<i class="fa-solid fa-user-xmark fa-fade" style="color: #d90808;"></i>';
   }

}

//update name
const getUpdate = (ob) => {
   if(ob.priv_upd){
      return '<i class="fa-solid fa-user-check fa-fade" style="color: #04390f;"></i>';
   }else{
      return '<i class="fa-solid fa-user-xmark fa-fade" style="color: #d90808;"></i>';
   }

}

//delete name
const getDelete = (ob) => {
   if(ob.priv_del){
      return '<i class="fa-solid fa-user-check fa-fade" style="color: #04390f;"></i>';
   }else{
      return '<i class="fa-solid fa-user-xmark fa-fade" style="color: #d90808;"></i>';
   }

}

// function for edit customer record 
const refillPrivilegeForm = (ob,rowindex) => {

 //offcanvas open
 $('#offcanvasTop').offcanvas('show');
 
 privilege = JSON.parse(JSON.stringify(ob));
 oldprivilege = JSON.parse(JSON.stringify(ob));

 //get data list for select element
 roles = ajaxGetRequest("/role/list");
 fillDataIntoSelect(selectRole,'Select Role',roles,'name', privilege.role_id.name);
 selectRole.disabled = true;

 modules = ajaxGetRequest("/module/list");
 fillDataIntoSelect(selectModule,'Select Module',modules,'name',privilege.module_id.name);

 selectModule.disabled = true;

if(privilege.priv_sel){
   checkBoxselect.checked = true;
   labelCBSelect.innerText = "Granted";
}

if(privilege.priv_ins){
   checkBoxinsert.checked = true;
   labelCBInsert.innerText = "Granted";
}

if(privilege.priv_upd){
   checkBoxupdate.checked = true;
   labelCBUpdate.innerText = "Granted";
}

if(privilege.priv_del){
   checkBoxdelete.checked = true;
   labelCBDelete.innerText = "Granted";
}


if (userPrivilege.update) {
   btnUpdatePrivilege.disabled = "";
   $("#btnUpdatePrivilege").css("cursor" , "pointer");
   
} else {
   btnUpdatePrivilege.disabled = "disabled";
// btnUpdatePrivilege.style.cursor = "not-allowed";
$("#btnUpdatePrivilege").css("cursor" , "not-allowed");

   
}
btnAddPrivilege.disabled = "disabled";
$("#btnAddPrivilege").css("cursor" , "not-allowed");




}

//define function for check form updates 
const checkFormUpdate = () => {
   let updates = "";
   //changes apply wenne employee ekata. propertyname != Oldemployee.propertyname


   if (privilege.role_id.name != oldprivilege.role_id.name ) {
      updates = updates + "Role is Changed " + oldprivilege.role_id.name  + "into" + privilege.role_id.name  + "\n";
   }

   if (privilege.module_id.name != oldprivilege.module_id.name  ) {
      updates = updates + "Module is Changed " + oldprivilege.module_id.name  + "into" + privilege.module_id.name  + "\n";
   }




   return updates;
}


//define function for employee record
const buttonPrivilegeUpdate = () => {
   console.log("update");
   console.log(privilege);
   console.log(oldprivilege);

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

            let serverResponce = ajaxRequestBody("/privilege", "PUT", privilege)
            //check put serviceresponse

            if (serverResponce == "OK") {
               alert("Update Successfully.....!");

               refreshPrivilegeTable(); //table reset
               formprivilege.reset(); // form reset
               refreshPrivilegeForm(); //dynamic elemet reset

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
const deletePrivilege = (ob,rowindex) => {
       privilege = ob;

   // const userConfirm = confirm('Are You Sure to delete the following Customer details \n'+ customers[rowindex].firstName);
   const userConfirm = confirm('Are You Sure To Delete Following Privilege Record...? \n'
      + '\n Role  : ' + ob.role_id.name
      + '\n Module is : ' + ob.module_id.name
    );

   if (userConfirm) {
      //call delete services 
      let serverResponce = ajaxRequestBody("/privilege", "DELETE", privilege);
      if (serverResponce == 'OK') {
         alert('Delete Successfully.... :)');

         refreshPrivilegeTable();
         formprivilege.reset();
         refreshPrivilegeForm();

      } else {
         alert('Delete not completed, you have following error \n' + serverResponce);
      }
   }
}

const printPrivilege = () =>{
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

const checkFormError = () => {
   let errors = '';

   if (privilege.role_id == null) {
      selectRole.classList.add('is-invalid');
      selectRole.classList.remove('is-valid');
      errors = errors + "Select a Role \n";
   }

   if (privilege.module_id == null) {
      selectModule.classList.add('is-invalid');
      selectModule.classList.remove('is-valid');
      errors = errors + "Select a Module \n";
   }

   if (privilege.priv_sel == null) {
   /*   checkBoxselect.classList.add('is-invalid');
      checkBoxselect.classList.remove('is-valid');*/
      errors = errors + "Choose a Select Privilege \n";
   }

   if (privilege.priv_ins == null) {
    /*  checkBoxinsert.classList.add('is-invalid');
      checkBoxinsert.classList.remove('is-valid');*/
      errors = errors + "Choose an Insert Privilege \n";
   }

   if (privilege.priv_upd == null) {
      /*checkBoxupdate.classList.add('is-invalid');
      checkBoxupdate.classList.remove('is-valid');*/
      errors = errors + "Choose a Update Privilege \n";
   }

   if (privilege.priv_del == null) {
      /*checkBoxdelete.classList.add('is-invalid');
      checkBoxdelete.classList.remove('is-valid');*/
      errors = errors + "Choose a Delete Prvilege \n";
   }




   return errors;
}

//define function for submit customer
const submitPrivilege = () => {

   //need to check error
   const errors = checkFormError();
   if (errors == '') {
      //need to get user confirmation
      let userConfirm = window.confirm('Are You Sure To Add Following Privilege Record..... \n'
         + '\n Role is : ' + privilege.role_id.name
         + '\n Module is : ' + privilege.module_id.name
       );

      if (userConfirm) {

         //function predefined in common js for post put delete method
         let serverResponce = ajaxRequestBody("/privilege", "POST", privilege);

         if (serverResponce == 'OK') {
            alert('Saved Successfully.... :)');

            refreshPrivilegeTable();
            formprivilege.reset();
            refreshPrivilegeForm();

                
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
