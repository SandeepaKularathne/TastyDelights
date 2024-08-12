
//create function for fill data into table 
//these are renamed to use as a common function for all the tables 
const fillDataIntoInnerTable = (tableId, dataList, displayColumnList, deleteButtonFunction,
  buttonVisibility = true) => {

  // after creating above array we have to add these into our table so creating a variable call tableBody
  // tableUser is ID of Table 
  const tableBody = tableId.children[1];
  tableBody.innerHTML = '';
  // element eka object 
  dataList.forEach((element, index) => {
    //creating a row as tr 
    const tr = document.createElement('tr');
    //for the row to insert data creating td it means index eka create kara
    const tdIndex = document.createElement('td');
    // index will increase as per the record we insert create karapu index eka appen kara
    tdIndex.innerText = parseInt(index) + 1;
    tr.appendChild(tdIndex); //index eka mulin enna oneh nissa udin append karala thiyenne 

    //methana displayColumnList eken data tikka adhala td ekata add wegena yanawa 
    for (const elementob of displayColumnList) {
      const td = document.createElement('td');
      // td.innerText = element.Cus_Id;


      /*  here we mean element eken thiyana object wala datatype eka string nm 
       ewage property tikka table eka wetanna oneh ekai innertext eka use karala thiyenne  */
      if (elementob.datatype == 'string') {
        //datalist eken index ekkata adhala property eka illagannawa
        td.innerText = dataList[index][elementob.property];
      } if (elementob.datatype == 'function') {
        td.innerHTML = elementob.property(element);
      }

      tr.appendChild(td);
    }

    const tdButton = document.createElement('td');

    const buttonDelete = document.createElement('button');
    buttonDelete.className = 'btn btn-delete ms-1 me-1';
    buttonDelete.innerHTML = '<i class="fa-solid fa-trash fa-beat"></i>';
    buttonDelete.onclick = function () {
      //console.log('Delete');
      deleteButtonFunction(element, index);
    }
    tdButton.appendChild(buttonDelete);


    if (buttonVisibility) {
      tr.appendChild(tdButton); //append tdbutton into table row
    }



    tableBody.appendChild(tr); //table row append into table body
  });



}




//create function for fill data into table 
//these are renamed to use as a common function for all the tables

const fillDataIntoTable = (tableId, dataList, displayColumnList, refillfunction, buttonVisibility = true, userPrivilege) => {

  // after creating above array we have to add these into our table so creating a variable call tableBody
  // tableUser is ID of Table 
  const tableBody = tableId.children[1];
  tableBody.innerHTML = '';
  // element eka object 
  dataList.forEach((element, index) => {
    //creating a row as tr 
    const tr = document.createElement('tr');
    //for the row to insert data creating td it means index eka create kara
    const tdIndex = document.createElement('td');
    // index will increase as per the record we insert create karapu index eka appen kara
    tdIndex.innerText = index + 1;
    tr.appendChild(tdIndex);//index eka mulin enna oneh nissa udin append karala thiyenne 

    //methana displayColumnList eken data tikka adhala td ekata add wegena yanawa 
    for (const elementob of displayColumnList) {
      const td = document.createElement('td');
      // td.innerText = element.Cus_Id;


      /*  here we mean element eken thiyana object wala datatype eka string nm 
       ewage property tikka table eka wetanna oneh ekai innertext eka use karala thiyenne  */
      if (elementob.datatype == 'string') {
        //datalist eken index ekkata adhala property eka illagannawa
        td.innerText = dataList[index][elementob.property];
      }
      if (elementob.datatype == 'function') {
        td.innerHTML = elementob.property(element);
      }

      if (elementob.datatype == 'photoarray') {
        let img = document.createElement("img");
        img.style.width = "75px";
        img.style.height = "75px";
        //property eka null check karanawa
        if (dataList[index][elementob.property] == null) {
          img.src = "images/products/Gateaux/defaultimg.jpg"


        } else {
          img.src = atob(dataList[index][elementob.property]);


        }
        td.appendChild(img);
      }

      tr.appendChild(td);
    }

    //tdButton.appendChild(buttonEdit);----------> add edit button into column

    const tdButton = document.createElement('td');

    const inputRadio = document.createElement('input');
    inputRadio.name = 'modify';
    inputRadio.type = 'radio';
    inputRadio.className = 'form-check-input mt-3';

    inputRadio.onchange = () => {
      divModify.className = ''; // from this edit print option will show once we click the radio buttons 


      if (!userPrivilege.update) {
        btnTableUpdate.disabled = "disabled";
        btnTableUpdate.style.cursor = "not-allowed";
      }

      if (!userPrivilege.delete) {
        btnTableDelete.disabled = "disabled";
        btnTableDelete.style.cursor = "not-allowed";
      }

      refillfunction(element)

      window['editOb'] = element;
      window['editRow'] = index;
    }

    tdButton.appendChild(inputRadio);
    if (buttonVisibility) {
      tr.appendChild(tdButton); //append tdbutton into table row
    }

    tableBody.appendChild(tr); //table row append into table body
  });


}


//table funtion for module not have  delete, update function
const fillDataIntoTable2 = (tableId, dataList, displayColumnList, buttonVisibility = true, userPrivilege) => {

  // after creating above array we have to add these into our table so creating a variable call tableBody
  // tableUser is ID of Table 
  const tableBody = tableId.children[1];
  tableBody.innerHTML = '';
  // element eka object 
  dataList.forEach((element, index) => {
    //creating a row as tr 
    const tr = document.createElement('tr');
    //for the row to insert data creating td it means index eka create kara
    const tdIndex = document.createElement('td');
    // index will increase as per the record we insert create karapu index eka appen kara
    tdIndex.innerText = index + 1;
    tr.appendChild(tdIndex);//index eka mulin enna oneh nissa udin append karala thiyenne 

    //methana displayColumnList eken data tikka adhala td ekata add wegena yanawa 
    for (const elementob of displayColumnList) {
      const td = document.createElement('td');
      // td.innerText = element.Cus_Id;


      /*  here we mean element eken thiyana object wala datatype eka string nm 
       ewage property tikka table eka wetanna oneh ekai innertext eka use karala thiyenne  */
      if (elementob.datatype == 'string') {
        //datalist eken index ekkata adhala property eka illagannawa
        td.innerText = dataList[index][elementob.property];
      }
      if (elementob.datatype == 'function') {
        td.innerHTML = elementob.property(element);
      }

      tr.appendChild(td);
    }

    //tdButton.appendChild(buttonEdit);----------> add edit button into column

    const tdButton = document.createElement('td');
    tdButton.className = 'modify-button';

    const inputRadio = document.createElement('input');
    inputRadio.name = 'modify';
    inputRadio.type = 'radio';
    inputRadio.className = 'form-check-input mt-3';

    inputRadio.onchange = () => {
      divModify.className = ''; // from this edit print option will show once we click the radio buttons 


      if (!userPrivilege.update) {
        btnTableUpdate.disabled = "disabled";
        btnTableUpdate.style.cursor = "not-allowed";
      }

      if (!userPrivilege.delete) {
        btnTableDelete.disabled = "disabled";
        btnTableDelete.style.cursor = "not-allowed";
      }

      window['editOb'] = element;
      window['editRow'] = index;
    }

    tdButton.appendChild(inputRadio);
    if (buttonVisibility) {
      tr.appendChild(tdButton); //append tdbutton into table row
    }

    tableBody.appendChild(tr); //table row append into table body
  });


}



