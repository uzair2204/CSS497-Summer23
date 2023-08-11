package com.mehvi.lady.webapplication.repositories;

import com.mehvi.lady.webapplication.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    boolean existsByEmailIgnoreCase(String email);
    Optional<User> findUserByEmailIgnoreCaseAndPassword(String email,String password);

    Optional<User> findUserByEmailIgnoreCase(String email);

}
