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
window.addEventListener("DOMContentLoaded", () => {
  //module name in module table should be same
  userPrivilege = ajaxGetRequest("/privilege/bylogedusermodule/IRN");
  //privilege object eka global kara hamathanama use karanna oneh nissa

  //tooltip unable
  $('[ data-bs-toggle="tooltip" ]').tooltip();

  //here calling the refresh function when the browswer is loading
  refreshIRNTable();

  //calling the form refresh function

  refreshIRNForm();


});

const refreshIRNTable = () => {
  irnotes = ajaxGetRequest("/irn/findall");

  //text -----> string,number,data
  //function -----> object,array,boolean
  //column count = object count

  const displayPropertyList = [
    { property: getSuppliername, datatype: "function" },
    { property: "supplierbill_no", datatype: "string" },
    { property: getPOrder, datatype: "function" },
    { property: "received_date", datatype: "string" },
    { property: "total_amount", datatype: "string" },
    { property: "discount_rate", datatype: "string" },
    { property: "net_amount", datatype: "string" },
    { property: getIRNStatus, datatype: "function" },
  ];

  //call function fill data into table. this is an reusbale function

  //(tableId,dataList,displayPropertyList, refillfunction name, delete function name, print function name, buttonvisibility)
  fillDataIntoTable(tableIRN,irnotes,displayPropertyList,deleteDisableFunction,true,userPrivilege);

  divModify.classList.add("d-none");

  divstatus.classList.add('d-none');

  //link for table search and sort item
  $("#tablePurchaseOrder").dataTable();
};

const deleteDisableFunction = (ob) => {
  //record eka delete unama eka disbale krannai use karnnne ----> disable delete button
  if (ob.ingredientrecievenote_status_id.name == "Cancelled") {
    btnTableDelete.disabled = "disabled";
  }

  if (ob.ingredientrecievenote_status_id.name == "Received") {
    btnTableDelete.disabled = "";
  }
};

const getPOrder = (ob) => {
  return ob.purchaseorder_id.pordercode;
};

// form Refresh Function
const refreshIRNForm = () => {
  // by creating an object its easy to connect the datas directly with backend
  irn = new Object();

  //combination of porder object and irnhasingredient object list
  //meken inner table eka fill karanna puluwan .......
  irn.irnHasIngredientList = new Array();

  supplierList = ajaxGetRequest("/supplier/list");
  fillDataIntoSelect(
    selectSupplier,
    "Select Supplier",
    supplierList,
    "suppliername"
  );

  selectPOrder.addEventListener("change", (event) => {
    ingredientList = ajaxGetRequest(
      "/ingredient/listbypocode/" + JSON.parse(selectPOrder.value).pordercode
    );
    fillDataIntoSelect(
      selectIngredient,
      "Select Ingredient",
      ingredientList,
      "ingredientname"
    );
  });

  selectSupplier.addEventListener("change", (event) => {
    pOrderList = ajaxGetRequest("/purchaseorder/listbyporderstatus/" + JSON.parse(selectSupplier.value).id);
    fillDataIntoSelect(selectPOrder,"Select Purchase Order",pOrderList,"pordercode");
  });

  irnstatuses = ajaxGetRequest("/ingredientrecievenote_status/findall");
  fillDataIntoSelect(
    selectIRNStatus,
    "Select IRN Status....!",
    irnstatuses,
    "name",
    "Received"
  );
  irn.ingredientrecievenote_status_id = JSON.parse(selectIRNStatus.value); //meken html define karapu validator eka block welaa api asign karapu value eka penawaa

  //need to empty all elements
  textSupBillNo.value = "";
  textreceiveddate.value = "";
  textTotalAmount.value = "";
  textDiscountRate.value = "";
  textNetAmount.value = "";
  textnote.value = "";

  //need to set default color
  selectSupplier.style.border = "1px solid #ced4da";
  textSupBillNo.style.border = "1px solid #ced4da";
  selectPOrder.style.border = "1px solid #ced4da";
  textreceiveddate.style.border = "1px solid #ced4da";
  textTotalAmount.style.border = "1px solid #ced4da";
  textDiscountRate.style.border = "1px solid #ced4da";
  textNetAmount.style.border = "1px solid #ced4da";
  selectIRNStatus.style.border = "2px dashed green";
  textnote.style.border = "1px solid #ced4da";

  selectSupplier.classList.remove("is-valid");
  textSupBillNo.classList.remove("is-valid");
  selectPOrder.classList.remove("is-valid");
  textreceiveddate.classList.remove("is-valid");
  textTotalAmount.classList.remove("is-valid");
  textDiscountRate.classList.remove("is-valid");
  textNetAmount.classList.remove("is-valid");
  selectIRNStatus.classList.add("is-valid");
  textnote.classList.remove("is-valid");

  btnUpdateIRN.disabled = "disabled";
  // btnUpdateIRN.style.cursor = "not-allowed";
  $("#btnUpdateIRN").css("cursor", "not-allowed");

  if (userPrivilege.insert) {
    btnAddIRN.disabled = "";
    $("#btnAddIRN").css("cursor", "pointer");
  } else {
    btnAddIRN.disabled = "disabled";
    $("#btnAddIRN").css("cursor", "not-allowed");
  }

  refreshIRNInnerFormTable();
};

const refreshIRNInnerFormTable = () => {
  // refresh inner form

  irnhasingredient = new Object();

  if (selectPOrder.value == "") {
    //all lists comes from ingredient table...

    if (selectSupplier.value != "") {
      ingredientList = ajaxGetRequest(
        "/ingredient/listbyingredient/" + JSON.parse(selectSupplier.value).id
      );
      fillDataIntoSelect(
        selectIngredient,
        "Select Ingredient",
        ingredientList,
        "ingredientname"
      );
    }else{
      fillDataIntoSelect(
         selectIngredient,
         "Select Ingredient",
         [],
         "ingredientname"
       );
    }
  } else {
    ingredientList = ajaxGetRequest(
      "/ingredient/listbypocode/" + JSON.parse(selectPOrder.value).pordercode
    );
    fillDataIntoSelect(
      selectIngredient,
      "Select Ingredient",
      ingredientList,
      "ingredientname"
    );
  }

  
  
  textUnitPrice.value = "";
  textquantity.value = "";
  textLineTotal.value = "";

  selectIngredient.style.color = "black";
  selectIngredient.style.border = "1px solid #ced4da";
  textUnitPrice.style.border = "1px solid #ced4da";
  textquantity.style.border = "1px solid #ced4da";
  textLineTotal.style.border = "1px solid #ced4da";

  selectIngredient.classList.remove("is-valid");
  textUnitPrice.classList.remove("is-valid");
  textquantity.classList.remove("is-valid");
  textLineTotal.classList.remove("is-valid");

  //refresh inner table

  const displayPropertyList = [
    { property: getIngredientName, datatype: "function" },
    { property: "unitprice", datatype: "string" },
    { property: "quantity", datatype: "string" },
    { property: "linetotal", datatype: "string" },
    { property: "expiry_date", datatype: "string" },
  ];

  fillDataIntoInnerTable(
    tableIRNIng,
    irn.irnHasIngredientList,
    displayPropertyList,
    deleteIRNIng,
    true
  );

  let totalAmount = 0.0;
  for (const irnIng of irn.irnHasIngredientList) {
    totalAmount = parseFloat(totalAmount) + parseFloat(irnIng.linetotal);
  }
  textTotalAmount.value = parseFloat(totalAmount).toFixed(2);
  irn.total_amount = textTotalAmount.value;
  textTotalAmount.style.border = "2px dashed green";
};

const getIngredientName = (ob) => {
  return ob.ingredient_id.ingredientname;
};


const deleteIRNIng = (ob, rowIndex) => {
  let userConfirm = confirm(
    "Are you sure to remove following ingredient.... ? \n" +
      ob.ingredient_id.ingredientname
  );
  if (userConfirm) {
    irn.irnHasIngredientList.splice(rowIndex, 1);
    refreshIRNInnerFormTable();
    alert("Remove Successfully..!");
  }
};

const checkAvailability = () => {
  pohi = ajaxGetRequest("/pohi/listBypohi?ingredient="+JSON.parse(selectIngredient.value).id+"&purchaseorder="+JSON.parse(selectPOrder.value).id);
  if(pohi !=""){
    textUnitPrice.value = parseFloat(pohi.unitprice).toFixed(2);
    textquantity.value = parseFloat(pohi.quantity).toFixed(2);
    textLineTotal.value = parseFloat(pohi.linetotal).toFixed(2);

  }

  let selectedItem = JSON.parse(selectIngredient.value);


  let extIndex = irn.irnHasIngredientList
    .map((irnIng) => irnIng.ingredient_id.id)
    .indexOf(selectedItem.id);
  if (extIndex != -1) {
    alert("Selected Ingredient Allready exist..!");
    allitems = ajaxGetRequest("/ingredient/list");
    fillDataIntoSelect(
      selectIngredient,
      "Select Ingredient",
      allitems,
      "ingredientname"
    );
    selectIngredient.style.border = "1px solid #ced4da";
    irnhasingredient.ingredient_id = null;
  }}

const checkQuantity = () => {

if((parseFloat(textquantity.value) > 0 ) && (parseFloat() >=  parseFloat(textquantity.value))){
    alert("Quantity is within the ordered count..!");
    textquantity.style.border = "2px dashed green";
    textquantity.style.color = "green";
    textquantity.classList.add("is-valid");
}else{
  alert("Quantity is out of the ordered count..!");
  textquantity.style.border = "2px dashed red";
  textquantity.style.color = "red";
  textquantity.classList.remove("is-valid");
}

}


const calculateLinePrice = () => {
  //textquantity ,
  if (new RegExp("^[1-9][0-9]{0,5}$").test(textquantity.value)) {
    textLineTotal.value = (
      parseFloat(textquantity.value) * parseFloat(textUnitPrice.value)
    ).toFixed(2);
    textLineTotal.style.border = "2px dashed green";
    textLineTotal.style.color = "green";
    textLineTotal.classList.add("is-valid");

    textquantity.style.border = "2px dashed green";
    textquantity.style.color = "green";
    textquantity.classList.add("is-valid");

    irnhasingredient.quantity = textquantity.value;
    irnhasingredient.linetotal = textLineTotal.value;
    ButtonIRNIng.disabled = "";
  } else {
    ButtonIRNIng.disabled = "disabled";
    textquantity.style.border = "2px dashed red";
    textquantity.style.color = "red";
    textquantity.classList.remove("is-valid");
    textLineTotal.value = "";
    irnhasingredient.quantity = null;
    irnhasingredient.linetotal = null;
  }
};

const calculateByUnitPrice = () => {
  if (new RegExp("^([0-9]{2,5}|[0-9]{2,5}[.][0]{2})$").test(textUnitPrice.value)) {
    textLineTotal.value = (
      parseFloat(textquantity.value) * parseFloat(textUnitPrice.value)
    ).toFixed(2);
    textLineTotal.style.border = "2px dashed green";
    textLineTotal.style.color = "green";
    textLineTotal.classList.add("is-valid");

    textUnitPrice.style.border = "2px dashed green";
    textUnitPrice.style.color = "green";
    textUnitPrice.classList.add("is-valid");
    textUnitPrice.classList.remove("is-invalid");

    irnhasingredient.unitprice = textUnitPrice.value;
    irnhasingredient.linetotal = textLineTotal.value;
    ButtonIRNIng.disabled = "";
  } else {
    ButtonIRNIng.disabled = "disabled";
    textUnitPrice.style.border = "2px dashed red";
    textUnitPrice.style.color = "red";

    textLineTotal.value = "";
    textUnitPrice.classList.remove("is-valid");
    textUnitPrice.classList.add("is-invalid");
    irnhasingredient.unitprice = null;
    irnhasingredient.linetotal = null;
  }

}

const calculateNetAmount = () => {
  textNetAmount.value =
    parseFloat(textTotalAmount.value) -
    (parseFloat(textTotalAmount.value) * parseFloat(textDiscountRate.value)) /
      100;
  textNetAmount.style.border = "2px dashed green";
  textNetAmount.style.color = "green";
  textNetAmount.classList.add("is-valid");

  textTotalAmount.style.border = "2px dashed green";
  textTotalAmount.style.color = "green";
  textTotalAmount.classList.add("is-valid");

  irn.total_amount = textTotalAmount.value;
  irn.net_amount = textNetAmount.value;
};

const buttonIrnIngAdd = () => {
  let errors = checkInnerFormError();

  if (errors == "") {
    let userConfirm = confirm("Do you want to add the ingredient.. ?");
    if (userConfirm) {
      alert("Order ingrdient is added successfully....!");
      irn.irnHasIngredientList.push(irnhasingredient);
      refreshIRNInnerFormTable();
    }
  } else {
    alert("Fail to add order Ingredient....! \n" + errors);
  }
};

const checkInnerFormError = () => {
  let errors = "";

  if (irnhasingredient.ingredient_id == null) {
    errors = errors + "Please Select Ingredient...! \n";
  }

  if (irnhasingredient.quantity == null) {
    errors = errors + "Please Enter Proper Quantity...! \n";
  }

  return errors;
};

const getSuppliername = (ob) => {
  return ob.supplier_id.suppliername;
};

//create function get irn status
const getIRNStatus = (ob) => {

  if (ob.ingredientrecievenote_status_id.name == 'Received') {
    return ('<p class = "button-received">' + ob.ingredientrecievenote_status_id.name + "</p>");
  }
  if (ob.ingredientrecievenote_status_id.name == 'Cancelled') {
    return ('<p class = "button-cancel">' + ob.ingredientrecievenote_status_id.name + "</p>");
  }
  if (ob.ingredientrecievenote_status_id.name == 'Rejected') {
    return ('<p class = "button-delete">' + ob.ingredientrecievenote_status_id.name +"</p>");
  }

};

// function for edit customer record
const refillIRNForm = (ob, rowindex) => {
  irn = JSON.parse(JSON.stringify(ob));
  oldirn = JSON.parse(JSON.stringify(ob));

  //offcanvas open
  $("#offcanvasTop").offcanvas("show");

  divstatus.classList.remove('d-none');

  //set Value into static element
  //elementid.value = ob.relevantProertyname
  textSupBillNo.value = ob.supplierbill_no;
  textreceiveddate.value = ob.received_date;
  textTotalAmount.value = ob.total_amount;
  textDiscountRate.value = ob.discount_rate;
  textNetAmount.value = ob.net_amount;

  if (irn.note != null) textnote.value = ob.note;
  else textnote.value = "";

  //object eeken illaganawa property ekai eyage type ekai
  fillDataIntoSelect(selectSupplier,"Select Supplier",supplierList,"suppliername",irn.supplier_id.suppliername);
  // name ----> final property
  //final propert ekai display property ekai equal wenna oneh

  supplierwithporder = ajaxGetRequest("/purchaseorder/listbyporderstatus");
  supplierwithporder.push(irn.purchaseorder_id);

  fillDataIntoSelect(selectPOrder,"Select Purchase Order",supplierwithporder,"pordercode",irn.purchaseorder_id.pordercode);

  fillDataIntoSelect(selectIRNStatus,"Select IRN Status....!",irnstatuses,"name",irn.ingredientrecievenote_status_id.name);

  if (userPrivilege.update) {
    btnUpdateIRN.disabled = "";
    $("#btnUpdateIRN").css("cursor", "pointer");
  } else {
    btnUpdateIRN.disabled = "disabled";
    // btnUpdateIRN.style.cursor = "not-allowed";
    $("#btnUpdateIRN").css("cursor", "not-allowed");
  }
  btnAddIRN.disabled = "disabled";
  $("#btnAddIRN").css("cursor", "not-allowed");

  refreshIRNInnerFormTable();
};

//define function for check form updates
const checkFormUpdate = () => {
  let updates = "";
  //changes apply wenne irn ekata. propertyname != Oldemployee.propertyname

  if (irn.supplier_id.id != oldirn.supplier_id.id) {
    updates = updates + "Supplier Id is Changed " + oldirn.designation_id.id + " into " + irn.designation_id.id + "\n";
  }

  if (irn.supplierbill_no != oldirn.supplierbill_no) {
    updates = updates + "Supplier Bill No is Changed " + oldirn.supplierbill_no+ " into " + irn.supplierbill_no + "\n";
  }

  if (irn.purchaseorder_id.id != oldirn.purchaseorder_id.id) {
    updates = updates + "Purchase Order is Changed " + oldirn.purchaseorder_id.id + " into " + irn.purchaseorder_id.id + "\n";
  }

  if (irn.received_date != oldirn.received_date) {
    updates = updates + "Received Date Id is Changed " + oldirn.received_date + " into " + irn.received_date + "\n";
  }

  if (irn.discount_rate != oldirn.discount_rate) {
    updates = updates + "Discount Rate is Changed " + oldirn.discount_rate + " into " + irn.discount_rate + "\n";
  }
  if (irn.ingredientrecievenote_status_id.id != oldirn.ingredientrecievenote_status_id.id) {
    updates = updates + "IRN Status is Changed " + oldirn.ingredientrecievenote_status_id.id + " into " + irn.ingredientrecievenote_status_id.id + "\n";
  }




  return updates;
};

//define function for irn record
const buttonIRNUpdate = () => {
  console.log("update");
  console.log(irn);
  console.log(oldirn);

  //check form error
  let errors = checkFormError();
  if (errors == "") {
    //check form update
    let updates = checkFormUpdate();
    //it means as updates thiyenawa....
    if (updates != "") {
      //user confiramtion
      let userConfirm = confirm(
        updates + "\n Are you sure to update above changes........!"
      ); //following changes...
      if (userConfirm) {
        //call put service is checked if its true

        let serverResponce = ajaxRequestBody("/irn", "PUT", irn);
        //check put serviceresponse

        if (serverResponce == "OK") {
          alert("Update Successfully.....!");

          refreshIRNTable(); //table reset
          formirn.reset(); // form reset
          refreshIRNForm(); //dynamic elemet reset

          //offcanvas close
          $("#offcanvasTop").offcanvas("hide");
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
};
// here if we use the elemet the size of the data is high also if we use an id as obid it will be array its hard to catch in an order so its better to use index of a row
const deleteIRN = (ob, rowIndex) => {
  irn = ob;
  // const userConfirm = confirm('Are You Sure to delete the following Customer details \n'+ customers[rowindex].firstName);
  const userConfirm = confirm(
    "Are You Sure To Delete Following IRN...? \n" +
      "\n IRN ID is : " +
      ob.receivenote_no +
      "\n Full Name is : " +
      irn.supplier_id.name +
      "\n Calling Name is : " +
      irn.purchaseorder_id.pordercode
  );

  if (userConfirm) {
    //call delete services
    let serverResponce = ajaxRequestBody("/irn", "DELETE", irn);

    if (serverResponce == "OK") {
      alert("Delete Successfully.... :)");

      refreshIRNTable(); //table reset
      formirn.reset(); // form reset
      refreshIRNForm(); //dynamic elemet reset
    } else {
      alert(
        "Delete not completed, you have following error \n" + serverResponce
      );
    }
  }
};

//create  function for print customer record
const printIRN = (ob, rowIndex) => {
     //need to get full object of a row
     const irnPrint = ob;

     //tableid.1th child ge length eka ganawa
for (let i = 0; i < tableIRN.children[1].children.length; i++) {
tableIRN.children[1].children[i].style.backgroundColor = 'white';
}
//tableid
tableIRN.children[1].children[rowIndex].style.backgroundColor = 'pink';

tdNum.innerText = irnPrint.receivenote_no;
tdSuppliername.innerText = irnPrint.supplier_id.suppliername;
tdSupBillNo.innerText = irnPrint.supplierbill_no;
tdPOrder.innerText = irnPrint.purchaseorder_id.pordercode;
tdReceivedDate.innerText = irnPrint.received_date;
tdTotalAmount.innerText = irnPrint.total_amount;
tdDiscount.innerText = irnPrint.discount_rate;
tdNetAmount.innerText = irnPrint.net_amount;
tdStatus.innerText = irnPrint.ingredientrecievenote_status_id.name;

$('#modalPrintCustomer').modal('show');

}


const PrintIRNTableButton = () => {
  newTab = window.open();
  newTab.document.write(
      '<head><title>Print IRN</title>' +
      '<link rel="stylesheet" href="resources/bootstrap-5.3.2/css/bootstrap.' +
      'min.css">'+
      '</head>' +
      '<h2 style="margin-top: 100px">IRN Detail</h2>' +
      PrintUserTable.outerHTML
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
  refreshIRNTable();

  //need to hide modal
  $('#modalPrintIRN').modal('hide');
}

//create function for print employee table
const printIRNFullTable = () => {
  const newTab = window.open();
  newTab.document.write(
      '<head><title>Print IRN</title>' +
      ' <script src="\script\jQuery.js"></script>' +
      '<link rel="stylesheet" href="resources/bootstrap-5.3.2/css/bootstrap.' +
      'min.css">'+
      '</head>' +
      '<h2 style="margin-top: 100px">IRN Details</h2>' +
      tableIRN.outerHTML +
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
  let errors = "";

  if (irn.supplier_id == null) {
    selectSupplier.classList.add("is-invalid");
    selectSupplier.classList.remove("is-valid");
    errors = errors + "Enter Designation....! \n";
  }

  if (irn.supplierbill_no == null) {
    textSupBillNo.classList.add("is-invalid");
    textSupBillNo.classList.remove("is-valid");
    errors = errors + "Expecting a  Valid NIC....! \n";
  }

  if (irn.received_date == null) {
    textreceiveddate.classList.add("is-invalid");
    textreceiveddate.classList.remove("is-valid");
    errors = errors + "Enter Valid Mobile Number....! \n";
  }

  if (irn.total_amount == null) {
    textTotalAmount.classList.add("is-invalid");
    textTotalAmount.classList.remove("is-valid");
    errors = errors + "Expecting a  Valid E-mail Address....! \n";
  }

  if (irn.discount_rate == null) {
    textDiscountRate.classList.add("is-invalid");
    textDiscountRate.classList.remove("is-valid");
    errors = errors + "Enter Proper Address....! \n";
  }

  if (irn.net_amount == null) {
    textNetAmount.classList.add("is-invalid");
    textNetAmount.classList.remove("is-valid");
    errors = errors + "Enter Civil Status....! \n";
  }

  return errors;
};

//define function for submit customer
const submitIrn = () => {
  //need to check error
  const errors = checkFormError();
  if (errors == "") {
    //need to get user confirmation
    let userConfirm = window.confirm(
      "Are You Sure To Add Following IRN..... \n" +
        "\n First Name is : " +
        irn.receivenote_no +
        "\n NIC is : " +
        irn.supplier_id.suppliername +
        "\n Email is : " +
        irn.purchaseorder_id.pordercode
    );
    if (userConfirm) {
      //function predefined in common js for post put delete method
      let serverResponce = ajaxRequestBody("/irn", "POST", irn);

      if (serverResponce == "OK") {
        alert("Saved Successfully.... :)");

        refreshIRNTable(); //table reset
        formirn.reset(); // form reset
        refreshIRNForm(); //dynamic elemet reset

        //offcanvas close
        $("#offcanvasTop").offcanvas("hide");
      } else {
        alert(
          "Save Not Sucessfully Completed...! have Some Errors \n" +
            serverResponce
        );
      }
    }
  } else {
    alert("Forms Contains Errors.. :( \n\n" + errors);
  }
};
