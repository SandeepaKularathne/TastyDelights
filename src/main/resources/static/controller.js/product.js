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
window.addEventListener('DOMContentLoaded', () => {

   //module name in module table should be same 
   userPrivilege = ajaxGetRequest("/privilege/bylogedusermodule/Product");
   //privilege object eka global kara hamathanama use karanna oneh nissa 
  


   //tooltip unable
   $('[ data-bs-toggle="tooltip" ]').tooltip();

   //here calling the refresh function when the browswer is loading 
   refreshProductTable();

   //calling the form refresh function 
   refreshProductForm();

})


const refreshProductTable = () => {

   product = ajaxGetRequest("/product/findall");


   //text -----> string,number,data
   //function -----> object,array,boolean
   //column count = object count
   const displayPropertyList = [
      { property: 'productcode', datatype: 'string' },
      { property: 'productname', datatype: 'string' },
      { property: 'design', datatype: 'photoarray' },
      { property: getProductStatus, datatype: 'function' },
      { property: getProductType, datatype: 'function' },
      { property: getProductFlavour, datatype: 'function' },
      { property: 'weight', datatype: 'string' },
      { property: 'price', datatype: 'string' },
      { property: 'note', datatype: 'string' }

   ];
   //call function fill data into table. this is an reusbale function 

   //(tableId,dataList,displayPropertyList, refillfunction name, delete function name, print function name, buttonvisibility)
   fillDataIntoTable(tableProduct, product, displayPropertyList, deleteDisableFunction, true, userPrivilege);

   divModify.classList.add('d-none');
   
   divstatus.classList.add('d-none');


   //link for table search and sort item
   $("#tableProduct").dataTable();

}


const deleteDisableFunction = (ob) => {  
   //record eka delete unama eka disbale krannai use karnnne ----> disable delete button 
   if (ob.productstatus_id.name == "Not-Available") {
      btnTableDelete.disabled = "disabled";

   }

   if (ob.productstatus_id.name == "Available") {
      btnTableDelete.disabled = "";

   }
}


// form Refresh Function
const refreshProductForm = () => {
   // by creating an object its easy to connect the datas directly with backend 
   product = new Object();

   //combination of porder object and porderhasingredient object list 
   //meken inner table eka fill karanna puluwan .......
   product.productHasIngredientList = new Array();

   productStatuses = ajaxGetRequest("/productstatus/findall");

   fillDataIntoSelect(textProductStatus, 'Select Product Status....!', productStatuses, 'name',"Available");
   product.productstatus_id = JSON.parse(textProductStatus.value); //meken html define karapu validator eka block welaa api asign karapu value eka penawaa


   productTypes = ajaxGetRequest("/producttype/findall");

   fillDataIntoSelect(textProductType, 'Select Product Type...!', productTypes, 'name');

   productFlavours = ajaxGetRequest("/productflavour/findall");

   fillDataIntoSelect(textFlavour, 'Select Product Flavour.....!', productFlavours, 'name');


   //need to empty all elements

   textproductName.value = '';
   textProductType.value = '';
   textFlavour.value = '';
   textproductweight.value = '';
   textPrice.value = '';
   textnote.value = '';

   product.design == null;
   fileProPhoto.files = null;
   imgProPhoto.src = "images/products/Gateaux/defaultimg.jpg";
   textproductName.value = "";

   //need to set default color
   textproductName.style.border = '1px solid #ced4da';
   textProductStatus.style.border = '2px dashed green';
   textProductStatus.style.color = 'green';
   textProductType.style.border = '1px solid #ced4da';
   textFlavour.style.border = '1px solid #ced4da';
   textproductweight.style.border = '1px solid #ced4da';
   textPrice.style.border = '1px solid #ced4da';
   textnote.style.border = '1px solid #ced4da';

   textproductName.classList.remove("is-valid");
   textProductStatus.classList.add("is-valid");
   textProductType.classList.remove("is-valid");
   textFlavour.classList.remove("is-valid");
   //textCustomizedesign.classList.remove("is-valid");
   textproductweight.classList.remove("is-valid");
   textPrice.classList.remove("is-valid");
   textnote.classList.remove("is-valid");

   refreshProductInnerFormTable();

   btnUpdateProduct.disabled = "disabled";
   // btnUpdateProduct.style.cursor = "not-allowed";
   $("#btnUpdateProduct").css("cursor" , "not-allowed");


   if (userPrivilege.insert) {
      btnAddProduct.disabled = "";
      $("#btnAddProduct").css("cursor", "pointer");
      
   } else {
      btnAddProduct.disabled = "disabled";
      $("#btnAddProduct").css("cursor", "not-allowed");
      
   }

}

const refreshProductInnerFormTable = () => {
   //refresh inner form 

   producthasingredient = new Object();

   // selectIngredient
   // textquantity

   allitems = ajaxGetRequest("/ingredient/list");
   fillDataIntoSelect2(selectIngredient, "Select Ingredient", allitems, 'ingredientname','unitofmeasurment');
   
   selectIngredient.value = '';
   textquantity.value = '';

   selectIngredient.style.color = 'black';
   selectIngredient.style.border = '1px solid #ced4da';
   textquantity.style.border = '1px solid #ced4da';

   selectIngredient.classList.remove("is-valid");
   textquantity.classList.remove("is-valid");


   //refresh inner table 
   const displayPropertyList = [
      { property: getIngredientName, datatype: 'function' },
      { property: 'quantity', datatype: 'string' }];

      
   fillDataIntoInnerTable(tableProIng, product.productHasIngredientList, displayPropertyList, deleteProIng, true);
}




const getIngredientName = (ob) => {
   return ob.ingredient_id.ingredientname;

}

const deleteProIng = (ob,rowIndex) => {
   let userConfirm = confirm("Are you sure to remove following ingredient.... ? \n" + ob.ingredient_id.ingredientname);
   if (userConfirm) {
      product.productHasIngredientList.splice(rowIndex, 1);
      refreshProductInnerFormTable();
      alert("Remove Successfully..!")
   }


}

const checkAvailability = () => {

   let selectedItem = JSON.parse(selectIngredient.value);

   let extIndex = product.productHasIngredientList.map(proitem => proitem.ingredient_id.id).indexOf(selectedItem.id);
   if (extIndex != -1) {
      alert("Selected Ingredient Allready exist..!");
      allitems = ajaxGetRequest("/ingredient/list");
      fillDataIntoSelect(selectIngredient, "Select Ingredient", allitems, 'ingredientname');
      selectIngredient.style.border = "1px solid #ced4da";
      producthasingredient.ingredient_id = null;
   }
}

const getProductStatus = (ob) => {

     
   if (ob.productstatus_id.name == 'Available') {
      return '<p class = "button-available">' + ob.productstatus_id.name + '</p>';
   }
   if (ob.productstatus_id.name == 'Not-Available') {
      return '<p class = "button-notavailable">' + ob.productstatus_id.name + '</p>';
   }
   
}

const checkInnerFormError = () => {
   let errors = "";

   if (producthasingredient.ingredient_id == null) {
      errors = errors + "Please Select Ingredient...! \n";
   }

   if (producthasingredient.quantity == null) {
      errors = errors + "Please Enter Proper Quantity...! \n";
   }

   return errors;

}

const buttonProIngAdd = () => {
   let errors = checkInnerFormError();

   if (errors == "") {
      let userConfirm = confirm("Do you want to add the ingredient.. ?");
      if (userConfirm) {
         alert("Order ingrdient is added successfully....!");
         product.productHasIngredientList.push(producthasingredient);
         refreshProductInnerFormTable();

      }
   } else {
      alert("Fail to add order Ingredient....! \n" + errors);
   }


}

const getProductType = (ob) => {

   return ob.producttype_id.name;

}

const getProductFlavour = (ob) => {

   return ob.flavour_id.name;

}


// function for edit customer record 
const refillProductForm = (ob, rowindex) => {
   //we are comparing the newly updates customer object and old cutsomer object before update it 
   product = JSON.parse(JSON.stringify(ob));
   oldproduct = JSON.parse(JSON.stringify(ob));

   //offcanvas open
   $('#offcanvasTop').offcanvas('show');

   divstatus.classList.remove('d-none');

   //set Value into static element
   //elementid.value = ob.relevantProertyname
   textproductName.value = ob.productname;
   textproductweight.value = ob.weight;
   textPrice.value = ob.price;

   //optional fields 
   if (product.note != null)
      textnote.value = ob.note; else textnote.value = "";

   // if (product.design != null)
   //    textCustomizedesign.value = ob.design; else textCustomizedesign.value = "";

   fillDataIntoSelect(textProductStatus, 'Select Product Status....!', productStatuses, 'name', product.productstatus_id.name);

   fillDataIntoSelect(textProductType, 'Select Product Type....!', productTypes, 'name', product.producttype_id.name);

   fillDataIntoSelect(textFlavour, 'Select Product Flavour....!', productFlavours, 'name', product.flavour_id.name);

   if (product.design == null) {
      imgProPhoto.src = "images/products/Gateaux/defaultimg.jpg";
      textProPhoto.value = "";
      
   } else {
      imgProPhoto.src = btoa(product.design);
      textProPhoto.value = product.designname;
      
   }

   if (userPrivilege.update) {
      btnUpdateProduct.disabled = "";
      $("#btnUpdateProduct").css("cursor" , "pointer");
      
   } else {
      btnUpdateProduct.disabled = "disabled";
   // btnUpdateProduct.style.cursor = "not-allowed";
   $("#btnUpdateProduct").css("cursor" , "not-allowed");

      
   }
   btnAddProduct.disabled = "disabled";
   $("#btnAddProduct").css("cursor" , "not-allowed");
   

   refreshProductInnerFormTable();
}



const checkFormUpdate = () => {
   let updates = "";

   //changes apply wenne employee ekata. propertyname != Oldemployee.propertyname

   if (product.productname != oldproduct.productname) {
      updates = updates + "Product Name  " + oldproduct.productname + " is changed into " + product.productname + "\n";

   }

   if (product.productstatus_id.id != oldproduct.productstatus_id.id) {
      updates = updates + "Product Status " + oldproduct.productstatus_id.name + " is changed into " + product.productstatus_id.name + "\n";

   }

   if (product.producttype_id.id != oldproduct.producttype_id.id) {
      updates = updates + "Product Type " + oldproduct.producttype_id.name + " is changed into" + product.producttype_id.name + "\n";

   }


   if (product.flavour_id.id != oldproduct.flavour_id.id) {
      updates = updates + "Product Flavour " + oldproduct.flavour_id.name + " is changed into " + product.flavour_id.name + "\n";

   }


   if (product.design != oldproduct.design) {
      updates = updates + "Design " + oldproduct.design + " is changed into " + product.design + "\n";

   }

   if (product.weight != oldproduct.weight) {
      updates = updates + "Weight  " + oldproduct.weight + " is changed into " + product.weight + "\n";

   }

   if (product.price != oldproduct.price) {
      updates = updates + "Price " + oldproduct.price + " is changed into " + product.price + "\n";

   }

   if (product.productHasIngredientList.length != oldproduct.productHasIngredientList.length) {
      updates = updates + "Added Ingredient/s is Changed \n";

   }else{
      for(let element of product.productHasIngredientList){
         let extIndex = oldproduct.productHasIngredientList.map((oldproduct) => oldproduct.id).indexOf(element.id);

         if (extIndex == -1) {
            updates = updates + "Added Ingredient/s is Changed \n";
            break;
            
         } else {
            if (element.quantity != oldproduct.productHasIngredientList[extIndex].quantity) {
               updates = updates + "Quantity for Ingredient " + element.ingredient_id.ingredientname + "has been chnaged : from" + oldproduct.productHasIngredientList[extIndex].quantity + " to " + element.quantity + "\n";

               
            }
            
         }
      }
   }




   return updates;

}

//define function for employee record
const buttonProductUpdate = () => {
   console.log("update");
   console.log(product);
   console.log(oldproduct);

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

            let serverResponce = ajaxRequestBody("/product", "PUT", product)
            //check put serviceresponse

            if (serverResponce == "OK") {
               alert("Update Successfully.....!");

               refreshProductTable(); //table reset
               formproduct.reset(); // form reset
               refreshProductForm(); //dynamic elemet reset

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
const deleteProduct = (ob, rowindex) => {

   product = ob;
   // const userConfirm = confirm('Are You Sure to delete the following Customer details \n'+ customers[rowindex].firstName);
   const userConfirm = confirm('Are You Sure To Delete Following Product...? \n'
      + '\n Product ID is : ' + product.productcode
      + '\n Product Name is : ' + product.productname);

   if (userConfirm) {

      let serverResponce = ajaxRequestBody("/product", "DELETE", product);

      //call delete services 

      if (serverResponce == 'OK') {
         alert('Delete Successfully....! ');

         refreshProductTable(); //table reset
         formproduct.reset(); //form reset
         refreshProductForm(); //dynamic elemet reset


      } else {
         alert('Delete not completed, you have following error \n' + serverResponce);
      }

   }
}

//create  function for print customer record
const printProduct = (ob, rowIndex) => {
      //need to get full object of a row
      const productPrint = ob;

      //tableid.1th child ge length eka ganawa
for (let i = 0; i < tableProduct.children[1].children.length; i++) {
tableProduct.children[1].children[i].style.backgroundColor = 'white';
}
//tableid
tableProduct.children[1].children[rowIndex].style.backgroundColor = 'pink';

tdNum.innerText = productPrint.productcode;
tdProductname.innerText = productPrint.productname;
tdProductImage.innerText = productPrint.design;
tdProductStatus.innerText = productPrint.productstatus_id.name;
tdType.innerText = productPrint.producttype_id.name;
tdFlavour.innerText = productPrint.flavour_id.name;
tdWeightPieces.innerText = productPrint.weight;
tdPrice.innerText = productPrint.price;
tdNote.innerText = productPrint.note;

$('#modalPrintProduct').modal('show');

}


const PrintProductableButton = () => {
   newTab = window.open();
   newTab.document.write(
       '<head><title>Print Product</title>' +
       '<link rel="stylesheet" href="resources/bootstrap-5.3.2/css/bootstrap.' +
       'min.css">'+
       '</head>' +
       '<h2 style="margin-top: 100px">Product Detail</h2>' +
       PrintProductTable.outerHTML
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
   refreshProductTable();

   //need to hide modal
   $('#PrintProductTable').modal('hide');
}

//create function for print employee table
const printProductFullTable = () => {
   const newTab = window.open();
   newTab.document.write(
       '<head><title>Print Product</title>' +
       ' <script src="\script\jQuery.js"></script>' +
       '<link rel="stylesheet" href="resources/bootstrap-5.3.2/css/bootstrap.' +
       'min.css">'+
       '</head>' +
       '<h2 style="margin-top: 100px">Product Details</h2>' +
       tableProduct.outerHTML +
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
   if (product.productname == null) {
      textproductName.classList.add('is-invalid');
      textproductName.classList.remove('is-valid');
      errors = errors + "Product Name Can't Be Blank...! \n";
   }

   if (product.producttype_id == null) {
      textProductType.classList.add('is-invalid');
      textProductType.classList.remove('is-valid');
      errors = errors + "Please Select a Product Type....! \n";
   }

   if (product.flavour_id == null) {
      textFlavour.classList.add('is-invalid');
      textFlavour.classList.remove('is-valid');
      errors = errors + "Please Select a Flavour....! \n";
   }

   if (product.productstatus_id == null) {
      textProductStatus.classList.add('is-invalid');
      textProductStatus.classList.remove('is-valid');
      errors = errors + "Please Select a Status....! \n";
   }

   if (product.weight == null) {
       textproductweight.classList.add('is-invalid');
       textproductweight.classList.remove('is-valid');
       errors = errors + "Please Enter Correct Weight....! \n";
    }

   if (product.price == null) {
      textPrice.classList.add('is-invalid');
      textPrice.classList.remove('is-valid');
      errors = errors + "Please Enter Proper Price....! \n";
   }


   return errors;
}

//define function for submit customer
const submitProduct = () => {

   //need to check error
   const errors = checkFormError();
   if (errors == '') {
      //need to get user confirmation
      let userConfirm = window.confirm('Are You Sure To Add Following Product..... \n'
         + '\n Product Code is : ' + product.productcode
         + '\n Product Name is : ' + product.productname
      );

      if (userConfirm) {
         //function predefined in common js for post put delete method
         let serverResponce = ajaxRequestBody("/product", "POST", product);

         if (serverResponce == 'OK') {
            alert('Saved Successfully.... :)');

            refreshProductTable(); //table reset
            formproduct.reset(); //form reset
            refreshProductForm(); //dynamic elemet reset


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

const buttonClearImage = () => {
   if (product.design != null) {
      const userConfirm = confirm("Are you sure to reset product image");
      if (userConfirm) {
         product.design == null;
         fileProPhoto.files = null;
         imgProPhoto.src = "images/products/Gateaux/defaultimg.jpg";
         textproductName.value = "";
         
      }
      
   } else {
      product.design == null;
      imgProPhoto.src = "images/products/Gateaux/defaultimg.jpg";
      textproductName.value = "";
      
   }
  
}