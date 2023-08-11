package com.mehvi.lady.webapplication.controllers.requests;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Setter
public class CartRequest {
    private long product;
    private int qty;
}
