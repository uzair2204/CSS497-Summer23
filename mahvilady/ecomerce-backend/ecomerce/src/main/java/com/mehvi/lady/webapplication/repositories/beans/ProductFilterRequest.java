package com.mehvi.lady.webapplication.repositories.beans;

import lombok.Data;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Data
public class ProductFilterRequest {
    private ProductSearchCriteria criteria;

    private int pageNumber;
    private int pageSize;
    private String sort;

    @Value("${spring.data.web.pageable.default-page-size}")
    private int defaultPageSize;

    public Pageable getPageAble() {
        List<Sort.Order> orders = Arrays.stream(sort.split("&"))
                .map(order -> {
                    String[] parts = order.split(",");
                    if (parts.length == 2) {
                        return new Sort.Order(Sort.Direction.fromString(parts[1]), parts[0]);
                    }
                    return new Sort.Order(Sort.Direction.ASC, parts[0]);
                })
                .collect(Collectors.toList());

        Sort parsedSort = Sort.by(orders);
        return PageRequest.of(
                getPageNumber(),
                getPageSize() <= 0 ? defaultPageSize : pageSize,
                parsedSort
        );
    }


}
