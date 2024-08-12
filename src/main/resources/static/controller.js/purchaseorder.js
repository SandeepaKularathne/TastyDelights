
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


   //tooltip unable
   $('[ data-bs-toggle="tooltip" ]').tooltip();

   //here calling the refresh function when the browswer is loading 
   refreshPurchaseOrderTable();

   //calling the form refresh function 
   refreshPurchaseOrderForm();

   selectSupplier.addEventListener('change', event => {

      ingredientList = ajaxGetRequest("/ingredient/listbyingredient/" + JSON.parse(selectSupplier.value).id);
      fillDataIntoSelect(selectIngredient, "Select Ingredient", ingredientList, "ingredientname");

   })

});

const refreshPurchaseOrderTable = () => {

   purchaseorders = ajaxGetRequest("/purchaseorder/findall");

   //text -----> string,number,data
   //function -----> object,array,boolean
   //column count = object count

   const displayPropertyList = [
      { property: getSuppliername, datatype: 'function' },
      { property: getOrderIngredient, datatype: 'function' },
      { property: 'requireddate', datatype: 'string' },
      { property: 'totalamount', datatype: 'string' },
      { property: getPurchaseOrderStatus, datatype: 'function' }];

   //call function fill data into table. this is an reusbale function 

   //(tableId,dataList,displayPropertyList, refillfunction name, delete function name, print function name, buttonvisibility)
   fillDataIntoTable(tablePurchaseOrder, purchaseorders, displayPropertyList, deleteDisableFunction, true, userPrivilege);

   divModify.classList.add('d-none');

   divstatus.classList.add('d-none');

   //link for table search and sort item
   $("#tablePurchaseOrder").dataTable();


}

const deleteDisableFunction = (ob) => {
   //record eka delete unama eka disbale krannai use karnnne ----> disable delete button 
   if (ob.purchaseorderstatus_id.name == "Cancelled") {
      btnTableDelete.disabled = "disabled";

   }

   if (ob.purchaseorderstatus_id.name == "Requested") {
      btnTableDelete.disabled = "";

   }
}


// form Refresh Function
const refreshPurchaseOrderForm = () => {
   // by creating an object its easy to connect the datas directly with backend 
   porder = new Object();

   //combination of porder object and porderhasingredient object list 
   //meken inner table eka fill karanna puluwan .......
   porder.purchaseOrderHasIngredientList = new Array();



   supplierList = ajaxGetRequest("/supplier/list");
   fillDataIntoSelect(selectSupplier, "Select Supplier", supplierList, "suppliername");

   purchaseorderstatuses = ajaxGetRequest("/purchaseorderstatus/findall");
   fillDataIntoSelect(selectPOrderStatus, 'Select Purchase Order Status....!', purchaseorderstatuses, 'name', "Requested");
   porder.purchaseorderstatus_id = JSON.parse(selectPOrderStatus.value);


   //need to empty all elements
   selectSupplier.value = '';
   textrequireddate.value = '';
   textTotalAmount.value = '';
   textnote.value = '';

   //need to set default color
   selectSupplier.style.border = '1px solid #ced4da';
   textrequireddate.style.border = '1px solid #ced4da';
   textTotalAmount.style.border = '1px solid #ced4da';
   textnote.style.border = '1px solid #ced4da';
   selectPOrderStatus.style.color = 'green';
   selectPOrderStatus.style.border = '2px dashed green';

   selectSupplier.classList.remove("is-valid");
   textrequireddate.classList.remove("is-valid");
   textTotalAmount.classList.remove("is-valid");
   textnote.classList.remove("is-valid");
   selectPOrderStatus.classList.add("is-valid");

   refreshPOrderInnerFormTable();


   btnUpdatePOrder.disabled = "disabled";
   // btnUpdatePOrder.style.cursor = "not-allowed";
   $("#btnUpdatePOrder").css("cursor", "not-allowed");


   if (userPrivilege.insert) {
      btnAddPOrder.disabled = "";
      $("#btnAddPOrder").css("cursor", "pointer");

   } else {
      btnAddPOrder.disabled = "disabled";
      $("#btnAddPOrder").css("cursor", "not-allowed");

   }

}

const refreshPOrderInnerFormTable = () => {

   // refresh inner form 

   porderhasingredient = new Object();

   if (selectSupplier.value == "") {
      //all lists comes from ingredient table...
      allitems = ajaxGetRequest("/ingredient/list");
      fillDataIntoSelect(selectIngredient, "Select Ingredient", allitems, 'ingredientname');

   } else {
      ingredientList = ajaxGetRequest("/ingredient/listbyingredient/" + JSON.parse(selectSupplier.value).id);
      fillDataIntoSelect(selectIngredient, "Select Ingredient", ingredientList, "ingredientname");
   }


   textUnitPrice.value = '';
   textquantity.value = '';
   textLineTotal.value = '';

   selectIngredient.style.color = 'black';
   selectIngredient.style.border = '1px solid #ced4da';
   textUnitPrice.style.border = '1px solid #ced4da';
   textquantity.style.border = '1px solid #ced4da';
   textLineTotal.style.border = '1px solid #ced4da';

   selectIngredient.classList.remove("is-valid");
   textUnitPrice.classList.remove("is-valid");
   textquantity.classList.remove("is-valid");
   textLineTotal.classList.remove("is-valid");


   //refresh inner table 

   const displayPropertyList = [
      { property: getIngredientName, datatype: 'function' },
      { property: 'unitprice', datatype: 'string' },
      { property: 'quantity', datatype: 'string' },
      { property: 'linetotal', datatype: 'string' }];

   fillDataIntoInnerTable(tablePOrderItem, porder.purchaseOrderHasIngredientList, displayPropertyList, deletePOrderItem, true);

   let totalAmount = 0.00;
   for (const poitem of porder.purchaseOrderHasIngredientList) {
      totalAmount = parseFloat(totalAmount) + parseFloat(poitem.linetotal)
   }
   textTotalAmount.value = parseFloat(totalAmount).toFixed(2);
   porder.totalamount = textTotalAmount.value;
   textTotalAmount.style.border = "2px dashed green";
}

const getOrderIngredient = (ob) => {
   let ingredient = "";
   for (const item of ob.ingredientList) {
      ingredient = ingredient + item.ingredientname + " , ";
   }
   return ingredient;

}


const deletePOrderItem = (ob, rowIndex) => {

   let userConfirm = confirm("Are you sure to remove following ingredient.... ? \n" + ob.ingredient_id.ingredientname);
   if (userConfirm) {
      porder.purchaseOrderHasIngredientList.splice(rowIndex, 1);
      refreshPOrderInnerFormTable();
      alert("Remove Successfully..!")
   }

}

const checkAvailability = () => {

   let selectedItem = JSON.parse(selectIngredient.value);

   let extIndex = porder.purchaseOrderHasIngredientList.map(poitem => poitem.ingredient_id.id).indexOf(selectedItem.id);
   if (extIndex != -1) {
      alert("Selected Ingredient Allready exist..!");
      allitems = ajaxGetRequest("/ingredient/list");
      fillDataIntoSelect(selectIngredient, "Select Ingredient", allitems, "ingredientname");
      selectIngredient.style.border = "1px solid #ced4da";
      porderhasingredient.ingredient_id = null;
   } else {
      textUnitPrice.value = parseFloat(selectedItem.costperunit).toFixed(2);
      textUnitPrice.style.border = "2px dashed green";
      textUnitPrice.style.border = "2px dashed green";
      textUnitPrice.classList.add("is-valid");
      porderhasingredient.unitprice = textUnitPrice.value;
      textUnitPrice.disabled = "disabled";
   }
}

const calculateLinePrice = () => {

   //textquantity , 
   if (new RegExp("^[1-9][0-9]{0,5}$").test(textquantity.value)) {
      textLineTotal.value = (parseFloat(textquantity.value) * parseFloat(textUnitPrice.value)).toFixed(2);
      textLineTotal.style.border = "2px dashed green";
      textLineTotal.style.border = "2px dashed green";
      textLineTotal.classList.add("is-valid");

      textquantity.style.border = "2px dashed green";
      textquantity.style.border = "2px dashed green";
      textquantity.classList.add("is-valid");

      porderhasingredient.quantity = textquantity.value;
      porderhasingredient.linetotal = textLineTotal.value;
      ButtonPOrderIng.disabled = "";

   } else {
      ButtonPOrderIng.disabled = "disabled";
      textquantity.style.border = "2px dashed red"; 
      textPaidAmount.style.color = "red";
      textPaidAmount.classList.remove("is-valid");
      textLineTotal.value = "";
      porderhasingredient.quantity = null;
      porderhasingredient.linetotal = null;
   }
}

const checkInnerFormError = () => {
   let errors = "";

   if (porderhasingredient.ingredient_id == null) {
      errors = errors + "Please Select Ingredient...! \n";
   }

   if (porderhasingredient.quantity == null) {
      errors = errors + "Please Enter Proper Quantity...! \n";
   }

   return errors;

}


const buttonPOrderIngAdd = () => {

   let errors = checkInnerFormError();

   if (errors == "") {
      let userConfirm = confirm("Do you want to add the ingredient.. ?");
      if (userConfirm) {
         alert("Order ingrdient is added successfully....!");
         porder.purchaseOrderHasIngredientList.push(porderhasingredient);
         refreshPOrderInnerFormTable();

      }
   } else {
      alert("Fail to add order Ingredient....! \n" + errors);
   }

}



const getSuppliername = (ob) => {
   return ob.supplier_id.suppliername;
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

// function for edit customer record 
const refillPOrderForm = (ob, rowindex) => {

   porder = JSON.parse(JSON.stringify(ob));
   console.log(porder);
   oldporder = JSON.parse(JSON.stringify(ob));

   //offcanvas open
   $('#offcanvasTop').offcanvas('show');

   divstatus.classList.remove('d-none');


   //set Value into static element
   //elementid.value = ob.relevantProertyname
   selectSupplier.value = ob.supplier_id;
   textrequireddate.value = ob.requireddate;
   textTotalAmount.value = ob.totalamount;
   selectPOrderStatus.value = ob.purchaseorderstatus_id;

   //optional fields
   if (porder.note != null)
      textnote.value = ob.note; else textnote.value = "";


   //object eeken illaganawa property ekai eyage type ekai 
   fillDataIntoSelect(selectSupplier, 'Select Supplier....!', supplierList, 'suppliername', porder.supplier_id.suppliername);
   // name ----> final property      
   //final propert ekai display property ekai equal wenna oneh 

   fillDataIntoSelect(selectPOrderStatus, 'Select POrder Status....!', purchaseorderstatuses, 'name', porder.purchaseorderstatus_id.name);


   if (userPrivilege.update) {
      btnUpdatePOrder.disabled = "";
      $("#btnUpdatePOrder").css("cursor", "pointer");

   } else {
      btnUpdatePOrder.disabled = "disabled";
      // btnUpdatePOrder.style.cursor = "not-allowed";
      $("#btnUpdatePOrder").css("cursor", "not-allowed");


   }
   btnAddPOrder.disabled = "disabled";
   $("#btnAddPOrder").css("cursor", "not-allowed");

   refreshPOrderInnerFormTable();

}


//define function for check form updates 
const checkFormUpdate = () => {
   let updates = "";
   //changes apply wenne porder ekata. propertyname != Oldemployee.propertyname

   if (porder.supplier_id.id != oldporder.supplier_id.id) {
      updates = updates + "Supplier is Changed " + oldporder.supplier_id.id + "into" + porder.supplier_id.id + "\n";
   }

   if (porder.requireddate != oldporder.requireddate) {
      updates = updates + "Required Date is Changed " + oldporder.requireddate + "into" + porder.requireddate + "\n";
   }

   if (porder.totalamount != oldporder.totalamount) {
      updates = updates + "Total Amount is Changed " + oldporder.totalamount + "into" + porder.totalamount + "\n";
   }

   if (porder.purchaseorderstatus_id.id != oldporder.purchaseorderstatus_id.id) {
      updates = updates + "Purchase Order is Changed " + oldporder.purchaseorderstatus_id.id + "into" + porder.purchaseorderstatus_id.id + "\n";
   }

   return updates;
}

//define function for porder record
const buttonPOrderUpdate = () => {
   console.log("update");
   console.log(porder);
   console.log(oldporder);

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

            let serverResponce = ajaxRequestBody("/purchaseorder", "PUT", porder)
            //check put serviceresponse

            if (serverResponce == "OK") {
               alert("Update Successfully.....!");

               refreshPurchaseOrderTable(); // Table reset
               formpurchaseorder.reset(); // Form reset
               refreshPurchaseOrderForm(); // Dynamic element reset

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
const deletePOrder = (ob, rowIndex) => {
   porder = ob;
   // const userConfirm = confirm('Are You Sure to delete the following Customer details \n'+ customers[rowindex].firstName);
   const userConfirm = confirm('Are You Sure To Delete Following POrder...? \n'
      + '\n POrder ID is : ' + ob.pordercode
      + '\n Supplier Name is : ' + porder.supplier);

   if (userConfirm) {
      //call delete services 
      let serverResponce = ajaxRequestBody("/purchaseorder", "DELETE", porder);

      if (serverResponce == 'OK') {
         alert('Delete Successfully.... :)');

         refreshPurchaseOrderTable(); // Table reset
         formpurchaseorder.reset(); // Form reset
         refreshPurchaseOrderForm(); // Dynamic element reset

      } else {
         alert('Delete not completed, you have following error \n' + serverResponce);
      }

   }
}

//create  function for print customer record
const printPOrder = (ob, rowIndex) => {
      //need to get full object of a row
      const customerPrint = ob;

      //tableid.1th child ge length eka ganawa
for (let i = 0; i < tablePurchaseOrder.children[1].children.length; i++) {
tablePurchaseOrder.children[1].children[i].style.backgroundColor = 'white';
}
//tableid
tablePurchaseOrder.children[1].children[rowIndex].style.backgroundColor = 'pink';

tdNum.innerText = customerPrint.pordercode;
tdSuppliername.innerText = customerPrint.supplier_id.suppliername;
tdOrdIng.innerText = customerPrint.ingredient_id.ingredientname;
tdReqDate.innerText = customerPrint.requireddate;
tdAPrice.innerText = customerPrint.totalamount;
tdPOrderStatus.innerText = customerPrint.purchaseorderstatus_id.name;



//option 2
$('#modalPrintPOrder').modal('show');

}

const PrintPOrderTableButton = () => {
   newTab = window.open();
   newTab.document.write(
       '<head><title>Print Purchase Order</title>' +
       '<link rel="stylesheet" href="resources/bootstrap-5.3.2/css/bootstrap.' +
       'min.css">'+
       '</head>' +
       '<h2 style="margin-top: 100px">Purchase Order Detail</h2>' +
       tablePurchaseOrder.outerHTML
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
   refreshPurchaseOrderTable();

   //need to hide modal
   $('#PrintUserTable').modal('hide');
}

//create function for print employee table
const printPOrderFullTable = () => {
   const newTab = window.open();
   newTab.document.write(
       '<head><title>Print Purchase Order</title>' +
       ' <script src="\script\jQuery.js"></script>' +
       '<link rel="stylesheet" href="resources/bootstrap-5.3.2/css/bootstrap.' +
       'min.css">'+
       '</head>' +
       '<h2 style="margin-top: 100px">Purchase Order Details</h2>' +
       tablePurchaseOrder.outerHTML +
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
   if (porder.supplier_id == null) {
      selectSupplier.classList.add('is-invalid');
      selectSupplier.classList.remove('is-valid');
      errors = errors + "Select Supplier..!";
   }

   if (porder.requireddate == null) {
      textrequireddate.classList.add('is-invalid');
      textrequireddate.classList.remove('is-valid');
      errors = errors + "Select Valid Date....! \n";
   }

   if (porder.purchaseorderstatus_id == null) {
      selectPOrderStatus.classList.add('is-invalid');
      selectPOrderStatus.classList.remove('is-valid');
      errors = errors + "Select Supplier..!";
   }
   return errors;
}

//define function for submit customer
const submitPOrder = () => {
   console.log(porder);
   //need to check error
   const errors = checkFormError();
   if (errors == '') {
      //need to get user confirmation
      let userConfirm = window.confirm('Are You Sure To Add Following POrder..... \n');

      if (userConfirm) {
         //function predefined in common js for post put delete method
         let serverResponce = ajaxRequestBody("/purchaseorder", "POST", porder);
         if (serverResponce == 'OK') {
            alert('Saved Successfully.... :)');

            refreshPurchaseOrderTable(); // Table reset
            formpurchaseorder.reset(); // Form reset
            refreshPurchaseOrderForm(); // Dynamic element reset

            //offcanvas close 
            $('#offcanvasTop').offcanvas('hide');

         } else {
            alert('Save Not Sucessfully Completed...! have Some Errors \n' + serverResponce);
         }
      }

   }
}



