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

window.addEventListener("DOMContentLoaded", () => {
   //module name in module table should be same
   userPrivilege = ajaxGetRequest("/privilege/bylogedusermodule/Supplier");
   //privilege object eka global kara hamathanama use karanna oneh nissa

   //tooltip unable
   $('[ data-bs-toggle="tooltip" ]').tooltip();

   //here calling the table refresh function when the browswer is loading
   refreshSupplierTable();

   //calling the form refresh function
   refreshSupplierForm();
});

const refreshSupplierTable = () => {
   //creating an array for store product  data list

   suppliers = ajaxGetRequest("/supplier/findall");

   //text -----> string,number,data
   //function -----> object,array,boolean
   //column count = object count
   const displayPropertyList = [
      { property: "supno", datatype: "string" },
      { property: "companyname", datatype: "string" },
      { property: "suppliername", datatype: "string" },
      { property: getSupplyitem, datatype: "function" },
      { property: "email", datatype: "string" },
      { property: "mobile", datatype: "string" },
      { property: "address", datatype: "string" },
      { property: getSupplierStatus, datatype: "function" },
   ];
   //call function fill data into table. this is an reusbale function

   //(tableId,dataList,displayPropertyList, refillfunction name, delete function name, print function name, buttonvisibility)
   fillDataIntoTable(tableSupplier,suppliers,displayPropertyList,deleteDisableFunction,true,userPrivilege);

   divModify.classList.add("d-none");



   //link for table search and sort item
   $("#tableSupplier").dataTable();
};

const deleteDisableFunction = (ob) => {
   //record eka delete unama eka disbale krannai use karnnne ----> disable delete button
   if (ob.supplierstatus_id.name == "In-Active") {
      btnTableDelete.disabled = "disabled";
   }

   if (ob.supplierstatus_id.name == "Active") {
      btnTableDelete.disabled = "";
   }
};

// form Refresh Function
const refreshSupplierForm = () => {
   // by creating an object its easy to connect the datas directly with backend
   supplier = new Object();

   //selected items..... items which we selected from all list comes from ingredient table
   supplier.ingredients = [];
   fillDataIntoSelect(selectItemList,"",supplier.ingredients,"ingredientname");

   //all lists comes from ingredient table...
   allitems = ajaxGetRequest("/ingredient/list");
   fillDataIntoSelect(allItemList, "", allitems, "ingredientname");

   supplierStatuses = ajaxGetRequest("/supplierstatus/findall");

   fillDataIntoSelect(
      textSupplierStatus,
      "Select Supplier Status....!",
      supplierStatuses,
      "name",
      "Active"
   );
   supplier.supplierstatus_id = JSON.parse(textSupplierStatus.value);

   //need to empty all elements
   textCompanyName.value = "";
   textSupplierName.value = "";
   allItemList.value = "";
   selectItemList.value = "";
   textEmail.value = "";
   textContactNo.value = "";
   textAddress.value = "";
   textaccNumber.value = "";
   textbeneficiaryName.value = "";
   textbankName.value = "";
   textbranch.value = "";

   //need to set default color
   textCompanyName.style.border = "1px solid #ced4da";
   textSupplierName.style.border = "1px solid #ced4da";
   allItemList.style.border = "1px solid #ced4da";
   selectItemList.style.border = "1px solid #ced4da";
   textEmail.style.border = "1px solid #ced4da";
   textContactNo.style.border = "1px solid #ced4da";
   textAddress.style.border = "1px solid #ced4da";
   textaccNumber.style.border = "1px solid #ced4da";
   textbeneficiaryName.style.border = "1px solid #ced4da";
   textbankName.style.border = "1px solid #ced4da";
   textbranch.style.border = "1px solid #ced4da";
   textSupplierStatus.style.border = "2px dashed green";
   textSupplierStatus.style.color = "green";

   textCompanyName.classList.remove("is-valid");
   textSupplierName.classList.remove("is-valid");
   allItemList.classList.remove("is-valid");
   selectItemList.classList.remove("is-valid");
   textSupplierStatus.classList.add("is-valid");
   textEmail.classList.remove("is-valid");
   textContactNo.classList.remove("is-valid");
   textAddress.classList.remove("is-valid");
   textaccNumber.classList.remove("is-valid");
   textbeneficiaryName.classList.remove("is-valid");
   textbankName.classList.remove("is-valid");
   textbranch.classList.remove("is-valid");

   btnUpdateSupplier.disabled = "disabled";
   // btnUpdateSupplier.style.cursor = "not-allowed";
   $("#btnUpdateSupplier").css("cursor", "not-allowed");

   if (userPrivilege.insert) {
      btnAddSupplier.disabled = "";
      $("#btnAddSupplier").css("cursor", "pointer");
   } else {
      btnAddSupplier.disabled = "disabled";
      $("#btnAddSupplier").css("cursor", "not-allowed");
   }
};

const getSupplyitem = (ob) => {
   let ingredient = "";
   for (const item of ob.ingredients) {
      ingredient = ingredient + item.ingredientname + " , ";
   }
   return ingredient;
};


const btnAddOneItem = () => {
   if (allItemList.value != "") {
      //get selected item object into selecteditem variable
      let selectedItem = JSON.parse(allItemList.value);
      //variable 1kak

      //add selected item object into selected item list
      supplier.ingredients.push(selectedItem);
      fillDataIntoSelect(
         selectItemList,
         "",
         supplier.ingredients,
         "ingredientname"
      ); //refresh right side

      //get selected item indext
      let extIndex = allitems.map((item) => item.id).indexOf(selectedItem.id);
      if (extIndex != -1) {
         allitems.splice(extIndex, 1); //remove selected items i all list
      }
      fillDataIntoSelect(allItemList, "", allitems, "ingredientname"); //refresh left side
   } else {
      alert("Please Select an Item");
   }
};

const btnAddAllItem = () => {
   for (const item of allitems) {
      supplier.ingredients.push(item);
   }
   fillDataIntoSelect(
      selectItemList,
      "",
      supplier.ingredients,
      "ingredientname"
   ); //refresh right side

   allitems = [];
   fillDataIntoSelect(allItemList, "", allitems, "ingredientname");
};

const btnRemoveOneItem = () => {
   if (selectItemList.value != "") {
      //get selected item object into selectedItem variable from selected side
      let selectedItem = JSON.parse(selectItemList.value);

      allitems.push(selectedItem);
      fillDataIntoSelect(allItemList, "", allitems, "ingredientname"); //refresh left side

      //get selected item index from selectedItem

      let extIndex = supplier.ingredients
         .map((item) => item.id)
         .indexOf(selectedItem.id);
      if (extIndex != -1) {
         supplier.ingredients.splice(extIndex, 1); //remove selected items i all list
      }
      fillDataIntoSelect(
         selectItemList,
         "",
         supplier.ingredients,
         "ingredientname"
      ); //refresh left side
   } else {
      alert("Please Select an Item from Select Item List....!");
   }
};

const btnRemoveAllItem = () => {
   for (const item of supplier.ingredients) {
      allitems.push(item);
   }
   fillDataIntoSelect(allItemList, "", allitems, "ingredientname"); //refresh right side

   supplier.ingredients = [];
   fillDataIntoSelect(
      selectItemList,
      "",
      supplier.ingredients,
      "ingredientname"
   );
};

const getSupplierStatus = (ob) => {
   if (ob.supplierstatus_id.name == "Active") {
      return '<p class = "button-active">' + ob.supplierstatus_id.name + "</p>";
   }

   if (ob.supplierstatus_id.name == "In-Active") {
      return '<p class = "button-inactive">' + ob.supplierstatus_id.name + "</p>";
   }
};

// function for edit customer record
const refillSupplierForm = (ob, rowindex) => {
   //  window.location.replace("/supplier?id="+ob.id); meken table form tikka ui 2k hadhuwama  edit karanna open karanna puluwan

   supplier = JSON.parse(JSON.stringify(ob));
   oldsupplier = JSON.parse(JSON.stringify(ob));

   // offcanvas open
   $("#offcanvasTop").offcanvas("show");

  

   textCompanyName.value = ob.companyname;
   textSupplierName.value = ob.suppliername;
   // selectAllItem.value = ob.fullname;
   selectItemList.value = ob.fullname;
   textEmail.value = ob.email;
   textContactNo.value = ob.mobile;
   textAddress.value = ob.address;

   //optional fields
   if (supplier.accountno != null) textaccNumber.value = ob.accountno;
   else textaccNumber.value = "";

   if (supplier.beneficiaryname != null)
      textbeneficiaryName.value = ob.beneficiaryname;
   else textbeneficiaryName.value = "";

   if (supplier.bankname != null) textbankName.value = ob.bankname;
   else textbankName.value = "";

   if (supplier.branch != null) textbranch.value = ob.branch;
   else textbranch.value = "";

   //object eeken illaganawa property ekai eyage type ekai
   fillDataIntoSelect(
      textSupplierStatus,
      "Select Supplier Status....!",
      supplierStatuses,
      "name",
      supplier.supplierstatus_id.name
   );
   // name ----> final property
   //final propert ekai display property ekai equal wenna oneh

   fillDataIntoSelect(
      selectItemList,
      "",
      supplier.ingredients,
      "ingredientname"
   ); //right side column

   //all lists comes from ingredient table...
   allitems = ajaxGetRequest("/ingredient/listwithoutsupplier/" + supplier.id);
   fillDataIntoSelect(allItemList, "", allitems, "ingredientname");

   if (userPrivilege.update) {
      btnUpdateSupplier.disabled = "";
      $("#btnUpdateSupplier").css("cursor", "pointer");
   } else {
      btnUpdateSupplier.disabled = "disabled";
      // btnUpdateSupplier.style.cursor = "not-allowed";
      $("#btnUpdateSupplier").css("cursor", "not-allowed");
   }
   btnAddSupplier.disabled = "disabled";
   $("#btnAddSupplier").css("cursor", "not-allowed");
};

//define function for check form updates
const checkFormUpdate = () => {
   let updates = "";
   //changes apply wenne employee ekata. propertyname != Oldemployee.propertyname
   if (supplier.companyname != oldsupplier.companyname) {
      updates =
         updates +
         "Company Name is Changed " +
         oldsupplier.companyname +
         "into" +
         supplier.companyname +
         "\n";
   }

   if (supplier.suppliername != oldsupplier.suppliername) {
      updates =
         updates +
         "Supplier Name is Changed " +
         oldsupplier.suppliername +
         "into" +
         supplier.suppliername +
         "\n";
   }

   if (supplier.mobile != oldsupplier.mobile) {
      updates =
         updates +
         "Mobile is Changed " +
         oldsupplier.mobile +
         "into" +
         supplier.mobile +
         "\n";
   }

   if (supplier.landno != oldsupplier.landno) {
      updates =
         updates +
         "Landno is Changed " +
         oldsupplier.landno +
         "into" +
         supplier.landno +
         "\n";
   }

   if (supplier.address != oldsupplier.address) {
      updates =
         updates +
         "Address is Changed " +
         oldsupplier.address +
         "into" +
         supplier.address +
         "\n";
   }

   if (supplier.email != oldsupplier.email) {
      updates =
         updates +
         "Email is Changed " +
         oldsupplier.email +
         "into" +
         supplier.email +
         "\n";
   }

   // Check if the number of supplier.ingredients is changed
   if (
      supplier.ingredients.length !=
      oldsupplier.ingredients.length
   ) {
      updates = updates + "Selected Ingredients is Changed \n";
   } else {
      // If the number of supplier.ingredients is the same, iterate through each role
      for (let element of supplier.ingredients) {
         // Check if each role in 'supplier.supplier.ingredients' exists in 'oldsupplier.supplier.ingredients'
         let extSelectedItemCount = oldsupplier.ingredients
            .map((oldsupplieritem) => oldsupplieritem.id)
            .indexOf(element.id);

         // If any role is not found in 'oldsupplier.supplier.ingredients', it indicates a change
         if (extSelectedItemCount == -1) {
            updates = updates + "Ingredient is Changed \n";
            break;
         }
      }
   }
   if (supplier.accountno != oldsupplier.accountno) {
      updates =
         updates +
         "Account Number is Changed " +
         oldsupplier.accountno +
         "into" +
         supplier.accountno +
         "\n";
   }

   if (supplier.beneficiaryname != oldsupplier.beneficiaryname) {
      updates =
         updates +
         "Beneficiary Name is Changed " +
         oldsupplier.beneficiaryname +
         "into" +
         supplier.beneficiaryname +
         "\n";
   }

   if (supplier.bankname != oldsupplier.bankname) {
      updates =
         updates +
         "Bank Name is Changed " +
         oldsupplier.bankname +
         "into" +
         supplier.bankname +
         "\n";
   }

   if (supplier.branch != oldsupplier.branch) {
      updates =
         updates +
         "Company Name is Changed " +
         oldsupplier.branch +
         "into" +
         supplier.branch +
         "\n";
   }

   if (supplier.supplierstatus_id.name != oldsupplier.supplierstatus_id.name) {
      updates =
         updates +
         "Supplier Status is Changed " +
         oldsupplier.supplierstatus_id.name +
         "into" +
         supplier.supplierstatus_id.name +
         "\n";
   }

   return updates;
};

//define function for employee record
const buttonSupplierUpdate = () => {
   console.log("update");
   console.log(supplier);
   console.log(oldsupplier);

   //check form error
   let errors = checkFormError();
   if (errors == "") {
      //check form update
      let updates = checkFormUpdate();
      //it means as updates thiyenawa....
      if (updates != "") {
         //supplier confiramtion
         let userConfirm = confirm(
            updates + "\n Are you sure to update above changes........!"
         ); //following changes...
         if (userConfirm) {
            //call put service is checked if its true

            let serverResponce = ajaxRequestBody("/supplier","PUT",supplier);
            //check put serviceresponse

            if (serverResponce == "OK") {
               alert("Update Successfully.....!");

               refreshSupplierTable(); //table reset
               formsupplier.reset(); // form reset
               refreshSupplierForm(); //dynamic elemet reset

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
const deleteSupplier = (ob, rowindex) => {
   supplier = ob;
   // const userConfirm = confirm('Are You Sure to delete the following Customer details \n'+ customers[rowindex].firstName);
   const userConfirm = confirm(
      "Are You Sure To Delete Following Product...? \n" +
      "\n Company Name is : " +
      ob.companyname +
      "\n Product Name is : " +
      ob.suppliername
   );

   if (userConfirm) {
      let serverResponce = ajaxRequestBody("/supplier", "DELETE", supplier);

      if (serverResponce == "OK") {
         alert("Delete Successfully....! ");

         refreshSupplierTable(); //table reset
         formsupplier.reset(); // form reset
         refreshSupplierForm(); //dynamic elemet reset
      } else {
         alert(
            "Delete not completed, you have following error \n" + serverResponce
         );
      }
   }
};

//create  function for print customer record
const printSupplier = (ob, rowIndex) => { 
      //need to get full object of a row
      const supplierPrint = ob;

      //tableid.1th child ge length eka ganawa
for (let i = 0; i < tableSupplier.children[1].children.length; i++) {
tableSupplier.children[1].children[i].style.backgroundColor = 'white';
}
//tableid
tableSupplier.children[1].children[rowIndex].style.backgroundColor = 'pink';

tdNum.innerText = supplierPrint.supno;
tdCompanyName.innerText = supplierPrint.companyname;
tdSuppliername.innerText = supplierPrint.suppliername;
tdSupplyItem.innerText = supplierPrint. supplier.ingredients.ingredientname;
tdEmail.innerText = supplierPrint.email;
tdContactNo.innerText = supplierPrint.mobile;
tdAddress.innerText = supplierPrint.address;
tdSupplierStatus.innerText = supplierPrint.supplierstatus_id.name;



$('#modalPrintSupplier').modal('show');

//need to refresh table
//refreshEmployeeTable();
};

const PrintSupplierTableButton = () => {
   newTab = window.open();
   newTab.document.write(
       '<head><title>Print Supplier</title>' +
       '<link rel="stylesheet" href="resources/bootstrap-5.3.2/css/bootstrap.' +
       'min.css">'+
       '</head>' +
       '<h2 style="margin-top: 100px">Supplier Detail</h2>' +
       PrintSupplierTable.outerHTML
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
   refreshSupplierTable();

   //need to hide modal
   $('#modalPrintSupplier').modal('hide');
}

//create function for print employee table
const printSupplierFullTable = () => {
   const newTab = window.open();
   newTab.document.write(
       '<head><title>Print Supplier</title>' +
       ' <script src="\script\jQuery.js"></script>' +
       '<link rel="stylesheet" href="resources/bootstrap-5.3.2/css/bootstrap.' +
       'min.css">'+
       '</head>' +
       '<h2 style="margin-top: 100px">Supplier Details</h2>' +
       tableSupplier.outerHTML +
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

   if (supplier.companyname == null) {
      textCompanyName.classList.add("is-invalid");
      textCompanyName.classList.remove("is-valid");
      errors = errors + "Company Name Can't Be Blank...! \n";
   }

   if (supplier.suppliername == null) {
      textSupplierName.classList.add("is-invalid");
      textSupplierName.classList.remove("is-valid");
      errors = errors + "Supplier Name Can't Be Blank...! \n";
   }

   if (supplier.email == null) {
      textEmail.classList.add("is-invalid");
      textEmail.classList.remove("is-valid");
      errors = errors + "Please Enter Correct E-Mail...! \n";
   }

   if (supplier.mobile == null) {
      textContactNo.classList.add("is-invalid");
      textContactNo.classList.remove("is-valid");
      errors = errors + "Please Enter Correct Mobile Number....! \n";
   }

   if (supplier.address == null) {
      textAddress.classList.add("is-invalid");
      textAddress.classList.remove("is-valid");
      errors = errors + "Please Enter Proper Address....! \n";
   }

   return errors;
};

//define function for submit customer
const submitSupplier = () => {
   //need to check error
   const errors = checkFormError();
   if (errors == "") {
      //need to get supplier confirmation
      let userConfirm = window.confirm(
         "Are You Sure To Add Following Supplier..... \n" +
         "\n Company Name is : " +
         supplier.companyname +
         "\n Supplier Name is : " +
         supplier.suppliername +
         "\n Email is : " +
         supplier.email +
         "\n Mobile is : " +
         supplier.mobile
      );

      if (userConfirm) {
         let serverResponce = ajaxRequestBody("/supplier", "POST", supplier);

         if (serverResponce == "OK") {
            alert("Saved Successfully.... :)");

            refreshSupplierTable(); //table reset
            formsupplier.reset(); // form reset
            refreshSupplierForm(); //dynamic elemet reset

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
      alert("Forms Contains Errors.. :) \n\n" + errors);
   }
};
