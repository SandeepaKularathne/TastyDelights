package lk.tastydelights.privilege;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import lk.tastydelights.user.UserDao;

import java.util.List;

@RestController
public class ModuleController {

    // create Employeedao instance
    @Autowired // a way to get things it needs wihout having to create them itself.
    // here we are injecting the employeedao by using autowired so all the content
    // inside theemployee dao will connect with this file
    private ModuleDao dao;

    @Autowired
    private UserDao userDao;

    @Autowired
    private PrivilegeController privilegeController;

    @GetMapping(value = "/module/list", produces = "application/json")
    public List<Module> getAllData() {
        return dao.findAll();
    }

    // get mapping for get module data by given role id
    @GetMapping(value = "/module/listbyrole", params = { "roleid" })
    public List<Module> getByRole(@RequestParam("roleid") Integer roleid) {
        return dao.getModuleByRole(roleid);
    }

    /*
     * the above query used to filter to find the access of module to maintain the
     * privilege by filtering the role
     * 
     * 
     * param usekarana ways 2k thiyenawa
     * 
     * 1. path
     * 
     * meke url eka liyadhi /module/list/roleid kiyalai liyanne meke roleid eka
     * param name eka. roleid ekata 1 2 3 kiyala adhala role ekata galapena id eka
     * dhala thiyenawa
     * 
     * @Pathparam / pathvariable eka thamai use karane
     * 
     * 2. query
     * 
     * meke url eka liyadhi,
     * module/list ? roleid = 1 & 2
     * 
     * meke param ekai url path ekai ? eken seperate karala roleid eka param name
     * widhihatai 1 2 tikka values widhihatai liyanne
     * 
     * @Requestparam use karanne
     * 
     * 
     * points to consider while we filter
     * 1. mona element eka use karanne
     * 2. mona element eka filter wenne
     * 
     */
    @RequestMapping(value = "/module/findallbyloggeduser")
    public String[] getMethodName() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return dao.getModuleByLoggedUser(auth.getName());
    }
}