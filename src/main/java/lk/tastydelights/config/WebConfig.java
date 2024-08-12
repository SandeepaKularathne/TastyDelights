package lk.tastydelights.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration //meka configuration file ekak nisa
@EnableWebSecurity //Mata ona widihata securita wada krganna meka add kra
public class WebConfig {

    private String[] resourceURL = {"/bootstrap-5.2.3/**", "fontawesome-free-6.4.2/**" , "/style/**", "/Script/**", "/controllerjs/**", "/images/**"};
    
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception{

        //meh http eka user karala apita oneh widhihata autorization tikka liyanaganna puluwan 
        http.authorizeHttpRequests(auth -> {
            auth //security object eka auth kiyana widhihata pass wenawaa 
        
            // modules tikka katadha karanna puluwan kiyala thiyena tikka define karanne meken..............

            .requestMatchers(resourceURL).permitAll() //resources tikka hamotama permit karanwa

            .requestMatchers("/login").permitAll() //meken ;ogin eka hamotama denawa...

            .requestMatchers("/error").permitAll()

            .requestMatchers("/createadmin").permitAll()

            .requestMatchers("/index").hasAnyAuthority("Admin", "Manager","Product-Manager", "Cashier")

            // /employee/** eken kiyanne employee eke thiyena serama service tikka acess karanna puluwan 
            .requestMatchers("/employee/**").hasAnyAuthority("Admin", "Manager") //employee eka access karanan puluwan aya ....

            .requestMatchers("/user/**").hasAnyAuthority("Admin", "Manager")

            .requestMatchers("/privilege/**").hasAnyAuthority("Admin", "Manager","Cashier","Product-Manager")

            .requestMatchers("/customer/**").hasAnyAuthority("Admin", "Manager","As-Manager","Cashier")

            .requestMatchers("/product/**").hasAnyAuthority("Admin", "Manager","As-Manager","Cashier","Product-Manager ")
            .requestMatchers("/customerorder/**").hasAnyAuthority("Admin", "Manager","As-Manager","Cashier","Product-Manager ")
            
            .requestMatchers("/customerpayment/**").hasAnyAuthority("Admin", "Manager","As-Manager","Cashier")
            
            .requestMatchers("/ingredient/**").hasAnyAuthority("Admin", "Manager","Product-Manager")

            .requestMatchers("/supplier/**").hasAnyAuthority("Admin", "Manager","As-Manager")

            .requestMatchers("/purchaseorder/**").hasAnyAuthority("Admin", "Manager","As-Manager")

            .requestMatchers("/irn/**").hasAnyAuthority("Admin", "Manager","As-Manager")

            .requestMatchers("/supplierpayment/**").hasAnyAuthority("Admin", "Manager","As-Manager")

            .requestMatchers("/production/**").hasAnyAuthority("Admin", "Manager","As-Manager","Product-Manger")



            .anyRequest().authenticated();

            //login form detail.....
        }).formLogin((login) ->{ 
            login.loginPage("/login") //login form url eka

            .usernameParameter("username") //username parameter eka login.html eka user attribute ekata dena name eka = user entity eke thiyena value eka = 

            .passwordParameter("password") //password parameter eka frontend eke thiyena passwrod name =  user entity eke thiyena attribute 

            //login eka success nm
            .defaultSuccessUrl("/index", true) // true unoth hamathissema dashboard ekata yanne. (False nam kalin access kra kra hitapu eka)

            //login eka failure nm....
            .failureUrl("/login?error = usernamepassworderror"); //param 

            //logout
        }).logout((logout)->{ //logout form url eka
            logout
            .logoutUrl("/logout") //logout url eka
            .logoutSuccessUrl("/login"); 

        })

        //default csrf thyenne enable wela. Api meka disable krganna one broeser eken thiyena post put services tikka weda karanna  cross side references.. 
        .csrf(csrf -> csrf.disable())
        
        //exception handling
        .exceptionHandling(
            exp -> exp.accessDeniedPage("/error")
        );

        return http.build(); // filter security chain eka return wei build unoth
    }

    @Bean
    //bcrypt instnce eka constructor matha hadhaganthe....
    //Password encode instance ekak hadagnnwa encrypt krnna
    public BCryptPasswordEncoder bCryptPasswordEncoder(){
        return new BCryptPasswordEncoder();
    }
}
