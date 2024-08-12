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
   userPrivilege = ajaxGetRequest("/privilege/bylogedusermodule/Ingredient");
   //privilege object eka global kara hamathanama use karanna oneh nissa 

   //here calling the table refresh function when the browswer is loading 
   refreshtableStockDetailTable();

   stockdetail = new Object();

})


const refreshtableStockDetailTable = () => {
   //creating an array for store product  data list 

   stockdetails = ajaxGetRequest("/stockdetail/findall");

   //text -----> string,number,data
   //function -----> object,array,boolean
   //column count = object count
   const displayPropertyList = [
      { property: getIngredient , datatype: 'function' },
      { property: 'available_quantity', datatype: 'string' },
      { property: 'total_quantity', datatype: 'string' },
      { property: 'expire_date', datatype: 'string' }
   ];
   //call function fill data into table. this is an reusbale function 

    //(tableId,dataList,displayPropertyList, refillfunction name, delete function name, print function name, buttonvisibility)
    fillDataIntoTable2(tableStockDetail, stockdetails, displayPropertyList, true, userPrivilege);


   divModify.classList.add('d-none');


   //link for table search and sort item
   $("#tableStockDetail").dataTable();

}


const getIngredient = (ob) => {

   return ob.ingredient_id.ingredientname;

}

const printStockDetails = (ob,rowIndex) => {
      //need to get full object of a row
      const stockDetailPrint = ob;

      //tableid.1th child ge length eka ganawa
for (let i = 0; i < tableStockDetail.children[1].children.length; i++) {
tableStockDetail.children[1].children[i].style.backgroundColor = 'white';
}
//tableid
tableStockDetail.children[1].children[rowIndex].style.backgroundColor = 'pink';

tdIngredient.innerText = stockDetailPrint.ingredient_id.ingredientname;
tdAvailableQuantity.innerText = stockDetailPrint.available_quantity;
tdTotalQuantity.innerText = stockDetailPrint.total_quantity;
tdExpDate.innerText = stockDetailPrint.expire_date;


$('#modalPrintStockDetails').modal('show');

//need to refresh table
//refreshEmployeeTable();
}

const PrintStockDetailsTableButton = () => {
   newTab = window.open();
   newTab.document.write(
       '<head><title>Print Stock Details</title>' +
       '<link rel="stylesheet" href="resources/bootstrap-5.3.2/css/bootstrap.' +
       'min.css">'+
       '</head>' +
       '<h2 style="margin-top: 100px">Stock Details</h2>' +
       tableStockDetail.outerHTML
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
   refreshtableStockDetailTable();

   //need to hide modal
   $('#modalPrintStockDetails').modal('hide');
}

//create function for print employee table
const printStockDetailsFullTable = () => {
   const newTab = window.open();
   newTab.document.write(
       '<head><title>Print Stock Details</title>' +
       ' <script src="\script\jQuery.js"></script>' +
       '<link rel="stylesheet" href="resources/bootstrap-5.3.2/css/bootstrap.' +
       'min.css">'+
       '</head>' +
       '<h2 style="margin-top: 100px">Stock Details</h2>' +
       tableStockDetail.outerHTML +
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


