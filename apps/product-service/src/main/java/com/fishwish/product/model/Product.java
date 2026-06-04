package com.fishwish.product.model;

public class Product {
    private Long id;
    private String name;
    private String presentation;
    private Double price;
    private Integer stock;
    private String description;

    // Constructor vacío
    public Product() {}

    // Constructor con todos los campos
    public Product(Long id, String name, String presentation, Double price, Integer stock, String description) {
        this.id = id;
        this.name = name;
        this.presentation = presentation;
        this.price = price;
        this.stock = stock;
        this.description = description;
    }

    // Getters y Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getPresentation() { return presentation; }
    public void setPresentation(String presentation) { this.presentation = presentation; }

    public Double getPrice() { return price; }
    public void setPrice(Double price) { this.price = price; }

    public Integer getStock() { return stock; }
    public void setStock(Integer stock) { this.stock = stock; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
}