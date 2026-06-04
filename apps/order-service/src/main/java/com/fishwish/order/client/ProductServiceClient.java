package com.fishwish.order.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.fishwish.order.dto.ProductDTO;

/**
 * Cliente Feign para comunicarse con el microservicio 'product-service'.
 * Proporciona una abstracción declarativa sobre las llamadas REST.
 *
 * El atributo 'name' debe coincidir con el nombre de la aplicación cliente
 * registrado en el servidor de descubrimiento (si se usara) o un nombre lógico.
 * El atributo 'url' apunta a la dirección base del servicio de productos.
 * Este valor se externaliza en 'application.yml'.
 */
@FeignClient(name = "product-service", url = "${app.product-service.url}")
public interface ProductServiceClient {

    /**
     * Llama al endpoint GET /api/products/{id} en product-service.
     *
     * @param id El ID del producto a obtener.
     * @return Un ResponseEntity que contiene el ProductDTO si se encuentra.
     *         Usar ResponseEntity permite un manejo más robusto de códigos de estado HTTP (ej. 404 Not Found).
     */
    @GetMapping("/{id}")
    ResponseEntity<ProductDTO> getProductById(@PathVariable("id") Long id);

    /**
     * Llama al endpoint PATCH /api/products/{id}/stock en product-service para descontar stock.
     * En Java/Feign nativo a veces PATCH da problemas si no se configura HttpComponents,
     * pero para mantenerlo simple, usaremos un PUT.
     *
     * @param id       El ID del producto cuyo stock se va a actualizar.
     * @param quantity La cantidad a descontar del stock.
     * @return Un ResponseEntity vacío si la operación es exitosa.
     */
    @PutMapping("/{id}/stock")
    ResponseEntity<Void> updateStock(@PathVariable("id") Long id, @RequestParam("quantity") Integer quantity);
}