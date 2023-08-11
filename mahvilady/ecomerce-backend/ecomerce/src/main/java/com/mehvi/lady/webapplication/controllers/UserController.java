package com.mehvi.lady.webapplication.controllers;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.mehvi.lady.webapplication.controllers.requests.UserRequest;
import com.mehvi.lady.webapplication.entities.User;
import com.mehvi.lady.webapplication.services.FileStorageService;
import com.mehvi.lady.webapplication.services.ObjectMapperService;
import com.mehvi.lady.webapplication.services.UserService;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.mindrot.jbcrypt.BCrypt;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Objects;
import java.util.Optional;

@RestController
@RequestMapping("/users")
@CrossOrigin
public class UserController {

    Logger logger = LogManager.getLogger(this.getClass());
    private final UserService userService;

    private final ObjectMapperService mapper;
    private final FileStorageService fileStorageService;

    @Value("${file.user.directory}")
    private String storageDirectory;

    @Autowired
    public UserController(UserService userService, ObjectMapperService mapper, FileStorageService fileStorageService) {
        this.userService = userService;
        this.mapper = mapper;
        this.fileStorageService = fileStorageService;
    }

    @PostMapping("/register")
    public ResponseEntity<User> register(@RequestBody UserRequest user) {
        if (userService.userExistByEmail(user.getEmail())) {
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        }
        User savedUser = userService.signup(user);
        return new ResponseEntity<>(savedUser, HttpStatus.OK);
    }

    @PostMapping("/update-password/{id}")
    public ResponseEntity<User> register(@RequestBody UserRequest user, @PathVariable long id) {
        User oldUser = userService.getUserById(id).orElse(null);
        logger.info(" user old {}, request {} password{}", oldUser,user,BCrypt.hashpw(user.getOldPassword(),BCrypt.gensalt()));
        if (Objects.isNull(oldUser) || !BCrypt.checkpw(user.getOldPassword(), oldUser.getPassword())) {
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        }
        oldUser.setPassword(BCrypt.hashpw(user.getPassword(),BCrypt.gensalt()));
        User savedUser = userService.saveUser(oldUser);
        return new ResponseEntity<>(savedUser, HttpStatus.OK);
    }


    @PutMapping("/{id}")
    public ResponseEntity<User> update(@RequestBody UserRequest user, @PathVariable long id) {
        User oldUser = userService.getUserById(id).orElse(null);
        if (Objects.isNull(oldUser)) {
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        }
        User savedUser = userService.update(user, oldUser);
        return new ResponseEntity<>(savedUser, HttpStatus.CREATED);
    }

    @PutMapping("/{id}/image")
    public ResponseEntity<User> updateImage(@PathVariable long id, @RequestPart("image") MultipartFile image,
                                            @RequestParam("user") String userStr) throws JsonProcessingException {
        User oldUser;
        oldUser = userService.getUserById(id).orElse(null);
        if (Objects.isNull(oldUser)) {
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        }
        UserRequest request = mapper.fromJson(userStr, UserRequest.class);
        oldUser.setAvatar(fileStorageService.storeFile(image, String.valueOf(oldUser.getId()), oldUser.getAvatar(), storageDirectory));
        User savedUser = userService.update(request, oldUser);
        return new ResponseEntity<>(savedUser, HttpStatus.CREATED);
    }

    @PostMapping("/authenticate")
    public ResponseEntity<User> authenticate(@RequestBody UserRequest user) {
        User savedUser = userService.authenticate(user.getEmail(), user.getPassword()).orElse(null);
        if (Objects.isNull(savedUser)) {
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        }

        return new ResponseEntity<>(savedUser, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        Optional<User> user = userService.getUserById(id);
        return user.map(value -> new ResponseEntity<>(value, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @GetMapping("/email/exist/{email}")
    public ResponseEntity<Boolean> register(@PathVariable String email) {
        return new ResponseEntity<>(userService.userExistByEmail(email), HttpStatus.OK);
    }

    @GetMapping("/count")
    public ResponseEntity<Long> getUserCount() {
        long count = userService.getUserCount();
        return new ResponseEntity<>(count, HttpStatus.OK);
    }


}
