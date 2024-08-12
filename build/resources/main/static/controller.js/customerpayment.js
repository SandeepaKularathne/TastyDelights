
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
   userPrivilege = ajaxGetRequest("/privilege/bylogedusermodule/Customer  Payment");
   //privilege object eka global kara hamathanama use karanna oneh nissa 


   //tooltip unable
   $('[ data-bs-toggle="tooltip" ]').tooltip();

   //here calling the refresh function when the browswer is loading 
   refreshCusPaymentTable();

   //calling the form refresh function 
   refreshCusPaymentForm();

   selectCustomer.addEventListener('change', event => {

      corderList = ajaxGetRequest("/customerorder/listbycorder/" + JSON.parse(selectCustomer.value).id);
      fillDataIntoSelect(selectCOrder, "Select Customer Order", corderList, "customerorder_code");
  
   })

});

const refreshCusPaymentTable = () => {



   cuspayments = ajaxGetRequest("/customerpayment/findall");

   //text -----> string,number,data
   //function -----> object,array,boolean
   //column count = object count

   const displayPropertyList = [
      { property: 'billno', datatype: 'string' },
      { property: getCustomer, datatype: 'function' },
      { property: getCOrder, datatype: 'function' },
      { property: 'totalamount', datatype: 'string' },
      { property: 'paidamount', datatype: 'string' },
      { property: 'balanceamount', datatype: 'string' },
      { property: getPaymentMethod, datatype: 'function' }
   ];

   //call function fill data into table. this is an reusbale function 

   //(tableId,dataList,displayPropertyList, refillfunction name, delete function name, print function name, buttonvisibility)
   fillDataIntoTable2(tableCusPayment, cuspayments, displayPropertyList, true, userPrivilege);

   divModify.classList.add('d-none');

   //link for table search and sort item
   $("#tableCusPayment").dataTable();


}

// form Refresh Function
const refreshCusPaymentForm = () => {
   // by creating an object its easy to connect the datas directly with backend 
   cuspayment = new Object();

   selectCOrder.addEventListener('change', event => {
      
     textTotalAmount.value = JSON.parse(selectCOrder.value).totalamount;
     cuspayment.totalamount = textTotalAmount.value;
     textTotalAmount.style.border = "2px dashed green";
     textTotalAmount.classList.add("is-valid");

   })



   customerList = ajaxGetRequest("/customer/list");
   fillDataIntoSelect2(selectCustomer, "Select Customer", customerList, "firstname" , "mobile");
   
   paymentmethods = ajaxGetRequest("/cuspaymethod/findall");
   fillDataIntoSelect(textPaymentMethod, 'Select Payment...!', paymentmethods, 'name');

 
   //need to empty all elements
   selectCustomer.value = '';
   selectCOrder.value = '';
   textTotalAmount.value = '';
   textPaidAmount.value = '';
   textBalanceAmount.value = '';
   textPaymentMethod.value = '';
   texttransactionno.value = '';
   texttransacdate.value = '';
   textnote.value = '';


   selectCustomer.style.border = '1px solid #ced4da';
   selectCOrder.style.border = '1px solid #ced4da';
   textTotalAmount.style.border = '1px solid #ced4da';
   textPaidAmount.style.border = '1px solid #ced4da';
   textBalanceAmount.style.border = '1px solid #ced4da';
   textPaymentMethod.style.border = '1px solid #ced4da';
   texttransactionno.style.border = '1px solid #ced4da';
   texttransacdate.style.border = '1px solid #ced4da';
   textnote.style.border = '1px solid #ced4da';

   selectCustomer.style.color = 'black';
   selectCOrder.style.color = 'black';
   textPaymentMethod.style.color = 'black';


   selectCustomer.classList.remove("is-valid");
   selectCOrder.classList.remove("is-valid");
   textTotalAmount.classList.remove("is-valid");
   textPaidAmount.classList.remove("is-valid");
   textBalanceAmount.classList.remove("is-valid");
   textPaymentMethod.classList.remove("is-valid");
   texttransactionno.classList.remove("is-valid");
   texttransacdate.classList.remove("is-valid");
   textnote.classList.remove("is-valid");

   btnUpdateCusPay.disabled = "disabled";
   // btnUpdateCusPay.style.cursor = "not-allowed";
   $("#btnUpdateCusPay").css("cursor" , "not-allowed");


   if (userPrivilege.insert) {
      btnAddCusPay.disabled = "";
      $("#btnAddCusPay").css("cursor", "pointer");
      
   } else {
      btnAddCusPay.disabled = "disabled";
      $("#btnAddCusPay").css("cursor", "not-allowed");
      
   }

}


const calculateBalanceAmount = () => {

   if (new RegExp("^([0-9]{3,5}[.][0-9]{2})|([0-9]{3,5})$").test(textPaidAmount.value)) {
      textBalanceAmount.value = (parseFloat(textTotalAmount.value) - parseFloat(textPaidAmount.value)).toFixed(2);
      textBalanceAmount.style.border = "2px dashed green";
      textBalanceAmount.classList.add("is-valid");
      textPaidAmount.style.border = "2px dashed green";
      textPaidAmount.classList.add("is-valid");
      cuspayment.paidamount = textPaidAmount.value;
      cuspayment.balanceamount = textBalanceAmount.value;


   } else {
      textPaidAmount.style.border = "2px dashed red";
      textBalanceAmount.value = "";
      cuspayment.paidamount = null;
      cuspayment.balanceamount = null

   }


}

const getCustomer = (ob) => {

   return ob.customer_id.firstname;
}


const getCOrder = (ob) => {
   return ob.customerorder_id.customerorder_code;

}


const getPaymentMethod = (ob) => {
   return ob.cus_payment_method_id.name;

}


const PaymentMethodChangeEvent = () => {
   let paymentMethodSelect = document.getElementById('textPaymentMethod');

   let onlineTransactionFields = document.getElementById('onlineTransactionFields');


   if (JSON.parse(paymentMethodSelect.value).name === 'Online Transaction') {
      onlineTransactionFields.classList.remove('d-none');
   } else {
      onlineTransactionFields.classList.add('d-none');
   }

}


//create  function for print customer record
const printCusPayment = (ob, rowIndex) => {
      //need to get full object of a row
      const cuspayPrint = ob;

      //tableid.1th child ge length eka ganawa
for (let i = 0; i < tableCusPayment.children[1].children.length; i++) {
tableCusPayment.children[1].children[i].style.backgroundColor = 'white';
}
//tableid
tableCusPayment.children[1].children[rowIndex].style.backgroundColor = 'pink';

tdNum.innerText = cuspayPrint.billno;
tdCustomer.innerText = cuspayPrint.customer_id.firstname;
tdCustomerOrder.innerText = cuspayPrint.customerorder_id.customerorder_code;
tdTotalAmount.innerText = cuspayPrint.totalamount;
tdPaidAmount.innerText = cuspayPrint.paidamount;
tdBalanceAmount.innerText = cuspayPrint.balanceamount;
tdPaymentMethod.innerText = cuspayPrint.cus_payment_method_id.name;

   

$('#modalPrintCusPayment').modal('show');

//need to refresh table
//refreshEmployeeTable();
}

const PrintCusPaymentTableButton = () => {
   newTab = window.open();
   newTab.document.write(
       '<head><title>Print Customer Payment</title>' +
       '<link rel="stylesheet" href="resources/bootstrap-5.3.2/css/bootstrap.' +
       'min.css">'+
       '</head>' +
       '<h2 style="margin-top: 100px">Customer Payment Detail</h2>' +
       PrintCusPayTable.outerHTML
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
   refreshCusPaymentTable();

   //need to hide modal
   $('#modalPrintCusPayment').modal('hide');
}

//create function for print employee table
const printCusPaymentFullTable = () => {
   const newTab = window.open();
   newTab.document.write(
       '<head><title>Print Customer Payment</title>' +
       ' <script src="\script\jQuery.js"></script>' +
       '<link rel="stylesheet" href="resources/bootstrap-5.3.2/css/bootstrap.' +
       'min.css">'+
       '</head>' +
       '<h2 style="margin-top: 100px">Customer Payment Details</h2>' +
       PrintCusPayTable.outerHTML +
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

   if (cuspayment.customer_id == null) {
      selectCustomer.classList.add('is-invalid');
      selectCustomer.classList.remove('is-valid');
      errors = errors + "Select Customer ";
   }


   if (cuspayment.ingredientreceivenote_id == null) {
      selectCOrder.classList.add('is-invalid');
      selectCOrder.classList.remove('is-valid');
      errors = errors + "Select IRN";
   }


   if (cuspayment.paidamount == null) {
      textPaidAmount.classList.add('is-invalid');
      textPaidAmount.classList.remove('is-valid');
      errors = errors + "Enter Paid Amount";
   }

   if (cuspayment.sup_payment_method_id == null) {
      textPaymentMethod.classList.add('is-invalid');
      textPaymentMethod.classList.remove('is-valid');
      errors = errors + "Select Payment Method";
   }

   return errors;
}


//define function for submit customer
const submitCusPayment = () => {

   //need to check error
   const errors = checkFormError();
   if (errors == '') {
      //need to get user confirmation
      let userConfirm = window.confirm('Are You Sure To Add Following Payment Details..... \n'
         + '\n Customer  Name is : ' + cuspayment.customer_id.firstname
         + '\n Customer Order is : ' + cuspayment.customerorder_id.customerorder_code);

      if (userConfirm) {

         //function predefined in common js for post put delete method
         let serverResponce = ajaxRequestBody("/customerpayment", "POST", cuspayment);



         if (serverResponce == 'OK') {
            alert('Saved Successfully.... :)');

            refreshCusPaymentTable(); //table reset
            formcuspayment.reset(); // form reset
            refreshCusPaymentForm(); //dynamic elemet reset

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



