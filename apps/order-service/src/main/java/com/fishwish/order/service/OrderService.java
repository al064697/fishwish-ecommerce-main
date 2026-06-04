package com.fishwish.order.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fishwish.order.client.ProductServiceClient;
import com.fishwish.order.dto.ProductDTO;
import com.fishwish.order.model.Order;
import com.fishwish.order.model.OrderItem;
import com.fishwish.order.repository.OrderRepository;

import feign.FeignException;

@Service
public class OrderService {

  private final OrderRepository orderRepository;
  private final ProductServiceClient productServiceClient;

  public OrderService(
    OrderRepository orderRepository,
    ProductServiceClient productServiceClient
  ) {
    this.orderRepository = orderRepository;
    this.productServiceClient = productServiceClient;
  }

  /**
   * Procesa la creación de un nuevo pedido, coordinando con el product-service.
   * La lógica se divide en dos fases principales para garantizar la consistencia:
   * 1. Validación: Verifica la existencia y stock de todos los productos.
   * 2. Actualización y Creación: Si todo es válido, descuenta el stock y guarda el pedido.
   *
   * @param order El objeto Pedido recibido desde el controlador.
   * @return El Pedido guardado en la base de datos.
   * @throws IllegalArgumentException Si un producto no existe o no hay stock suficiente.
   */
  @Transactional
  public Order createOrder(Order order) {
    // --- FASE 1: Validación de cada ítem del pedido ---
    // Se recorren todos los productos para asegurar que la transacción sea viable
    // antes de realizar cualquier modificación de estado en otros servicios.
    for (OrderItem item : order.getItems()) {
      validateOrderItem(item);
    }

    // --- FASE 2: Cálculo de total y preparación de ítems ---
    // Esta fase solo se ejecuta si la validación fue exitosa para todos los productos.
    double totalAmount = calculateTotalAndPrepareItems(order);
    order.setTotalAmount(totalAmount);

    // Se establece la fecha y estado antes de persistir
    order.setOrderDate(LocalDateTime.now());
    order.setStatus("PENDIENTE");

    // Guardar el pedido en la base de datos.
    Order savedOrder = orderRepository.save(order);

    // --- FASE 3: Confirmación y actualización de stock en product-service ---
    // Se descuenta el stock DESPUÉS de que la validación ha sido exitosa para todos los ítems.
    // Esto reduce la probabilidad de inconsistencias.
    updateStockForOrderItems(order.getItems());

    return savedOrder;
  }

  /**
   * Valida un único ítem del pedido contra el 'product-service'.
   */
  private void validateOrderItem(OrderItem item) {
    try {
      ResponseEntity<ProductDTO> response = productServiceClient.getProductById(
        item.getProductId()
      );

      ProductDTO product = Objects.requireNonNull(
        response.getBody(),
        "La respuesta del producto no puede ser nula."
      );

      if (product.getStock() < item.getQuantity()) {
        throw new IllegalArgumentException(
          "Stock insuficiente para: " +
          product.getName() +
          ". Stock disponible: " +
          product.getStock() +
          ", solicitado: " +
          item.getQuantity()
        );
      }
    } catch (FeignException.NotFound e) {
      throw new IllegalArgumentException(
        "El producto con ID " + item.getProductId() + " no existe.",
        e
      );
    } catch (Exception e) {
      // Captura otras posibles excepciones de Feign o lógicas.
      throw new IllegalStateException(
        "Error al validar el producto con ID " + item.getProductId(),
        e
      );
    }
  }

  /**
   * Calcula el monto total y asigna el precio correcto a cada ítem.
   * Este método asume que la validación ya ha ocurrido.
   */
  private double calculateTotalAndPrepareItems(Order order) {
    double totalAmount = 0.0;
    for (OrderItem item : order.getItems()) {
      ProductDTO product = Objects.requireNonNull(
        productServiceClient.getProductById(item.getProductId()).getBody()
      );

      // Asignación de precio desde el backend para evitar manipulación.
      item.setPrice(product.getPrice());
      item.setProductName(product.getName());

      totalAmount += item.getPrice() * item.getQuantity();
    }
    return totalAmount;
  }

  /**
   * Llama al servicio de productos para actualizar el stock de cada ítem.
   */
  private void updateStockForOrderItems(List<OrderItem> items) {
    for (OrderItem item : items) {
      try {
        productServiceClient.updateStock(item.getProductId(), item.getQuantity());
      } catch (Exception e) {
        e.printStackTrace(); // Log the exact error
        throw new IllegalStateException(
          "Error CRÍTICO: No se pudo actualizar el stock para el producto ID " +
          item.getProductId() +
          ". Detalles: " + e.getMessage(),
          e
        );
      }
    }
  }

  public List<Order> getAllOrders() {
    return orderRepository.findAll();
  }
}