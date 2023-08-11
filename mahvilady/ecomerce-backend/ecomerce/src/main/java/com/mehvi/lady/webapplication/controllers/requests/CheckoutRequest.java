package com.mehvi.lady.webapplication.controllers.requests;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Setter
public class CheckoutRequest {
    private String billingAddress1;
    private String billingAddress2;
    private String billingCity;
    private String billingCompany;
    private String billingContact;
    private String billingCountry;
    private String billingName;
    private String billingZip;
    private boolean sameAsShipping;
    private String shippingAddress1;
    private String shippingAddress2;
    private String shippingCity;
    private String shippingCompany;
    private String shippingContact;
    private String shippingCountry;
    private String shippingName;
    private String shippingZip;

    // Getters and setters
}