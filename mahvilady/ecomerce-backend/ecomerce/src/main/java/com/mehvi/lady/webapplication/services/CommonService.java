package com.mehvi.lady.webapplication.services;

import com.mehvi.lady.webapplication.controllers.requests.CartRequest;
import com.mehvi.lady.webapplication.controllers.requests.CheckoutRequest;
import com.mehvi.lady.webapplication.entities.*;
import com.mehvi.lady.webapplication.entities.enums.OrderStatus;
import com.mehvi.lady.webapplication.utils.CommonUtils;
import jakarta.transaction.Transactional;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Service
public class CommonService {
    Logger logger = LogManager.getLogger(this.getClass());
    private final ProductService productService;
    private final UserService userService;
    private final CartService cartService;
    private final OrderService orderService;
    private final AddressService addressService;
    private final OrderItemService orderItemService;

    private final ReviewService reviewService;

    @Value("${order.shipping.free.threshold}")
    private double shippingFreeThreshold;

    @Value("${order.shipping.fee}")
    private double shippingFee;

    @Value("${order.delivery.estimate.days}")
    private int deliveryDays;

    public CommonService(ProductService productService, UserService userService, CartService cartService, OrderService orderService, AddressService addressService, OrderItemService orderItemService, ReviewService reviewService) {
        this.productService = productService;
        this.userService = userService;
        this.cartService = cartService;
        this.orderService = orderService;
        this.addressService = addressService;
        this.orderItemService = orderItemService;
        this.reviewService = reviewService;
    }

    public Cart getCart(CartRequest request, Long userId) {
        Cart cart = new Cart();
        cart.setQty(request.getQty());
        cart.setUser(userService.getUserById(userId).orElseGet(() -> null));
        cart.setProduct(productService.getProductById(request.getProduct()).orElseGet(() -> null));
        return cart;
    }

    public boolean wishProduct(long userId, Long productId) {
        User user = userService.getUserById(userId).orElseGet(() -> null);
        Product product= productService.getProductById(productId).orElseGet(() -> null);
       return Objects.nonNull(user) && Objects.nonNull(product);
    }

    public Address mapToAddress(CheckoutRequest request, boolean isBilling) {
        Address address = new Address();

        if (isBilling) {
            address.setName(request.getBillingName());
            address.setCompany(request.getBillingCompany());
            address.setPhone(request.getBillingContact());
            address.setAddress(request.getBillingAddress1() + " " + request.getBillingAddress2());
            address.setCountry(request.getBillingCountry());
            address.setCity(request.getBillingCity());
            address.setZipCode(request.getBillingZip());
        } else {
            address.setName(request.getShippingName());
            address.setCompany(request.getShippingCompany());
            address.setPhone(request.getShippingContact());
            address.setAddress(request.getShippingAddress1() + " " + request.getShippingAddress2());
            address.setCountry(request.getShippingCountry());
            address.setCity(request.getShippingCity());
            address.setZipCode(request.getShippingZip());
        }

        return address;
    }
    @Transactional
    public Order safeOrder(CheckoutRequest request, long userId) {
        List<Cart> carts = cartService.getCartsByUserId(userId);
        if (CommonUtils.isNullOrEmptyCollection(carts)) {
            return null;
        }
        Order order = new Order();
        order.setStatus(OrderStatus.PLACED);
        logger.info("{} {}",request,userId);
        if (request.isSameAsShipping()) {
            order.setBillingAddress(mapToAddress(request, false));
            order.setShippingAddress(order.getBillingAddress());
        } else {
            order.setBillingAddress(mapToAddress(request, true));
            order.setShippingAddress(mapToAddress(request, false));
        }
        logger.info("{} {}",order.getBillingAddress(),order.getShippingAddress());
        order.setItems(new ArrayList<>());
        logger.info("go to handle carts");
        for (Cart cart : carts) {
            logger.info("cart {}", cart);
            OrderItem item = getOrderItem(cart);
            order.addOrderItem(item);
            productService.saveProduct(cart.getProduct());
            cartService.deleteCart(cart);
            orderItemService.saveOrderItem(item);
        }
        order.setUser(carts.get(0).getUser());
       logger.info("go to save address");
        order.getBillingAddress().setUser(order.getUser());
        order.getShippingAddress().setUser(order.getUser());
        order.setEstimateDeliveryAt(LocalDate.now().plusDays(deliveryDays));
        addressService.saveAddress(order.getShippingAddress());
        if(!request.isSameAsShipping()){
            addressService.saveAddress(order.getBillingAddress());
        }

        if(order.getTotalPrice()<this.shippingFreeThreshold){
            order.setShippingCharges(shippingFee);
            order.setTotalPrice(order.getTotalPrice()+shippingFee);
        }
        orderService.saveOrder(order);
        logger.info("order saved");
        
        return order;
    }

    private OrderItem getOrderItem(Cart cart) {
        OrderItem item = new OrderItem();
        Product product = cart.getProduct();
        item.setDiscount(product.isOnDiscount() ? product.getDiscount() : 0);
        item.setProductPrice(product.getPrice());
        item.setProductName(product.getTitle());
        item.setReviewed(Boolean.FALSE);
        item.setDiscountedPrice(product.getPrice() - (product.isOnDiscount() ? calculateDiscount(product.getPrice(), product.getDiscount()) : 0));
        if (product.getStock() >= cart.getQty()) {
            item.setProductQuantity(cart.getQty());
        } else {
            item.setProductQuantity(product.getStock());
        }
        product.setStock(product.getStock() - item.getProductQuantity());
        item.setProduct(product);
        return item;
    }

    private Double calculateDiscount(Double price, Double discount) {
        return (price * discount) / 100;
    }
    @Transactional
    public Review reviewProduct(Review review, long productId, long userId){
        Product p = productService.getProductById(productId).orElse(null);
        User u = userService.getUserById(userId).orElse(null);
        List<OrderItem> item = orderItemService.getUnreviewedForUserAndProduct(userId,productId,Boolean.FALSE);
        if(Objects.nonNull(p) && Objects.nonNull(u) && !CommonUtils.isNullOrEmptyCollection(item)){
            review.setProduct(p);
            review.setCustomer(u);
            p.updateRating(review.getRating());
            item.get(0).setReviewed(true);
            orderItemService.saveOrderItem(item.get(0));
            productService.saveProduct(p);
            review.setPublished(true);
            review=reviewService.saveReview(review);
        }
        return review;
    }



}
