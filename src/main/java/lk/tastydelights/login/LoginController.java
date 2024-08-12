package lk.tastydelights.login;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import lk.tastydelights.employee.Employee;
import lk.tastydelights.employee.EmployeeDao;
import lk.tastydelights.user.RoleDao;
import lk.tastydelights.user.User;
import lk.tastydelights.user.Role;
import lk.tastydelights.user.UserDao;

@RestController
public class LoginController {

    @Autowired
    private EmployeeDao daoEmp;

    @Autowired
    private UserDao userDao;

    @Autowired
    private BCryptPasswordEncoder bCryptPasswordEncoder;

    @Autowired
    private RoleDao daoRole;

    @GetMapping(value = "/login")
    public ModelAndView loginUI() {
        ModelAndView loginView = new ModelAndView();
        loginView.setViewName("login.html");

        return loginView;
    }

    @GetMapping(value = "/error")
    public ModelAndView errorUI() {
        ModelAndView errorView = new ModelAndView();
        errorView.setViewName("error.html");

        return errorView;
    }

    @GetMapping(value = "/index")
    public ModelAndView indexUI() {

        // get loged user authentication object using security context in webconfig file 
        //type         object   log wecha userge authentication object 
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        ModelAndView indexView = new ModelAndView();

        indexView.addObject("username", auth.getName()); // log wecha kenage username eka ganna puluwan.....

        indexView.setViewName("index.html");

        return indexView;
    }

    @GetMapping(value = "/createadmin")
    public String generateAdmin() {

        User extAdminUser = userDao.getUserByUserName("Admin");
        if (extAdminUser == null) {

            User adminUser = new User();

            adminUser.setUsername("Admin");
            adminUser.setPassword(bCryptPasswordEncoder.encode("12345"));
            adminUser.setEmail("admin@gmail.com");
            adminUser.setStatus(true);
            adminUser.setAddeddatetime(LocalDateTime.now());

            // Set the addeduser field to an appropriate non-null value
            adminUser.setAddeduser(1); // Assuming 1 is the ID of the user creating this admin

            Employee adminEmployee = daoEmp.getReferenceById(1);
            adminUser.setEmployee_id(adminEmployee);

            Set<Role> userRole = new HashSet<Role>();
            userRole.add(daoRole.getReferenceById(1));
            adminUser.setRoles(userRole);

            userDao.save(adminUser);
        }

        return "<script> window.location.replace('/login'); </script>";
    }

}
