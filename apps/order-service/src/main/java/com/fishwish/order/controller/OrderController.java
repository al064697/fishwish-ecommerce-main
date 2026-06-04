package com.fishwish.order.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fishwish.order.model.Order;
import com.fishwish.order.service.OrderService;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(
    origins = {"http://localhost:3000", "https://fishwish-ecommerce-web-five.vercel.app"},
    methods = {org.springframework.web.bind.annotation.RequestMethod.GET, 
               org.springframework.web.bind.annotation.RequestMethod.POST, 
               org.springframework.web.bind.annotation.RequestMethod.OPTIONS},
    allowedHeaders = {"*"},
    allowCredentials = "true",
    maxAge = 3600
)
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping
    public ResponseEntity<?> createOrder(@RequestBody Order order) {
        try {
            Order savedOrder = orderService.createOrder(order);
            return ResponseEntity.ok(savedOrder);
        } catch (IllegalArgumentException e) {
            // Maneja errores como "Stock insuficiente" o "Producto no existe"
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            e.printStackTrace(); // Log the exact error
            return ResponseEntity.internalServerError().body("Error interno procesando la orden: " + e.getMessage());
        }
    }

    @GetMapping
    public List<Order> getAllOrders() {
        return orderService.getAllOrders();
    }
}