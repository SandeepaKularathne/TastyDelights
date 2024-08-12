
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
   userPrivilege = ajaxGetRequest("/privilege/bylogedusermodule/Supplier Payment");
   //privilege object eka global kara hamathanama use karanna oneh nissa 


   //tooltip unable
   $('[ data-bs-toggle="tooltip" ]').tooltip();

   //here calling the refresh function when the browswer is loading 
   refreshSPaymentTable();

   //calling the form refresh function 
   refreshSPaymentForm();


   selectSupplier.addEventListener('change', event => {

      irnList = ajaxGetRequest("/irn/listbyirn/" + JSON.parse(selectSupplier.value).id);
      fillDataIntoSelect(selectIRNote, "Select IRN", irnList, "receivenote_no");
  
   })

});

const refreshSPaymentTable = () => {



   spayments = ajaxGetRequest("/supplierpayment/findall");

   //text -----> string,number,data
   //function -----> object,array,boolean
   //column count = object count

   const displayPropertyList = [
      { property: 'billno', datatype: 'string' },
      { property: getSupplier, datatype: 'function' },
      { property: getIRNote, datatype: 'function' },
      { property: 'totalamount', datatype: 'string' },
      { property: 'paidamount', datatype: 'string' },
      { property: 'balanceamount', datatype: 'string' },
      { property: getPaymentMethod, datatype: 'function' }
   ];

   //call function fill data into table. this is an reusbale function 

   //(tableId,dataList,displayPropertyList, refillfunction name, delete function name, print function name, buttonvisibility)
   fillDataIntoTable2(tableSPayment, spayments, displayPropertyList, true, userPrivilege);

   divModify.classList.add('d-none');

   //link for table search and sort item
   $("#tableSPayment").dataTable();


}

// form Refresh Function
const refreshSPaymentForm = () => {
   // by creating an object its easy to connect the datas directly with backend 
   spayment = new Object();

   selectIRNote.addEventListener('change', event => {
      
     textTotalAmount.value = JSON.parse(selectIRNote.value).total_amount;
     spayment.totalamount = textTotalAmount.value;
     textTotalAmount.style.border = "2px dashed green";
     textTotalAmount.classList.add("is-valid");

   })


   supplierList = ajaxGetRequest("/supplier/list");
   fillDataIntoSelect(selectSupplier, "Select Supplier", supplierList, "suppliername");

   paymentmethods = ajaxGetRequest("/suppaymethod/findall");

   fillDataIntoSelect(textPaymentMethod, 'Select Payment...!', paymentmethods, 'name');

 
   //need to empty all elements
   selectSupplier.value = '';
   selectIRNote.value = '';
   textTotalAmount.value = '';
   textPaidAmount.value = '';
   textBalanceAmount.value = '';
   textPaymentMethod.value = '';
   texttransactionno.value = '';
   texttransacdate.value = '';
   textnote.value = '';


   selectSupplier.style.border = '1px solid #ced4da';
   selectIRNote.style.border = '1px solid #ced4da';
   textTotalAmount.style.border = '1px solid #ced4da';
   textPaidAmount.style.border = '1px solid #ced4da';
   textBalanceAmount.style.border = '1px solid #ced4da';
   textPaymentMethod.style.border = '1px solid #ced4da';
   texttransactionno.style.border = '1px solid #ced4da';
   texttransacdate.style.border = '1px solid #ced4da';
   textnote.style.border = '1px solid #ced4da';

   selectSupplier.style.color = 'black';
   selectIRNote.style.color = 'black';
   textPaymentMethod.style.color = 'black';


   selectSupplier.classList.remove("is-valid");
   selectIRNote.classList.remove("is-valid");
   textTotalAmount.classList.remove("is-valid");
   textPaidAmount.classList.remove("is-valid");
   textBalanceAmount.classList.remove("is-valid");
   textPaymentMethod.classList.remove("is-valid");
   texttransactionno.classList.remove("is-valid");
   texttransacdate.classList.remove("is-valid");
   textnote.classList.remove("is-valid");

   btnUpdateSupPay.disabled = "disabled";
   // btnUpdateEmployee.style.cursor = "not-allowed";
   $("#btnUpdateSupPay").css("cursor" , "not-allowed");


   if (userPrivilege.insert) {
      btnAddSupPay.disabled = "";
      $("#btnAddSupPay").css("cursor", "pointer");
      
   } else {
      btnAddSupPay.disabled = "disabled";
      $("#btnAddSupPay").css("cursor", "not-allowed");
      
   }

}


const calculateBalanceAmount = () => {

   if (new RegExp("^([0-9]{3,5}[.][0-9]{2})|([0-9]{3,5})$").test(textPaidAmount.value)) {
      textBalanceAmount.value = (parseFloat(textTotalAmount.value) - parseFloat(textPaidAmount.value)).toFixed(2);
      textBalanceAmount.style.border = "2px dashed green";
      textBalanceAmount.classList.add("is-valid");
      textPaidAmount.style.border = "2px dashed green";
      textPaidAmount.classList.add("is-valid");
      spayment.paidamount = textPaidAmount.value;
      spayment.balanceamount = textBalanceAmount.value;


   } else {
      textPaidAmount.style.border = "2px dashed red";
      textBalanceAmount.value = "";
      spayment.paidamount = null;
      spayment.balanceamount = null

   }


}

const getSupplier = (ob) => {

   return ob.supplier_id.suppliername;
}


const getIRNote = (ob) => {
   return ob.ingredientreceivenote_id.receivenote_no;

}

const getPaymentMethod = (ob) => {
   return ob.sup_payment_method_id.name;

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
const printSPayment = (ob, rowIndex) => {
      //need to get full object of a row
      const spaymentprint = ob;

      //tableid.1th child ge length eka ganawa
for (let i = 0; i < tableSPayment.children[1].children.length; i++) {
tableSPayment.children[1].children[i].style.backgroundColor = 'white';
}
//tableid
tableSPayment.children[1].children[rowIndex].style.backgroundColor = 'pink';

tdSupBillNo.innerText = spaymentprint.billno;
tdSupplier.innerText = spaymentprint.supplier_id.suppliername;
tdIRN.innerText = spaymentprint.ingredientreceivenote_id.receivenote_no;
tdTotalAmount.innerText = spaymentprint.totalamount;
tdPaidAmount.innerText = spaymentprint.paidamount;
tdBalanceAmount.innerText = spaymentprint.balanceamount;
tdPaymentMethod.innerText = spaymentprint.sup_payment_method_id.name;

$('#modalPrintSPayment').modal('show');

}

const PrintSPaymentTableButton = () => {
   newTab = window.open();
   newTab.document.write(
       '<head><title>Print Supplier Payment</title>' +
       '<link rel="stylesheet" href="resources/bootstrap-5.3.2/css/bootstrap.' +
       'min.css">'+
       '</head>' +
       '<h2 style="margin-top: 100px">Supplier Payment Detail</h2>' +
       PrintSPaymentTable.outerHTML
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
   refreshSPaymentTable();

   //need to hide modal
   $('#PrintSPaymentTable').modal('hide');
}

//create function for print employee table
const printSPaymentFullTable = () => {
   const newTab = window.open();
   newTab.document.write(
       '<head><title>Print Supplier Payment</title>' +
       ' <script src="\script\jQuery.js"></script>' +
       '<link rel="stylesheet" href="resources/bootstrap-5.3.2/css/bootstrap.' +
       'min.css">'+
       '</head>' +
       '<h2 style="margin-top: 100px">Supplier Payment Details</h2>' +
       tableSPayment.outerHTML +
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

   if (spayment.supplier_id == null) {
      selectSupplier.classList.add('is-invalid');
      selectSupplier.classList.remove('is-valid');
      errors = errors + "Select Supplier";
   }


   if (spayment.ingredientreceivenote_id == null) {
      selectIRNote.classList.add('is-invalid');
      selectIRNote.classList.remove('is-valid');
      errors = errors + "Select IRN";
   }


   if (spayment.paidamount == null) {
      textPaidAmount.classList.add('is-invalid');
      textPaidAmount.classList.remove('is-valid');
      errors = errors + "Enter Paid Amount";
   }

   if (spayment.sup_payment_method_id == null) {
      textPaymentMethod.classList.add('is-invalid');
      textPaymentMethod.classList.remove('is-valid');
      errors = errors + "Select Payment Method";
   }

   return errors;
}


//define function for submit customer
const submitSPayment = () => {

   //need to check error
   const errors = checkFormError();
   if (errors == '') {
      //need to get user confirmation
      let userConfirm = window.confirm('Are You Sure To Add Following Payment Details..... \n'
         + '\n Supplier Name is : ' + spayment.supplier_id.suppliername
         + '\n IRN is : ' + spayment.ingredientreceivenote_id.receivenote_no);

      if (userConfirm) {

         //function predefined in common js for post put delete method
         let serverResponce = ajaxRequestBody("/supplierpayment", "POST", spayment);



         if (serverResponce == 'OK') {
            alert('Saved Successfully.... :)');

            refreshSPaymentTable(); //table reset
            formspayment.reset(); // form reset
            refreshSPaymentForm(); //dynamic elemet reset

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



