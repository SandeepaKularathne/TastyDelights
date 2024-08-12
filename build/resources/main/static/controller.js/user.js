
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
    userPrivilege = ajaxGetRequest("/privilege/bylogedusermodule/User");
    //privilege object eka global kara hamathanama use karanna oneh nissa 


    //tootltip unable
    $('[data-bs-toggle="tooltip"]').tooltip();

    //here calling the refresh function when the browswer is loading 
    refreshUserTable();

    //calling the form refresh function 
    refreshUserForm();


});

// create function table refresh 
const refreshUserTable = () => {

    users = ajaxGetRequest("/user/findall");

    //text ----> string,number , data
    // function ---> object , array , boolean
    //column count = object count
    const displayPropertyList = [
        { property: getEmployeename, datatype: 'function' },
        { property: 'username', datatype: 'string' },
        { property: 'email', datatype: 'string' },
        { property: getUserRole, datatype: 'function' },
        { property: getUserPhoto, datatype: 'function' },
        { property: getUserStatus, datatype: 'function' }

    ]

    fillDataIntoTable(tableUser, users, displayPropertyList, deleteDisableFunction, true, userPrivilege);

    divModify.classList.add('d-none');

    //link for table search and sort item
    $("#tableUser").dataTable();
}

const deleteDisableFunction = (ob) => {
    //record eka delete unama eka disbale krannai use karnnne ----> disable delete button 
    if (ob.status.name == "false") {
        btnTableDelete.disabled = "disabled";

    }

    if (ob.status.name == "true") {
        btnTableDelete.disabled = "";

    }
}


const refreshUserForm = () => {

    //create new object call user 
    user = new Object();

    olduser = null;

    user.roles = [];

    // selectEmployee.disabled = false;
    // textPassword.disabled = false;
    // textRePassword.disabled = false;


    //get employee list withoutuseraccount
    employeeListWithoutUserAccount = ajaxGetRequest("/employee/listbywithoutuseraccount");

    //call filldataintoselect function (elementid, displaymessage, datalist, displaypropertyname)
    fillDataIntoSelect(selectEmployee, "Select Employee", employeeListWithoutUserAccount, "fullname");




    //form eka load wenakotama auto binding karanwa
    user.status = true; //user object eke status eka true karanawa

    //need to get role list ---> meh role list eka anuwai data tikka frontend ekata genaganna oneh 
    roles = ajaxGetRequest("/role/list");

    // Fetch a list of roles without admin role
    roleListWithoutAdmin = ajaxGetRequest("/role/listwithoutadmin");

    // Clear the 'divRole' element
    divRoles.innerHTML = ""; //initillay empty karanne browser eka data watila thiyena eka clear wenna 

    // //Iterate over each role in the role list
    // roleListWithoutAdmin.forEach(element => {

    //     // Create a div element for each role
    //     let div = document.createElement("div")
    //     div.className = "form-check form-check-inline";

    //     // Create an input checkbox element
    //     let inputCheck = document.createElement("input");
    //     inputCheck.type = "checkbox";
    //     inputCheck.className = "form-check-input";

    //     // Add onchange event listener to the checkbox
    //     inputCheck.onchange = function () {

    //         // If the checkbox is checked, add the role to the 'user.roles' array
    //         if (this.checked) {
    //             user.roles.push(element);
    //         } else {
    //             // If the checkbox is unchecked, remove the role from the 'user.roles' array
    //             let extIndex = user.roles.map(role => role.name).indexOf(element.name);
    //             if (extIndex != -1) {
    //                 user.roles.splice(extIndex, 1);
    //             }
    //         }

    //     }

    //     // Create a label element for the role
    //     let label = document.createElement("label");
    //     label.className = "form-check-label fw-bold ms-2";
    //     label.innerText = element.name;

    //     // Append the checkbox and label elements to the div
    //     div.appendChild(inputCheck);
    //     div.appendChild(label);

    //     // Append the div to the 'divRole' element
    //     divRoles.appendChild(div);
    // });

    // Iterate over each role in the role list
    roleListWithoutAdmin.forEach(element => {

        // Create a div element for each role
        let div = document.createElement("div")
        div.className = "form-check form-switch";

        // Create an input switch element
        let inputSwitch = document.createElement("input");
        inputSwitch.type = "checkbox";
        inputSwitch.className = "form-check-input form-switch-input";

        // Add onchange event listener to the switch
        inputSwitch.onchange = function () {

            // If the switch is checked, add the role to the 'user.roles' array
            if (this.checked) {
                user.roles.push(element);
            } else {
                // If the switch is unchecked, remove the role from the 'user.roles' array
                let extIndex = user.roles.map(role => role.name).indexOf(element.name);
                if (extIndex != -1) {
                    user.roles.splice(extIndex, 1);
                }
            }

        }

        // Create a label element for the role
        let label = document.createElement("label");
        label.className = "form-check-label fw-bold ms-2";
        label.innerText = element.name;

        // Append the switch and label elements to the div
        div.appendChild(inputSwitch);
        div.appendChild(label);

        // Append the div to the 'divRoles' element
        divRoles.appendChild(div);
    });



    // Set the user status to false (inactive) and update the label accordingly
    user.status = false;
    labelUserStatus.innerText = 'User Account is Not-Active';


    //set default color
    selectEmployee.style.border = "2px solid #ced4da";
    textUsername.style.border = "2px solid #ced4da";
    textPassword.style.border = "2px solid #ced4da";
    textRePassword.style.border = "2px solid #ced4da";
    textEmail.style.border = "2px solid #ced4da";
    textnote.style.border = "2px solid #ced4da";

    selectEmployee.value = '';
    textUsername.value = '';
    textPassword.value = '';
    textRePassword.value = '';
    textEmail.value = '';
    textnote.value = '';

    user.design == null;
    fileProPhoto.files = null;
    imgProPhoto.src = "images/user/default.png";
    textProPhoto.value = "";

    selectEmployee.classList.remove("is-valid");
    textUsername.classList.remove("is-valid");
    textPassword.classList.remove("is-valid");
    textRePassword.classList.remove("is-valid");
    textEmail.classList.remove("is-valid");
    textnote.classList.remove("is-valid");


    btnUpdateUser.disabled = "disabled";
    // btnUpdateUser.style.cursor = "not-allowed";
    $("#btnUpdateUser").css("cursor", "not-allowed");


    if (userPrivilege.insert) {
        btnAddUser.disabled = "";
        $("#btnAddUser").css("cursor", "pointer");

    } else {
        btnAddUser.disabled = "disabled";
        $("#btnAddUser").css("cursor", "not-allowed");

    }
}



// Define a function named 'textRePasswordValidator'
const passwordRTValidator = () => {

    // Check if the password field is not empty
    if (textPassword.value != "") {

        // Check if the password and retype password fields match
        if (textPassword.value == textRePassword.value) {

            // If they match, set a green border around both password fields
            textPassword.style.border = "2px dashed green";
            textRePassword.style.border = "2px dashed green";

            // Set the password in the 'user' object to the value of the password field
            user.password = textPassword.value;
        } else {

            // If they don't match, set a red border around both password fields
            textPassword.style.border = "2px dashed red";
            textRePassword.style.border = "2px dashed red";

            // Set the password in the 'user' object to null
            user.password = null;
        }
    } else {

        // If the password field is empty, alert the user to fill it
        alert("Please Fill The Password Field..!");

        // Set a red border around both password fields
        textPassword.style.border = "2px solid red";
        textRePassword.style.border = "2px solid red";

        // Set the password in the 'user' object to null
        user.password = null;
    }

}



const getUserRole = (ob) => {

    let userRoles = "";
    ob.roles.forEach((element, index) => {
        if (index == ob.roles.length - 1) {
            userRoles = userRoles + element.name;

        } else {
            userRoles = userRoles + element.name + " , ";
        }


    });

    return userRoles;

}

const getUserStatus = (ob) => {

    if (ob.status == true) {
        return '<i class="fa-solid fa-user-check" style="color:#006b21 ;"></i>';
    }
    else {
        return '<i class="fa-solid fa-user-xmark" style="color:#b30021;"></i>';

    }
}
const getUserPhoto = (ob) => {

    if (ob.photopath == null) {
        return "<img src='images/user/default.png' style='width:50px;height:50px'>";
    }
    else {
        return "<img style='width:50px;height:50px' src='"+atob(ob.photopath)+"'>";

    }
}

const getEmployeename = (ob) => {
    return ob.employee_id.fullname;
}

// function for edit customer record 
const refillUserForm = (rowob, rowIndex) => {


    console.log("REFILL");

    // Create deep copies of the selected user object and store them in 'user' and 'olduser' variables
    user = JSON.parse(JSON.stringify(rowob));
    user.password = null;
    olduser = JSON.parse(JSON.stringify(rowob));


    //offcanvas open
    $('#offcanvasTop').offcanvas('show');


    // Set the values of the username and email input fields in the form to the corresponding values from the selected user object
    textUsername.value = user.username;
    textEmail.value = user.email;


    // Retrieve a list of employees without user accounts from the server and store it in the 'employeeListWithoutUserAccount' variable
    employeeListWithoutUserAccount = ajaxGetRequest("/employee/listbywithoutuseraccount");
    employeeListWithoutUserAccount.push(user.employee_id);


    // Fill data into the select element for selecting an employee, providing the list of employees without user accounts, and preselecting the current user's employee
    fillDataIntoSelect(selectEmployee, 'Select Employee', employeeListWithoutUserAccount, 'fullname', user.employee_id.fullname);


    // Retrieve a list of roles without the admin role from the server and store it in the 'roleListWithoutAdmin' variable
    roleListWithoutAdmin = ajaxGetRequest("/role/listwithoutadmin");
    divRoles.innerHTML = "";

    // Iterate over each role in the list of roles without the admin role
    roleListWithoutAdmin.forEach(element => {

        // Create a div element to hold the role checkbox and label
        let div = document.createElement("div")
        div.className = "form-check form-check-inline";

        // Create an input checkbox element
        let inputCheck = document.createElement("input");
        inputCheck.type = "checkbox";
        inputCheck.className = "form-check-input";

        // Define the onchange event handler for the checkbox
        inputCheck.onchange = function () {
            if (this.checked) {
                // If the checkbox is checked, add the role to the user's roles array
                user.roles.push(element);

            } else {
                // If the checkbox is unchecked, remove the role from the user's roles array
                let extIndex = user.roles.map(role => role.name).indexOf(element.name);
                if (extIndex != -1) {
                    user.roles.splice(extIndex, 1);
                }
            }

        }

        // Check if the current role exists in the user's roles array and set the checkbox accordingly
        let extIndex = user.roles.map(role => role.name).indexOf(element.name);
        if (extIndex != -1) {
            inputCheck.checked = true;
        }

        // Create a label element for the role
        let label = document.createElement("label");
        label.className = "form-check-label fw-bold ms-2";
        label.innerText = element.name;

        // Append the checkbox and label to the div element
        div.appendChild(inputCheck);
        div.appendChild(label);

        // Append the div element to the div with id 'divRole'
        divRoles.appendChild(div);
    });

    // Set the user status checkbox and label based on the status property of the user object
    if (user.status) {
        checkUserStatus.checked = true;
        labelUserStatus.innerText = 'User Account is active';

    } else {
        checkUserStatus.checked = false;
        labelUserStatus.innerText = 'User Account is Inactive';
    }


    //design refill

    if (user.design == null) {
        imgProPhoto.src = "images/user/default.png";
        textProPhoto.value = "";

    } else {
        imgProPhoto.src = btoa(user.design);
        textProPhoto.value = user.designname;

    }

    //selectEmployee.disabled = true;
    //textPassword.disabled = true;
    //textRePassword.disabled = true;

    if (userPrivilege.update) {
        btnUpdateUser.disabled = "";
        $("#btnUpdateUser").css("cursor", "pointer");

    } else {
        btnUpdateUser.disabled = "disabled";
        // btnUpdateUser.style.cursor = "not-allowed";
        $("#btnUpdateUser").css("cursor", "not-allowed");


    }
    btnAddUser.disabled = "disabled";
    $("#btnAddEmployee").css("cursor", "not-allowed");
};

// Define a function named 'checkUserFormUpdate'
const checkFormUpdate = () => {

    // Initialize the 'updates' variable as an empty string
    let updates = "";

    // Check if the username is changed
    if (user.username != olduser.username) {
        updates = updates + "User name is changed\n";
    }

    if (user.password != olduser.password) {
        updates = updates + "User password is changed\n";
    }

    if (user.status != olduser.status) {
        updates = updates + "User status is changed\n";
    }

    if (user.note != olduser.note) {
        updates = updates + "User note is changed\n";
    }


    if (user.email != olduser.email) {
        updates = updates + "User email is changed \n" + olduser.email + "into" + user.email + "\n";
    }

    if (user.employee_id.fullname != olduser.employee_id.fullname) {
        updates = updates + "Employee is changed" + olduser.employee_id.fullname + "into" + user.employee_id.fullname + "\n";
    }

    if (user.design != olduser.design) {
        updates = updates + "Design " + olduser.design + " is changed into " + user.design + "\n";
  
     }
  

    // Check if the number of roles is changed
    if (user.roles.length != olduser.roles.length) {
        updates = updates + "Roles is Changed \n";
    } else {

        // If the number of roles is the same, iterate through each role
        for (let element of user.roles) {

            // Check if each role in 'user.roles' exists in 'olduser.roles'
            let extRoleCount = olduser.roles.map(oldrole => oldrole.id).indexOf(element.id);

            // If any role is not found in 'olduser.roles', it indicates a change
            if (extRoleCount == -1) {
                updates = updates + "Role is Changed \n";
                break;
            }
        }


    }

    return updates;



}

//define function for employee record
const buttonUserUpdate = () => {
    console.log("update");
    console.log(user);
    console.log(olduser);

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

                let serverResponce = ajaxRequestBody("/user", "PUT", user)
                //check put serviceresponse

                if (serverResponce == "OK") {
                    alert("Update Successfully.....!");

                    refreshUserTable(); //table reset
                    userform.reset(); // form reset
                    refreshUserForm(); //dynamic elemet reset

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
const deleteUser = (ob, rowindex) => {
    // const userConfirm = confirm('Are You Sure to delete the following User details \n'+ customers[rowindex].firstName);
    const userConfirm = confirm('Are You Sure To Delete Following User...? \n'

        + '\n Employee is : ' + ob.employee_id.fullname
        + '\n User Name is : ' + ob.username
    );

    if (userConfirm) {
        let serverResponce = ajaxRequestBody("/user", "DELETE", user);

        if (serverResponce == 'OK') {
            alert('Delete Successfully....! ');

            refreshUserTable(); //table reset
            userform.reset(); // form reset
            refreshUserForm(); //dynamic elemet reset

        } else {
            alert('Delete not completed, you have following error \n' + serverResponce);
        }

    }
}

const printUser = (ob, rowIndex) => {
    //need to get full object of a row
    const userPrint = ob;

    //tableid.1th child ge length eka ganawa
    for (let i = 0; i < tableUser.children[1].children.length; i++) {
        tableUser.children[1].children[i].style.backgroundColor = 'white';
    }
    //tableid
    tableUser.children[1].children[rowIndex].style.backgroundColor = 'pink';

    tdEmp.innerText = userPrint.employee_id.fullname;
    tdUsername.innerText = userPrint.username;
    tdEmail.innerText = userPrint.email;
    tdRole.innerText = userPrint.role;
    tdUserStatus.innerText = userPrint.status;

    $('#modalPrintUser').modal('show');

    //need to refresh table
    //refreshEmployeeTable();

}

const PrintUserTableButton = () => {
    newTab = window.open();
    newTab.document.write(
        '<head><title>Print User</title>' +
        '<link rel="stylesheet" href="resources/bootstrap-5.3.2/css/bootstrap.' +
        'min.css">' +
        '</head>' +
        '<h2 style="margin-top: 100px">User Detail</h2>' +
        PrintUserTable.outerHTML
    );

    // This is a time interval - anith paththa open wela mili second 1000k giyata passe thamai
    // function eka athula execute wenne
    // time out handler function eka run wenne mili second gana giyata passe
    setInterval(
        function () {
            newTab.print();
        }, 1000
    )

    //need to refresh table and form
    refreshUserTable();

    //need to hide modal
    $('#PrintUserTable').modal('hide');
}

//create function for print employee table
const printUserFullTable = () => {
    const newTab = window.open();
    newTab.document.write(
        '<head><title>Print User</title>' +
        ' <script src="\script\jQuery.js"></script>' +
        '<link rel="stylesheet" href="resources/bootstrap-5.3.2/css/bootstrap.' +
        'min.css">' +
        '</head>' +
        '<h2 style="margin-top: 100px">User Details</h2>' +
        tableUser.outerHTML +
        '<script>$(".modify-button").css("display","none")</script>'

    );

    // This is a time interval - anith paththa open wela mili second 1000k giyata passe thamai
    // function eka athula execute wenne
    // time out handler function eka run wenne mili second gana giyata passe
    setInterval(
        function () {
            newTab.print();
        }, 1000
    )

}

const checkFormError = () => {
    let errors = '';

    if (user.employee_id == null) {
        selectEmployee.classList.add('is-invalid');
        selectEmployee.classList.remove('is-valid');
        errors = errors + "Employee  Can't Be Blank...! \n";
    }

    if (user.username == null) {
        textUsername.classList.add('is-invalid');
        textUsername.classList.remove('is-valid');
        errors = errors + "User Name Can't Be Blank...! \n";
    }

    if (olduser == null) {
     
        if (user.password == null) {
            textPassword.classList.add('is-invalid');
            textPassword.classList.remove('is-valid');
            errors = errors + "Expecting a  Valid Password....! \n";
        }

        if (textPassword.value !== textRePassword.value) {
            // textRePassword.classList.add('is-invalid');
            // textRePassword.classList.remove('is-valid');
            errors = errors + "Enter Correct Password ....! \n";
        }
    
    }
   


    if (user.email == null) {
        textEmail.classList.add('is-invalid');
        textEmail.classList.remove('is-valid');
        errors = errors + "Enter Valid Email....! \n";
    }

    return errors;
}


//define function for submit customer
const submitUser = () => {
    console.log(user);
    //need to check form error
    const errors = checkFormError();

    if (errors == '') {

        //need to get user confirmation
        let userConfirm = window.confirm('Are You Sure To Add Following User..... \n'
            + '\n Employee Name is : ' + user.employee_id.fullname
            + '\n User Name is : ' + user.username
            + '\n Email is : ' + user.email
        );

        if (userConfirm) {
            const serverResponce = ajaxRequestBody("/user", "POST", user);

            if (serverResponce == 'OK') {
                alert('Saved Successfully.... :)');

                refreshUserTable(); //table reset
                userform.reset(); //form reset
                refreshUserForm(); //dynamic elemet reset

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
    if (user.design != null) {
       const userConfirm = confirm("Are you sure to reset user image");
       if (userConfirm) {
          user.design == null;
          fileProPhoto.files = null;
          imgProPhoto.src = "images/user/default.png";
          textproductName.value = "";
          
       }
       
    } else {
       user.design == null;
       imgProPhoto.src = "images/user/default.png";
       textproductName.value = "";
       
    }
   
 }
