package com.mehvi.lady.webapplication.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.mehvi.lady.webapplication.entities.enums.UserRole;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Setter
@Entity
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String firstName;
    private String lastName;
    private String email;
    private String phone;
    private String avatar;
    private LocalDate dateOfBirth;
    @JsonIgnore
    private String password;
    private boolean verified;
    @Enumerated(EnumType.STRING)
    private UserRole role;
    @OneToOne(mappedBy = "user")
    private Shop shop;


    // getters and setters
}



