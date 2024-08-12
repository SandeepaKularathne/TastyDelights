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
  userPrivilege = ajaxGetRequest("/privilege/bylogedusermodule/Production");
  //privilege object eka global kara hamathanama use karanna oneh nissa

  //tooltip unable
  $('[ data-bs-toggle="tooltip" ]').tooltip();

  //here calling the refresh function when the browswer is loading
  refreshProductionTable();

  //calling the form refresh function

  refreshProductionForm();



});

const refreshProductionTable = () => {
  productions = ajaxGetRequest("/production/findall");

  //text -----> string,number,data
  //function -----> object,array,boolean
  //column count = object count

  const displayPropertyList = [
    { property: getCustomerOrder, datatype: "function" },
    { property: getProduct, datatype: "function" },
    { property: "ordered_qty", datatype: "string" },
    { property: "completed_qty", datatype: "string" },
    { property: "completed_datetime", datatype: "string" },
    { property: "completed_user", datatype: "string" },
  ];

  //call function fill data into table. this is an reusbale function

  //(tableId,dataList,displayPropertyList, refillfunction name, delete function name, print function name, buttonvisibility)
  fillDataIntoTable2(tableProduction,productions,displayPropertyList,true,userPrivilege);

  divModify.classList.add("d-none");

  //link for table search and sort item
  $("#tableProduction").dataTable();
};


const getCustomerOrder = () => {

}

const getProduct = () => {

}


// form Refresh Function
const refreshProductionForm = () => {
  // by creating an object its easy to connect the datas directly with backend
  production = new Object();

  //combination of porder object and productionhasingredient object list
  //meken inner table eka fill karanna puluwan .......
  production.productionHasIngredientList = new Array();

  coCodeList = ajaxGetRequest("/customerorder/cordercodelist");
  fillDataIntoSelect(selectCustomerOrder,"Select Customer Order",coCodeList,"customerorder_code");

  selectCustomerOrder.addEventListener('change', event => {

    productList = ajaxGetRequest("/product/listbycorder/" + JSON.parse(selectCustomerOrder.value).id);
    fillDataIntoSelect(selectProduct, "Select Product",productList,"productname");

 })


  //need to empty all elements
  selectCustomerOrder.value = "";
  selectProduct.value = "";
  textorderquantity.value = "";
  textcompletedquantity.value = "";
  textcompleteddate.value = "";
  textcompleteduser.value = "";

  //need to set default color
  selectCustomerOrder.style.border = "1px solid #ced4da";
  selectProduct.style.border = "1px solid #ced4da";
  textorderquantity.style.border = "1px solid #ced4da";
  textcompletedquantity.style.border = "1px solid #ced4da";
  textcompleteddate.style.border = "1px solid #ced4da";
  textcompleteduser.style.border = "1px solid #ced4da";


  selectCustomerOrder.classList.remove("is-valid");
  selectProduct.classList.remove("is-valid");
  textorderquantity.classList.remove("is-valid");
  textcompletedquantity.classList.remove("is-valid");
  textcompleteddate.classList.remove("is-valid");
  textcompleteduser.classList.remove("is-valid");


  btnUpdateProduction.disabled = "disabled";
  // btnUpdateProduction.style.cursor = "not-allowed";
  $("#btnUpdateProduction").css("cursor", "not-allowed");

  if (userPrivilege.insert) {
    btnAddProduction.disabled = "";
    $("#btnAddProduction").css("cursor", "pointer");
  } else {
    btnAddProduction.disabled = "disabled";
    $("#btnAddProduction").css("cursor", "not-allowed");
  }

  refreshIRNInnerTable();
};

const refreshIRNInnerTable = () => {
  // refresh inner form

  productionhasingredient = new Object();

 
  //refresh inner table

  const displayPropertyList = 
  [
    { property: getIngredient, datatype: "function"},
    { property: "quantity", datatype: "string"} 
  ];

  fillDataIntoInnerTable(tableProductionIng,production.productionHasIngredientList,displayPropertyList,deleteIRNIng,true);

};

const getIngQty = () => {


    phi = ajaxGetRequest("/phi/listbyphi?product="+JSON.parse(selectProduct.value).id);


    const displayPropertyList = 
    [
      { property: getIngredient, datatype: "function"},
      { property: "quantity", datatype: "string"} 
    ];

    fillDataIntoInnerTable(tableProductionIng,phi,displayPropertyList,deleteIRNIng,true);
   
   

};

const getIngredient = (ob) => {
  return phi.ingredient_id;


}


const deleteIRNIng = (ob, rowIndex) => {
  let userConfirm = confirm(
    "Are you sure to remove following ingredient.... ? \n" +
      ob.ingredient_id.ingredientname
  );
  if (userConfirm) {
    production.productionHasIngredientList.splice(rowIndex, 1);
    refreshIRNInnerTable();
    alert("Remove Successfully..!");
  }
};



// function for edit customer record
const refillProductionForm = (ob, rowindex) => {
  production = JSON.parse(JSON.stringify(ob));
  oldproduction = JSON.parse(JSON.stringify(ob));

  //offcanvas open
  $("#offcanvasTop").offcanvas("show");

  //set Value into static element
  //elementid.value = ob.relevantProertyname
  textfullName.value = ob.fullname;
  textCallingName.value = ob.callingname;
  textnic.value = ob.nic;
  txtdob.value = ob.dob;
  textEmail.value = ob.email;
  textMobile.value = ob.mobile;
  textaddress.value = ob.address;
  selectCivilStatus.value = ob.civilstatus;

  //optional fields
  if (production.landno != null) textMobile2.value = ob.mobile2;
  else textMobile2.value = "";

  if (production.note != null) textcompleteduser.value = ob.note;
  else textcompleteduser.value = "";

  //set value into radio element
  if (ob.gender == "Male") {
    radioMale.checked = true;
  } else {
    radioFemale.checked = true;
  }

  //object eeken illaganawa property ekai eyage type ekai
  fillDataIntoSelect(
    selectDesignation,
    "Select Designation....!",
    designations,
    "name",
    production.designation_id.name
  );
  // name ----> final property
  //final propert ekai display property ekai equal wenna oneh

  fillDataIntoSelect(
    selectIRNStatus,
    "Select IRN Status....!",
    employeeStatuses,
    "name",
    production.employeestatus_id.name
  );

  if (userPrivilege.update) {
    btnUpdateProduction.disabled = "";
    $("#btnUpdateProduction").css("cursor", "pointer");
  } else {
    btnUpdateProduction.disabled = "disabled";
    // btnUpdateProduction.style.cursor = "not-allowed";
    $("#btnUpdateProduction").css("cursor", "not-allowed");
  }
  btnAddProduction.disabled = "disabled";
  $("#btnAddProduction").css("cursor", "not-allowed");

  refreshIRNInnerTable();
};

//define function for check form updates
const checkFormUpdate = () => {
  let updates = "";
  //changes apply wenne production ekata. propertyname != Oldemployee.propertyname
  if (production.fullname != oldproduction.fullname) {
    updates =
      updates +
      "Full Name is Changed " +
      oldproduction.fullname +
      "into" +
      production.fullname +
      "\n";
  }

  if (production.callingname != oldproduction.callingname) {
    updates =
      updates +
      "Calling Name is Changed " +
      oldproduction.callingname +
      "into" +
      production.callingname +
      "\n";
  }

  if (production.nic != oldproduction.nic) {
    updates =
      updates + "NIC is Changed " + oldproduction.nic + "into" + production.nic + "\n";
  }

  if (production.gender != oldproduction.gender) {
    updates =
      updates +
      "Gender is Changed " +
      oldproduction.gender +
      "into" +
      production.gender +
      "\n";
  }

  if (production.dob != oldproduction.dob) {
    updates =
      updates +
      "Date of Birth is Changed " +
      oldproduction.dob +
      "into" +
      production.dob +
      "\n";
  }

  if (production.email != oldproduction.email) {
    updates =
      updates +
      "Email is Changed " +
      oldproduction.email +
      "into" +
      production.email +
      "\n";
  }

  if (production.mobile != oldproduction.mobile) {
    updates =
      updates +
      "Mobile is Changed " +
      oldproduction.mobile +
      "into" +
      production.mobile +
      "\n";
  }

  if (production.mobile2 != oldproduction.mobile2) {
    updates =
      updates +
      "Mobile2 is Changed " +
      oldproduction.mobile2 +
      "into" +
      production.mobile2 +
      "\n";
  }
  if (production.address != oldproduction.address) {
    updates =
      updates +
      "Address is Changed " +
      oldproduction.address +
      "into" +
      production.address +
      "\n";
  }
  if (production.note != oldproduction.note) {
    updates =
      updates +
      "Note is Changed " +
      oldproduction.note +
      "into" +
      production.note +
      "\n";
  }

  if (production.civilstatus != oldproduction.civilstatus) {
    updates =
      updates +
      "Civilstatus is Changed " +
      oldproduction.civilstatus +
      "into" +
      production.civilstatus +
      "\n";
  }

  if (production.designation_id.id != oldproduction.designation_id.id) {
    updates =
      updates +
      "Designation Id is Changed " +
      oldproduction.designation_id.id +
      "into" +
      production.designation_id.id +
      "\n";
  }

  if (production.employeestatus_id.id != oldproduction.employeestatus_id.id) {
    updates =
      updates +
      "IRNStatus Id is Changed " +
      oldproduction.employeestatus_id.id +
      "into" +
      production.employeestatus_id.id +
      "\n";
  }

  return updates;
};

//define function for production record
const buttonProductionUpdate = () => {
  console.log("update");
  console.log(production);
  console.log(oldproduction);

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

        let serverResponce = ajaxRequestBody("/production", "PUT", production);
        //check put serviceresponse

        if (serverResponce == "OK") {
          alert("Update Successfully.....!");

          refreshProductionTable(); //table reset
          formirn.reset(); // form reset
          console.log(aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa);
          refreshProductionForm(); //dynamic elemet reset

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
const deleteProduction= (ob, rowIndex) => {
  production = ob;
  // const userConfirm = confirm('Are You Sure to delete the following Customer details \n'+ customers[rowindex].firstName);
  const userConfirm = confirm(
    "Are You Sure To Delete Following IRN...? \n" +
      "\n IRN ID is : " +
      ob.receivenote_no +
      "\n Full Name is : " +
      production.supplier_id.name +
      "\n Calling Name is : " +
      production.purchaseorder_id.pordercode
  );

  if (userConfirm) {
    //call delete services
    let serverResponce = ajaxRequestBody("/production", "DELETE", production);

    if (serverResponce == "OK") {
      alert("Delete Successfully.... :)");

      refreshProductionTable(); //table reset
      formirn.reset(); // form reset
      refreshProductionForm(); //dynamic elemet reset
    } else {
      alert(
        "Delete not completed, you have following error \n" + serverResponce
      );
    }
  }
};

//create  function for print customer record
const printProduction = (ob, rowIndex) => {
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
};

const checkFormError = () => {
  let errors = "";

  if (production.supplier_id == null) {
    selectCustomerOrder.classList.add("is-invalid");
    selectCustomerOrder.classList.remove("is-valid");
    errors = errors + "Enter Designation....! \n";
  }


  if (production.received_date == null) {
    selectProduct.classList.add("is-invalid");
    selectProduct.classList.remove("is-valid");
    errors = errors + "Enter Valid Mobile Number....! \n";
  }

  if (production.total_amount == null) {
    textorderquantity.classList.add("is-invalid");
    textorderquantity.classList.remove("is-valid");
    errors = errors + "Expecting a  Valid E-mail Address....! \n";
  }

  if (production.discount_rate == null) {
    textcompletedquantity.classList.add("is-invalid");
    textcompletedquantity.classList.remove("is-valid");
    errors = errors + "Enter Proper Address....! \n";
  }

  if (production.net_amount == null) {
    textcompleteddate.classList.add("is-invalid");
    textcompleteddate.classList.remove("is-valid");
    errors = errors + "Enter Civil Status....! \n";
  }

  return errors;
};

//define function for submit customer
const submitProduction = () => {
  //need to check error
  const errors = checkFormError();
  if (errors == "") {
    //need to get user confirmation
    let userConfirm = window.confirm(
      "Are You Sure To Add Following IRN..... \n" +
        "\n First Name is : " +
        production.receivenote_no +
        "\n NIC is : " +
        production.supplier_id.suppliername +
        "\n Email is : " +
        production.purchaseorder_id.pordercode
    );
    if (userConfirm) {
      //function predefined in common js for post put delete method
      let serverResponce = ajaxRequestBody("/production", "POST", production);

      if (serverResponce == "OK") {
        alert("Saved Successfully.... :)");

        refreshProductionTable(); //table reset
        formirn.reset(); // form reset
        refreshProductionForm(); //dynamic elemet reset

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
