package lk.tastydelights.user;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import lk.tastydelights.privilege.PrivilegeController;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

@RestController
@RequestMapping(value = "/user") // class level mapping. meka use karama mapping name value eka liyadhi /user
                                 // eken patanganna oneh nah.
public class UserController {

    // create UseruserDao instance
    @Autowired // a way to get things it needs wihout having to create them itself.
    // here we are injecting the designatiouserDao by using autowired so all the
    // content
    // inside the User userDao will connect with this file
    private UserDao userDao;

    @Autowired
    private BCryptPasswordEncoder bCryptPasswordEncoder;

    @Autowired
    private PrivilegeController privilegeController;

    /*
     * use thsi code instead of autiwired
     * public UserController(UserDao userDao){
     * this.userDao = userDao;
     * }
     */

    /*
     * -----------------------------------------------define findall get mapping for
     * all employee data --> URL(/employee/findall)
     * -----------------------------------
     */

    @RequestMapping(value = "/findall", produces = "application/json")
    public List<User> getAllData() {
        // get loged user authentication object using security context in webconfig file
        // type object log wecha userge authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        HashMap<String, Boolean> logUserPrivi = privilegeController.getPrivilegeByUserModule(auth.getName(), "User");
        if (!logUserPrivi.get("select")) {
            return new ArrayList<>();
        }

        return userDao.findAll(Sort.by(Direction.DESC, "id"));
    }

    /*------------------------------------------------ define user UI service -> URL [/user] -----------------------------------------------------------------------*/
    @GetMapping
    public ModelAndView userUI() {

        // get loged user authentication object using security context in webconfig file
        // type object log wecha userge authentication object

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        User loggedUser = userDao.getUserByUserName(auth.getName());

        ModelAndView userView = new ModelAndView();
        userView.addObject("title", "User Management - Tasty Delights");
        userView.addObject("loggedusername", auth.getName()); // log wecha kenage username eka ganna puluwan.....
        userView.addObject("loggeduserrole", loggedUser.getRoles().iterator().next().getName()); // log wecha kenage 1st
                                                                                                 // role eka ganna
                                                                                                 // puluwan.....
                                                                                                 // multiple roles
                                                                                                 // thiboth 1st role
                                                                                                 // ekai ganne
        userView.addObject("loggeduserphoto", loggedUser.getPhotopath()); // log wecha kenage usern 4to eka ganna
                                                                          // puluwan.....

        userView.setViewName("user.html");
        return userView;
    }

    /*
     * ======================================= Post Mapping
     * ==========================================
     */

    @PostMapping
    public String save(@RequestBody User user) {

        // get loged user authentication object using security context in webconfig file
        // type object log wecha userge authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        HashMap<String, Boolean> logUserPrivi = privilegeController.getPrivilegeByUserModule(auth.getName(), "User");

        if (!logUserPrivi.get("insert")) {
            return "Add is Not Completed  : You haven't Privilege";

        }

        /*--------------------------------- Duplicate Check ------------------------------------ */

        // username
        User extUserName = userDao.getUserByUserName(user.getUsername());
        if (extUserName != null) {
            return "User Save not Completed : User Name is Already Exists....!";
        }

        // email

        User extUserEmail = userDao.getByEmail(user.getEmail());
        if (extUserEmail != null) {
            // return "Save not completed : given email already exist..!";
            return "Save not completed : given username already exist..!";

        }

        // emp_id

        User extUserEmployee = userDao.getUserByEmployee(user.getEmployee_id().getId());
        if (extUserEmployee != null) {
            return "User Save not Completed : Employee is Already Exists....!";
        }

        try {

            user.setAddeddatetime(LocalDateTime.now());
            user.setAddeduser(1);

            // user object eke thiyena frontend password eke bCryptPasswordEncoder object
            // lawwa encode karaal user ekata set karanawa
            user.setPassword(bCryptPasswordEncoder.encode(user.getPassword()));

            // Save the user record to the database.
            userDao.save(user);
            return "OK";

        } catch (Exception e) {
            return "Save not Completed : " + e.getMessage();
        }
    }

    // This method handles HTTP PUT requests to update a user record.
    @PutMapping
    public String updateUser(@RequestBody User user) {

        // Authentication and Authorization

        // get loged user authentication object using security context in webconfig file
        // type object log wecha userge authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        HashMap<String, Boolean> logUserPrivi = privilegeController.getPrivilegeByUserModule(auth.getName(), "User");

        if (!logUserPrivi.get("update")) {
            return "Update is Not Completed  : You haven't Privilege";

        }

        // Check for duplicate user records by username, email, and employee ID.
        User extUserByUserName = userDao.getUserByUserName(user.getUsername());
        if (extUserByUserName != null && extUserByUserName.getId() != user.getId())

        {
            // return "Save not completed : given nic already exist..!";
            return "Save not completed : given username already exist..!";

        }

        User extUserEmail = userDao.getByEmail(user.getEmail());
        if (extUserEmail != null && extUserEmail.getId() != user.getId()) {
            // return "Save not completed : given email already exist..!";
            return "Save not completed : given username already exist..!";

        }

        User extUserByEmployee = userDao.getUserByEmployee(user.getEmployee_id().getId());
        if (extUserByEmployee != null && extUserByEmployee.getId() != user.getId()) {
            return "Save not completed : employee already exist..!";
        }

        User extUser = userDao.getReferenceById(user.getId());
        if (extUser == null) {
            return "User Update not Completed : User not exist..! ";
        }

        try {

             // set auto value
             user.setUpdatedatetime(LocalDateTime.now());


            // If the password is not provided, use the existing password
            if (user.getPassword() == null) {
                user.setPassword(extUser.getPassword());
            } else {
                // Check if the provided password matches the existing password
                Boolean passwordExt = bCryptPasswordEncoder.matches(user.getPassword(), extUser.getPassword());
                if (passwordExt) {
                    return "User update is not Completed, User password is already exit";
                }
                // Encrypt the new password
                // user object eke thiyena frontend password eke bCryptPasswordEncoder object
            // lawwa encode karaal user ekata set karanawa
                user.setPassword(bCryptPasswordEncoder.encode(user.getPassword()));
            }
           
            // Save the updated user record to the database.
            userDao.save(user);

            // dependencies

            return "OK";

        } catch (Exception e) {
            return "Update not completed : " + e.getMessage();
        }
    }

    @DeleteMapping
    public String delete(@RequestBody User user) {

        // get loged user authentication object using security context in webconfig file
        // type object log wecha userge authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        HashMap<String, Boolean> logUserPrivi = privilegeController.getPrivilegeByUserModule(auth.getName(), "User");

        if (!logUserPrivi.get("delete")) {
            return "Delete is Not Completed  : You haven't Privilege";

        }

        // authentication and authorization

        // chcking whether the employee is existence or not
        User extUser = userDao.getReferenceById(user.getId()); // frontend eke thiyena object eke id eka pass karanne
                                                               // getReferenceById ekata

        if (extUser == null) {
            return "Delete Not Complete : User Not Exists....";
        }

        try {
            // operator

            // hard delete
            // userDao.delete(employee);
            /*
             * fetches a reference to an employee object based on its ID, and then deletes
             * that employee
             * from the database using the DAO
             * 
             * id eka dunnama full object eka ganna puluwan
             * 
             * userDao.delete(userDao.getReferenceById(employee.getId()));
             */

            // soft delete
            extUser.setStatus(false);// change status into delete

            extUser.setDeletedatetime(LocalDateTime.now());
            extUser.setDeleteuser(1);

            userDao.save(extUser);// save extemp object(update)

            return "OK";

        } catch (Exception e) {
            return "Delete is Not Completed : " + e.getMessage();
        }
    }
}
