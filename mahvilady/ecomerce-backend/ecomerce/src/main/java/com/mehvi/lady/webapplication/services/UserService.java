package com.mehvi.lady.webapplication.services;

import com.mehvi.lady.webapplication.controllers.requests.UserRequest;
import com.mehvi.lady.webapplication.entities.User;
import com.mehvi.lady.webapplication.entities.enums.UserRole;
import com.mehvi.lady.webapplication.repositories.UserRepository;
import org.mindrot.jbcrypt.BCrypt;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepository;

    @Autowired
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // Save a single user
    public User saveUser(User user) {
        return userRepository.save(user);
    }

    // Save a collection of users
    public List<User> saveAllUsers(List<User> users) {
        return userRepository.saveAll(users);
    }

    // Get a user by its ID
    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }

    // Check if n user with the given ID exists in the database
    public boolean userExists(Long id) {
        return userRepository.existsById(id);
    }

    // Get all users
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // Get users by a list of IDs
    public List<User> getUsersByIds(List<Long> ids) {
        return userRepository.findAllById(ids);
    }

    // Get the total number of users in the database
    public long getUserCount() {
        return userRepository.count();
    }

    // Delete n user by its ID
    public void deleteUserById(Long id) {
        userRepository.deleteById(id);
    }

    // Delete a single user
    public void deleteUser(User user) {
        userRepository.delete(user);
    }


    public boolean userExistByEmail(String email) {
        return userRepository.existsByEmailIgnoreCase(email);
    }

    public Optional<User> authenticate(String email, String password) {
        Optional<User> user = userRepository.findUserByEmailIgnoreCase(email);
        if (user.isPresent() && !BCrypt.checkpw(password, user.get().getPassword())) {
            user = Optional.empty();
        }
        return user;
    }


    public User signup(UserRequest userRequest) {
        // Create a new user
        User newUser = new User();
        newUser.setFirstName(userRequest.getFirstName());
        newUser.setLastName(userRequest.getLastName());
        newUser.setEmail(userRequest.getEmail());
        newUser.setPhone(userRequest.getPhone());
        newUser.setDateOfBirth(userRequest.getDateOfBirth());
        // Encrypt the password using BCrypt
        String encryptedPassword = BCrypt.hashpw(userRequest.getPassword(), BCrypt.gensalt());
        newUser.setPassword(encryptedPassword);
        // Set default role (e.g., USER)
        newUser.setRole(UserRole.USER);

        // Save the user entity and return
        return userRepository.save(newUser);
    }

    public User update(UserRequest userRequest, User user) {
        // Create a new user

        user.setFirstName(userRequest.getFirstName());
        user.setLastName(userRequest.getLastName());
        user.setEmail(userRequest.getEmail());
        user.setPhone(userRequest.getPhone());
        user.setDateOfBirth(userRequest.getDateOfBirth());
        // Encrypt the password using BCrypt
        //String encryptedPassword = BCrypt.hashpw(userRequest.getPassword(), BCrypt.gensalt());
        //user.setPassword(encryptedPassword);

        // Set default role (e.g., USER)
        //user.setRole(UserRole.USER);

        // Save the user entity and return
        return userRepository.save(user);
    }
}
