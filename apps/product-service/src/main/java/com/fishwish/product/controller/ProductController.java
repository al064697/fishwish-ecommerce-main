package com.fishwish.product.controller;

import com.fishwish.product.model.Product;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    // Productos reales de FishWish (hacemos la lista mutable con ArrayList)
    private final List<Product> products = new ArrayList<>(List.of(
        new Product(1L, "Snack FishWish 100g", "100g", 80.0, 50, "Snacks naturales de pescado deshidratado - Ideal para probar"),
        new Product(2L, "Snack FishWish 250g", "250g", 110.0, 30, "Presentación estándar - Omega 3 y proteínas"),
        new Product(3L, "Snack FishWish 500g", "500g", 150.0, 20, "Presentación familiar - Mejor precio por volumen")
    ));

    @GetMapping
    public List<Product> getAllProducts() {
        return products;
    }

    @GetMapping("/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable("id") Long id) {
        return products.stream()
                .filter(p -> p.getId().equals(id))
                .findFirst()
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}/stock")
    public ResponseEntity<Void> updateStock(@PathVariable("id") Long id, @RequestParam("quantity") Integer quantity) {
        Optional<Product> productOpt = products.stream()
                .filter(p -> p.getId().equals(id))
                .findFirst();

        if (productOpt.isPresent()) {
            Product product = productOpt.get();
            if (product.getStock() >= quantity) {
                product.setStock(product.getStock() - quantity);
                return ResponseEntity.ok().build();
            } else {
                return ResponseEntity.badRequest().build();
            }
        }
        return ResponseEntity.notFound().build();
    }
}