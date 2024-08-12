
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
   userPrivilege = ajaxGetRequest("/privilege/bylogedusermodule/Purchase Order");
   //privilege object eka global kara hamathanama use karanna oneh nissa 

   supplierList = ajaxGetRequest("/supplier/list");
   fillDataIntoSelect(selectSupplier, "Select Supplier", supplierList, 'suppliername');

   purchaseorderstatuses = ajaxGetRequest("/purchaseorderstatus/findall");
   fillDataIntoSelect(selectPOrderStatus,'Select Purchase Order Status....!', purchaseorderstatuses,'name');

   purchaseorders = ajaxGetRequest("/reportdatareqporder");

   //here calling the refresh function when the browswer is loading 
   refreshPurchaseOrderTable();


});

const generateReport = () => {
   console.log("selectPOrderStatus.value:", selectPOrderStatus.value);
   console.log("selectSupplier.value:", selectSupplier.value);

   purchaseorders = ajaxGetRequest("/reportdataporder?status="+JSON.parse(selectPOrderStatus.value).id+"&sid="+JSON.parse(selectSupplier.value).id);
   refreshPurchaseOrderTable();
}

const refreshPurchaseOrderTable = () => {

   //text -----> string,number,data
   //function -----> object,array,boolean
   //column count = object count

   const displayPropertyList = [
      { property: getSuppliername, datatype: 'function' },
      { property: 'requireddate', datatype: 'string' },
      { property: 'totalamount', datatype: 'string' },
      { property: getPurchaseOrderStatus, datatype: 'function' }];

   //call function fill data into table. this is an reusbale function 

   //(tableId,dataList,displayPropertyList, refillfunction name, delete function name, print function name, buttonvisibility)
   fillDataIntoTable(tablePOrderReport, purchaseorders, displayPropertyList, deleteDisableFunction, false, userPrivilege);

   //link for table search and sort item
   $("#tablePOrderReport").dataTable();

}

const deleteDisableFunction = (ob) => {
 
}


const getSuppliername = (ob) => {

   return ob.supplier_id;
}


//create function get porder status
const getPurchaseOrderStatus = (ob) => {


   if (ob.purchaseorderstatus_id.name == 'Requested') {
      return '<p class = "button-req">' + ob.purchaseorderstatus_id.name + '</p>';
   }
   if (ob.purchaseorderstatus_id.name == 'Recieved') {
      return '<p class = "button-received">' + ob.purchaseorderstatus_id.name + '</p>';
   }
   if (ob.purchaseorderstatus_id.name == 'Cancelled') {
      return '<p class = "button-cancel">' + ob.purchaseorderstatus_id.name + '</p>';
   }


}



//create  function for print customer record
const printPOrder = (ob, rowIndex) => {

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




