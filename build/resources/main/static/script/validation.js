//define function for validate land no field
const textValidator = (field, pattern, object, property) => { //since this is an reuable function so thru object we mean which form it means employee or product...
    const regPattern = new RegExp(pattern);
    if (field.value != '') {
        //if value exit
        if (regPattern.test(field.value)) {
            // console.log('valid');
            field.classList.remove("is-invalid");
            field.classList.add("is-valid");

            field.style.border = '3px dashed green';
            field.style.color = 'green';

            //bind value into object property 
            window[object][property] = field.value;
        } else {
            //invalid
            // console.log('Invalid');
            field.classList.remove('is-valid');
            field.classList.add('is-invalid');

            field.style.border = '3px dashed red';
            field.style.color = 'red';
            //need to bind null if it not having a value
            window[object][property] = null;
        }

    } else {
        //if value not exit
        window[object][property] = null;
        if (field.required) {
            field.style.border = '3px dashed red '
        } else {
            field.style.border = '1px solid #ced4da'
        }

    }

}

const checkBoxValidator = (fieldId, pattenr, object, property, trueValue, falseValue, labelId, labelTrueValue, LabelFalseValue) => {

    if (fieldId.checked) {
        window[object][property] = trueValue;
        labelId.innerText = labelTrueValue;
    } else {
        window[object][property] = falseValue;
        labelId.innerText = LabelFalseValue;
    }

}

//define function for validate select dynamic element
const selectDValidator = (field, pattern, object, property) => {

    if (field.value != '') {
        //valid
        field.classList.remove('is-invalid'); //bootstrap validation (correct Mark)
        field.classList.add('is-valid');

        field.style.border = '3px dashed green';
        field.style.color = 'green';
        window[object][property] = JSON.parse(field.value);
    } else {
        field.classList.remove = ('is-valid');
        field.classList.add = ('is-invalid');

        field.style.border = '3px dashed red';
        field.style.color = 'red';
        window[object][property] = null;
    }
}


//define function for validate select static element - Eg: Civilization 
const selectSValidator = (field, pattern, object, property) => {
    if (field.value != '') {
        //valid

        field.classList.remove('is-invalid'); //bootstrap validation (correct Mark)
        field.classList.add('is-valid');

        field.style.border = '3px dashed green';
        field.style.color = 'green';
        window[object][property] = (field.value); //bind value
    } else {
        field.classList.remove = ('is-valid');
        field.classList.add = ('is-invalid');

        field.style.border = '3px dashed red';
        field.style.color = 'red';
        window[object][property] = null; //bind for not having value
    }
}

//define function for FirstName & Last Name Validator
const textNameValidator = (field, pattern, object, property) => {
    if (new RegExp(pattern).test(field.value)) {
        //valid
        field.classList.remove("is-invalid");
        field.classList.add("is-valid");


        field.style.border = '3px dashed green';
        field.style.color = 'green';
        window[object][property] = (field.value); //bind value
    } else {
        //invalid
        field.classList.remove('is-valid');
        field.classList.add('is-invalid');


        field.style.border = '3px dashed red';
        field.style.color = 'red';
        window[object][property] = null;
    }


}


// // Set the min attribute for the date input field
// document.getElementById('textrequireddate').setAttribute('min', getTodayDate());

function validateDate(field, object, property) {
    const selectedDate = field.value;
    const currentDate = new Date();
    console.log(currentDate.toUTCString());
    const selectedDateTime = new Date(selectedDate + "T00:00:00");


    if (selectedDateTime >= currentDate.setHours(0, 0, 0, 0)) { // Adjusted to midnight for accurate comparison {
        // Handle invalid date (future date) using textValidator function

        field.classList.remove("is-invalid");
        field.classList.add("is-valid");
        window[object][property] = field.value;
        field.style.border = '3px dashed green';
        field.style.color = 'green';

    } else {
        // Handle valid date using textValidator function
        field.classList.remove('is-valid');
        field.classList.add('is-invalid');
        window[object][property] = null;
        field.style.border = '3px dashed red';
        field.style.color = 'red';


    }



}


//validation function for image 
const validateFileField = (fieldId, object, propertyOne, propertyTwo, oldObject, priviId, namefieldId) => {
    if (fieldId.value != "") {
        // console.log(fieldId.files);
        let file = fieldId.files[0];
        namefieldId.value = file["name"];
        window[object][propertyTwo] = file["name"];

        let fileReader = new FileReader();
        //'e' kiyanne onload ekata  adhala pass karana parameter 
        fileReader.onload = function (e) {
            priviId.src = e.target.result;
            window[object][propertyOne] = btoa(e.target.result); //methana enah result eka encrypt wenawa btoa dhanna nissa... backend ekata pass wenawaaa
        }

        //onload eka tigger wenawa
        fileReader.readAsDataURL(file);
        return; // meken thamai readAsDataURL mekaat anuwa onlead eka tigger wenne 

    }


}


//generate gender and dob from nic
const generateGenderDOB = (element) => {
    let nicValue = element.value;//nic value eka balanawa
    let year, month, date;
    let days;
    let dob;


    if (new RegExp("^(([0-9]{9}[VvXxSs])|([0-9]{12}))$").test(nicValue)) {
        if (nicValue.length == 10) {
            year = "19" + nicValue.substring(0, 2); //1st two digits
            days = nicValue.substring(2, 5); //2 to 5 digits 

        }
        if (nicValue.length == 12) {
            year = nicValue.substring(0, 4); //1st four digits
            days = nicValue.substring(4, 7); //4 to 7 digits 

        }
        
        if (days < 500) {
            radioMale.checked = true;
            employee.gender = "Male";

        } else {
            radioFemale.checked = true;
            days = days - 500;
            employee.gender = "Female";
        }
  
        let DOBDate = new Date(year); // year eka gatha nic eken 
       
        if (year % 4 != 0) {
            //thiyena date ekata nic eke thiyena date eka add karagena 1k adu kara 1ken patan ganna nissa
            DOBDate.setDate(DOBDate.getDate() + parseInt(days) - 1);

        } else {
            DOBDate.setDate(parseInt(days));
        }
      
        //month and date tikka methanin hadhagannawa
        month = DOBDate.getMonth() + 1
        if (month < 10) month = "0" + month;
        date = DOBDate.getDate();
        if (date < 10) date = "0" + date;

        dob = year + "-" + month + "-" + date;
        txtdob.value = dob;
        employee.dob = txtdob.value;

    } else {

    }


}

