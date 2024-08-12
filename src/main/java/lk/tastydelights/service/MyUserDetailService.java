package lk.tastydelights.service;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;
import lk.tastydelights.user.Role;
import lk.tastydelights.user.User;
import lk.tastydelights.user.UserDao;

@Service
public class MyUserDetailService implements UserDetailsService{

    @Autowired
    private UserDao userDao;

    @Override
    @Transactional // user eke thiyena role list eka access karala user eka hadhaganan nissa 
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException{

        System.out.println(username);
        
        User extUser = userDao.getUserByUserName(username);

        System.out.println(extUser.getUsername());

        Set<GrantedAuthority> userRoles = new HashSet<GrantedAuthority>();

           
       //eh array list ekata push kara roles tikke thiyena names tikka illagatha
       for (Role role : extUser.getRoles()) {
        //meh aray ekata push karanawa granted object eka ekata eh roles tikka push kara
        userRoles.add(new SimpleGrantedAuthority(role.getName()));
        
    }

        //granted authority array list eka 
        ArrayList<GrantedAuthority> grantedAuthorities = new ArrayList<GrantedAuthority>(userRoles);
     
        System.out.println(grantedAuthorities);

        //user object eka creta ekara username password status tikka ilagena granted authority list eka dunna
        UserDetails user = new org.springframework.security.core.userdetails.User(extUser.getUsername(), extUser.getPassword(),extUser.getStatus(),true,true,true,grantedAuthorities);

       return user;
    }

 
}
