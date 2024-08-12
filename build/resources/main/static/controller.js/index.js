const btnSignOut = () => {
    console.log("Log Out");

    let userConfirm = confirm("Are you sure to signout ...?");
    if (userConfirm) {
        window.location.assign("/logout");
        
    }
    
}

// const submitUserSetting = () => {
//     let serverResponce = ajaxRequestBody("/changeuser", "PUT", loggeduser)
//     if (serverResponce == "OK") {
//         alert("User Profile Change Successfully.....! \n");
//         window.location.assign("/logout")
    

//      } else {
//         alert("User Profile Change Not Successfully....! have some errors \n" + serverResponce);
//      }
// }

// const refreshProfileEditForm = () => {
//     loggeduser = ajaxGetRequest("/loggeduser");
// }