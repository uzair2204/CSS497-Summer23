package com.mehvi.lady.webapplication.validators;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.*;

@Documented
@Constraint(validatedBy = RegexValidator.class)
@Target({ElementType.FIELD, ElementType.ANNOTATION_TYPE})
@Retention(RetentionPolicy.RUNTIME)
public @interface ValidRegex {
    String message() default "Invalid Format";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
    String pattern();
}
