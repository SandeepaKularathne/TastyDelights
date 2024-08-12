
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
   userPrivilege = ajaxGetRequest("/privilege/bylogedusermodule/Customer Order");
   //privilege object eka global kara hamathanama use karanna oneh nissa 


   //tooltip unable
   $('[ data-bs-toggle="tooltip" ]').tooltip();

   //here calling the refresh function when the browswer is loading 
   refreshCOrderTable();

   //calling the form refresh function 
   refreshCOrderForm();

   //create object

   //1.method
   //customerorder = {};

   //2.method

});

const refreshCOrderTable = () => {

   customerorders = ajaxGetRequest("/customerorder/findall");

   //text -----> string,number,data
   //function -----> object,array,boolean
   //column count = object count

   const displayPropertyList = [
      { property: getCustomer, datatype: 'function' },
      { property: 'requireddate', datatype: 'string' },
      { property: 'totalamount', datatype: 'string' },
      { property: 'advanced_payment', datatype: 'string' },
      { property: 'balanceamount', datatype: 'string' },
      { property: getCOrderStatus, datatype: 'function' }
   ];

   //call function fill data into table. this is an reusbale function 

   //(tableId,dataList,displayPropertyList, refillfunction name, delete function name, print function name, buttonvisibility)
   fillDataIntoTable(tableCOrder, customerorders, displayPropertyList, deleteDisableFunction, true, userPrivilege);

   divModify.classList.add('d-none');
  
   divstatus.classList.add('d-none');

    //link for table search and sort item
    $("#tableCOrder").dataTable();

   

}

const deleteDisableFunction = (ob) => {
   //record eka delete unama eka disbale krannai use karnnne ----> disable delete button 
   if (ob.customerorderstatus_id.name == "Cancelled") {
      btnTableDelete.disabled = "disabled";

   }

   if (ob.customerorderstatus_id.name == "Approved") {
      btnTableDelete.disabled = "";

   }
}

// form Refresh Function
const refreshCOrderForm = () => {
   // by creating an object its easy to connect the datas directly with backend 
   customerorder = new Object();

   //combination of customerorder object and customerorderhasitem object list 
   //meken inner table eka fill karanna puluwan .......
   customerorder.customerOrderHasProductList = new Array();

   customerList = ajaxGetRequest("/customer/list");
   fillDataIntoSelect2(selectCustomer, "Select Customer", customerList, "firstname" , "mobile");


   customerorderstatuses = ajaxGetRequest("/customerorderstatus/findall");
   fillDataIntoSelect(selectCOrderStatus, 'Select Customer Order Status....!', customerorderstatuses, 'name', "Approved");
   customerorder.customerorderstatus_id = JSON.parse(selectCOrderStatus.value);


   //need to empty all elements
   selectCustomer.value = '';
   textrequireddate.value = '';
   textTotalAmount.value = '';
   textAdvancedAmount.value = '';
   textBalanceAmount.value = '';
   textnote.value = '';

   selectCustomer.style.border = '1px solid #ced4da';
   selectCustomer.style.color = 'black';
   textrequireddate.style.border = '1px solid #ced4da';
   textrequireddate.style.color = 'black';
   textTotalAmount.style.border = '1px solid #ced4da';
   textAdvancedAmount.style.border = '1px solid #ced4da';
   textBalanceAmount.style.border = '1px solid #ced4da';
   selectCOrderStatus.style.border = '2px dashed green';
   selectCOrderStatus.style.color = 'green';

   selectCustomer.classList.remove("is-valid");
   textrequireddate.classList.remove("is-valid");
   textTotalAmount.classList.remove("is-valid");
   textAdvancedAmount.classList.remove("is-valid");
   textBalanceAmount.classList.remove("is-valid");
   selectCOrderStatus.classList.add("is-valid");


   refreshCOrderInnerFormTable();



   btnUpdateCOrder.disabled = "disabled";
   // btnUpdateEmployee.style.cursor = "not-allowed";
   $("#btnUpdateCOrder").css("cursor", "not-allowed");


   if (userPrivilege.insert) {
      btnAddCOrder.disabled = "";
      $("#btnAddCOrder").css("cursor", "pointer");

   } else {
      btnAddCOrder.disabled = "disabled";
      $("#btnAddCOrder").css("cursor", "not-allowed");

   }

}

const refreshCOrderInnerFormTable = () => {

   // ============== refresh inner form ================ //


   customerorderhasitem = new Object();

   //all lists comes from product table...
   allproducts = ajaxGetRequest("/product/list");
   fillDataIntoSelect(selectProduct, "Select Product", allproducts, 'productname');

   textProductPrice.value = '';
   textquantity.value = '';
   textLinePrice.value = '';

   selectProduct.style.color = 'black';
   selectProduct.style.border = '1px solid #ced4da';
   textProductPrice.style.border = '1px solid #ced4da';
   textquantity.style.border = '1px solid #ced4da';
   textLinePrice.style.border = '1px solid #ced4da';


   selectProduct.classList.remove("is-valid");
   textProductPrice.classList.remove("is-valid");
   textquantity.classList.remove("is-valid");
   textLinePrice.classList.remove("is-valid");


   // =========== refresh inner table ====================//

   const displayPropertyList = [
      { property: getProductName, datatype: 'function' },
      { property: 'product_price', datatype: 'string' },
      { property: 'quantity', datatype: 'string' },
      { property: 'lineprice', datatype: 'string' }];

   fillDataIntoInnerTable(tableCOrderPro, customerorder.customerOrderHasProductList, displayPropertyList, deleteCOrderProduct, true);

   let totalAmount = 0.00;
   for (const coproduct of customerorder.customerOrderHasProductList) {
      totalAmount = parseFloat(totalAmount) + parseFloat(coproduct.lineprice)
   }
   textTotalAmount.value = parseFloat(totalAmount).toFixed(2);
   customerorder.totalamount = textTotalAmount.value;
   textTotalAmount.style.border = "2px dashed green";
   textTotalAmount.style.border = "2px dashed green";
   textTotalAmount.classList.add("is-valid");

   if (parseFloat(textTotalAmount.value) >= parseFloat(5000.00)) {
      textAdvancedAmount.value = (parseFloat(textTotalAmount.value) * 0.5).toFixed(2);
      customerorder.advanced_payment = textAdvancedAmount.value;


   } else {
      textAdvancedAmount.value = parseFloat(0.00).toFixed(2);

   }
   calculateBalanceAmount();
}

const getProductName = (ob) => {
   return ob.product_id.productname;

}

const deleteCOrderProduct = (ob, rowIndex) => {

   let userConfirm = confirm("Are you sure to remove following product.... ? \n" + ob.product_id.productname);
   if (userConfirm) {
      customerorder.customerOrderHasProductList.splice(rowIndex, 1);
      refreshCOrderInnerFormTable();
      alert("Remove Successfully..!")


   }

}

const checkAvailability = () => {

   let selectedProduct = JSON.parse(selectProduct.value);

   let extIndex = customerorder.customerOrderHasProductList.map(coproduct => coproduct.product_id.id).indexOf(selectedProduct.id);
   if (extIndex != -1) {
      alert("Selected Product Allready exist..!");
      allproducts = ajaxGetRequest("/product/list");
      fillDataIntoSelect(selectProduct, "Select Product", allproducts, "productname");
      selectProduct.style.border = "1px solid #ced4da";
      customerorderhasitem.product_id = null;
   } else {
      textProductPrice.value = parseFloat(selectedProduct.price).toFixed(2);
      textProductPrice.style.border = "2px dashed green";
      textProductPrice.style.border = "2px dashed green";
      textProductPrice.classList.add("is-valid");
      customerorderhasitem.product_price = textProductPrice.value;
      textProductPrice.disabled = "disabled";
   }
}

const calculateLinePrice = () => {

   //textquantity , 
   if (new RegExp("^[1-9][0-9]{0,5}$").test(textquantity.value)) {
      textLinePrice.value = (parseFloat(textquantity.value) * parseFloat(textProductPrice.value)).toFixed(2);

      textLinePrice.style.border = "2px dashed green";
      textLinePrice.style.border = "2px dashed green";
      textLinePrice.classList.add("is-valid");

      textquantity.style.border = "2px dashed green";
      textquantity.style.border = "2px dashed green";
      textquantity.classList.add("is-valid");

      customerorderhasitem.quantity = textquantity.value;
      customerorderhasitem.lineprice = textLinePrice.value;
      ButtonCOrderIng.disabled = "";

   } else {
      ButtonCOrderIng.disabled = "disabled";
      textquantity.style.border = "2px dashed red";
      textLinePrice.value = "";
      customerorderhasitem.quantity = null;
      customerorderhasitem.lineprice = null;
   }
}

const calculateBalanceAmount = () => {

   if (new RegExp("^[0-9]{0,5}[.][0-9]{2}$").test(textAdvancedAmount.value)) {
      textBalanceAmount.value = (parseFloat(textTotalAmount.value) - parseFloat(textAdvancedAmount.value)).toFixed(2);
      textBalanceAmount.style.border = "2px dashed green";
      textBalanceAmount.style.border = "2px dashed green";
      textBalanceAmount.classList.add("is-valid");

      textAdvancedAmount.style.border = "2px dashed green";
      textAdvancedAmount.style.border = "2px dashed green";
      textAdvancedAmount.classList.add("is-valid");
      customerorder.advanced_payment = textAdvancedAmount.value;
      customerorder.balanceamount = textBalanceAmount.value;


   } else {
      textAdvancedAmount.style.border = "2px dashed red";
      textBalanceAmount.value = "";
      customerorderhasitem.advanced_payment = null;
      customerorderhasitem.balanceamount = null

   }


}

const checkInnerFormError = () => {
   let errors = "";

   if (customerorderhasitem.product_id == null) {
      errors = errors + "Please Select Product...! \n";

   }

   if (customerorderhasitem.product_price == null) {
      errors = errors + "Please Enter Proper Quantity...! \n";

   }

   if (customerorderhasitem.quantity == null) {
      errors = errors + "Please Enter Proper Quantity...! \n";

   }

   if (customerorderhasitem.lineprice == null) {
      errors = errors + "Please Enter Proper Quantity...! \n";

   }

   return errors;

}


const buttonCOrderProAdd = () => {

   let errors = checkInnerFormError();

   if (errors == "") {
      let userConfirm = confirm("");
      if (userConfirm) {
         alert("Order Item Added Successfully....!");
         customerorder.customerOrderHasProductList.push(customerorderhasitem);
         refreshCOrderInnerFormTable();

      }
   } else {
      alert("Fail to add order Item....! \n" + errors);
   }

}

const getCustomer = (ob) => {

   return ob.customer_id.firstname;
}

const getCOrderStatus = (ob) => {
   if (ob.customerorderstatus_id.name == 'Cancelled') {
      return '<p class = "button-cancel">' + ob.customerorderstatus_id.name + '</p>';
   }

   if (ob.customerorderstatus_id.name == 'Approved') {
      return '<p class = "button-approve">' + ob.customerorderstatus_id.name + '</p>';
   }


   if (ob.customerorderstatus_id.name == 'On-Process') {
      return '<p class = "button-process">' + ob.customerorderstatus_id.name + '</p>';
   }


   if (ob.customerorderstatus_id.name == 'Completed') {
      return '<p class = "button-complete">' + ob.customerorderstatus_id.name + '</p>';
   }



}

// function for edit customer record 
const refillCOrderForm = (ob, rowindex) => {

   customerorder = JSON.parse(JSON.stringify(ob));
   oldcustomerorder = JSON.parse(JSON.stringify(ob));

   //offcanvas open
   $('#offcanvasTop').offcanvas('show');

   
   divstatus.classList.remove('d-none');


   //set Value into static element
   //elementid.value = ob.relevantProertyname
   textrequireddate.value = ob.requireddate;
   textTotalAmount.value = ob.totalamount;
   textAdvancedAmount.value = ob.advanced_payment;
   textBalanceAmount.value = ob.balanceamount;
   

   //optional fields

   if (customerorder.note != null)
 
   //object eeken illaganawa property ekai eyage type ekai 
   fillDataIntoSelect(selectCustomer, "Select Customer", customerList, "firstname" , "mobile",customerorder.customer_id.firstname,mobile);
   // name ----> final property      
   //final propert ekai display property ekai equal wenna oneh 

   fillDataIntoSelect(selectCOrderStatus, 'Select Customer Order Status....!', customerorderstatuses, 'name', customerorder.customerorderstatus_id.name);

   if (userPrivilege.update) {
      btnUpdateCOrder.disabled = "";
      $("#btnUpdateCOrder").css("cursor", "pointer");

   } else {
      btnUpdateCOrder.disabled = "disabled";
      // btnUpdateCOrder.style.cursor = "not-allowed";
      $("#btnUpdateCOrder").css("cursor", "not-allowed");


   }
   btnAddCOrder.disabled = "disabled";
   $("#btnAddCOrder").css("cursor", "not-allowed");

   refreshCOrderInnerFormTable();

}

//define function for check form updates 
const checkFormUpdate = () => {
   let updates = "";
   //changes apply wenne customerorder ekata. propertyname != Oldemployee.propertyname
  
   if (customerorder.customer_id.id != oldcustomerorder.customer_id.id) {
      updates = updates + "Customer Order Id is Changed " + oldcustomerorder.customer_id.id + " into " + customerorder.customer_id.id + "\n";
   }

   if (customerorder.requireddate != oldcustomerorder.requireddate) {
      updates = updates + "Required Date is Changed " + oldcustomerorder.requireddate + " into " + customerorder.requireddate + "\n";
   }

   if (customerorder.advanced_payment != oldcustomerorder.advanced_payment) {
      updates = updates + "Advanced Payment is Changed " + oldcustomerorder.advanced_payment + " into " + customerorder.advanced_payment + "\n";
   }

   if (customerorder.customerorderstatus_id.id != oldcustomerorder.customerorderstatus_id.id) {
      updates = updates + "Customer Order Status is Changed " + oldcustomerorder.customerorderstatus_id.id + " into " + customerorder.customerorderstatus_id.id + "\n";
   }


   return updates;
}

//define function for customerorder record
const buttonCOrderUpdate = () => {
   console.log("update");
   console.log(customerorder);
   console.log(oldcustomerorder);

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

            let serverResponce = ajaxRequestBody("/customerorder", "PUT", customerorder)
            //check put serviceresponse

            if (serverResponce == "OK") {
               alert("Update Successfully.....!");

               refreshCOrderTable(); //table reset
               formcustomerorder.reset(); // form reset
               refreshCOrderForm(); //dynamic elemet reset

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
const deleteCOrder = (ob, rowIndex) => {


 
   // const userConfirm = confirm('Are You Sure to delete the following Customer details \n'+ customers[rowindex].firstName);
   const userConfirm = confirm('Are You Sure To Delete Following POrder...? \n'
      + '\n Customer Order Code is : ' + ob.customerorder_code
      + '\n Customer ID is : ' + ob.customer_id.name);

   if (userConfirm) {
      //call delete services 
      let serverResponce = ajaxRequestBody("/customerorder", "DELETE", customerorder);

      if (serverResponce == 'OK') {
         alert('Delete Successfully.... :)');

         refreshCOrderTable(); //table reset
         formcustomerorder.reset(); // form reset
         refreshCOrderForm(); //dynamic elemet reset

      } else {
         alert('Delete not completed, you have following error \n' + serverResponce);
      }

   }
}

//create  function for print customer record
const printCOrder = (ob, rowIndex) => {

   //need to get full object of a row
   const customerPrint = ob;

                       //tableid.1th child ge length eka ganawa
   for (let i = 0; i < tableCOrder.children[1].children.length; i++) {
      tableCOrder.children[1].children[i].style.backgroundColor = 'white';
   }
   //tableid
   tableCOrder.children[1].children[rowIndex].style.backgroundColor = 'pink';

   tdNum.innerText = customerPrint.customerorder_code;
   tdCustomer.innerText = customerPrint.customer_id.firstname,mobile;
   tdReqDate.innerText = customerPrint.requireddate;
   tdTotamount.innerText = customerPrint.totalamount;
   tdAdvancedAmount.innerText = customerPrint.advanced_payment;
   tdBalanceAmount.innerText = customerPrint.customerstatus_id.balanceamount;
   tdOrderStatus.innerText = customerPrint.customerorderstatus_id.name;
  

 $('#modalCustomerOrderTable').modal('show');

}

const PrintCustomerOrderTableButton = () => {
   newTab = window.open();
   newTab.document.write(
       '<head><title>Print Customer Order</title>' +
       '<link rel="stylesheet" href="resources/bootstrap-5.3.2/css/bootstrap.' +
       'min.css">'+
       '</head>' +
       '<h2 style="margin-top: 100px">Customer Detail</h2>' +
       PrintCustomerOrderTable.outerHTML
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
   refreshCOrderTable();

   //need to hide modal
   $('#modalCustomerOrderTable').modal('hide');
}

//create function for print employee table
const printCustomerOrderFullTable = () => {
   const newTab = window.open();
   newTab.document.write(
       '<head><title>Print Customer Order</title>' +
       ' <script src="\script\jQuery.js"></script>' +
       '<link rel="stylesheet" href="resources/bootstrap-5.3.2/css/bootstrap.' +
       'min.css">'+
       '</head>' +
       '<h2 style="margin-top: 100px">Customer Order Details</h2>' +
       tableCOrder.outerHTML +
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

   if (customerorder.customer_id == null) {
      selectCustomer.classList.add('is-invalid');
      selectCustomer.classList.remove('is-valid');
      errors = errors + "Select Customer....! \n";
   }


   if (customerorder.requireddate == null) {
      textrequireddate.classList.add('is-invalid');
      textrequireddate.classList.remove('is-valid');
      errors = errors + "Enter Valid Date....! \n";
   }

   if (customerorder.customerorderstatus_id == null) {
      selectCOrderStatus.classList.add('is-invalid');
      selectCOrderStatus.classList.remove('is-valid');
      errors = errors + "Select Customer Order Status....! \n";
   }

   return errors;
}



//define function for submit customer
const submitCOrder = () => {

   //need to check error
   const errors = checkFormError();
   if (errors == '') {
      //need to get user confirmation
      let userConfirm = window.confirm('Are You Sure To Add Following Customer Order..... \n'
         + '\n Code is : ' + customerorder.customerorder_code
         + '\n Customer Name is : ' + customerorder.customer_id.firstname);

      if (userConfirm) {

         //function predefined in common js for post put delete method
         let serverResponce = ajaxRequestBody("/customerorder", "POST", customerorder);

         if (serverResponce == 'OK') {
            alert('Saved Successfully.... :)');

            refreshCOrderTable(); //table reset
            formcustomerorder.reset(); // form reset
            refreshCOrderForm(); //dynamic elemet reset

            //offcanvas close 
            $('#offcanvasTop').offcanvas('hide');

         } else {
            alert('Save Not Sucessfully Completed...! have Some Errors \n' + serverResponce);
         }
      }

   } else {
      alert("Forms Contains Errors.. :( \n " + errors);
   }

}


