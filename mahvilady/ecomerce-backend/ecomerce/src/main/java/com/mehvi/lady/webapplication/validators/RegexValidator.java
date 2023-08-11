package com.mehvi.lady.webapplication.validators;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class RegexValidator implements ConstraintValidator<ValidRegex, String> {

    private String pattern;

    @Override
    public void initialize(ValidRegex constraintAnnotation) {
        this.pattern = constraintAnnotation.pattern();
    }

    @Override
    public boolean isValid(String value, ConstraintValidatorContext context) {
        Pattern pattern = Pattern.compile(this.pattern);
        Matcher matcher = pattern.matcher(value);
        return matcher.matches();
    }
}
