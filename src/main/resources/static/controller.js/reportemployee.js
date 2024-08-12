
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
   userPrivilege = ajaxGetRequest("/privilege/bylogedusermodule/Employee");
   //privilege object eka global kara hamathanama use karanna oneh nissa 

   designations = ajaxGetRequest ("/designation/findall");
   fillDataIntoSelect(selectDesignation, 'Select Designation...!', designations, 'name');

   employeeStatuses = ajaxGetRequest ("/employeestatus/findall");
   fillDataIntoSelect(selectEmployeeStatus, 'Select Designation...!', employeeStatuses, 'name');

   employees = ajaxGetRequest("/reportdataworkingemployee");

   //here calling the refresh function when the browswer is loading 
   refreshEmployeeTable();

   
});

const generateReport = () => {                 //status, designation dekama dynamic values nissa json parse karala backend ekata yawanne 
   employees = ajaxGetRequest("/reportdataemployee?status=" +JSON.parse(selectEmployeeStatus.value).id+"&designation="+JSON.parse(selectDesignation.value).id);
   refreshEmployeeTable();

}

const refreshEmployeeTable = () => {
  
   //text -----> string,number,data
   //function -----> object,array,boolean
   //column count = object count

   const displayPropertyList = [
      { property: 'empno', datatype: 'string' }, 
      { property: 'fullname', datatype: 'string' },
      { property: 'nic', datatype: 'string' },
      { property: 'mobile', datatype: 'string' },
      { property: 'email', datatype: 'string' }, 
      { property: getDesignation, datatype: 'function' },
      { property: getEmployeeStatus, datatype: 'function' }];

   //call function fill data into table. this is an reusbale function 

   //(tableId,dataList,displayPropertyList, refillfunction name, delete function name, print function name, buttonvisibility, privilegeOb)
   fillDataIntoTable(tableEmployeeReport, employees, displayPropertyList,deleteDisableFunction, false, userPrivilege);

   // divModify.classList.add('d-none');

   //link for table search and sort item
   $("#tableEmployeeReport").dataTable();

}

const deleteDisableFunction = () => {

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

const printEmployeeReport = (ob,rowIndex)=>{
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






