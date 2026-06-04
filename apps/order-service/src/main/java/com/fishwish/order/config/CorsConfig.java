package com.fishwish.order.config;

import java.util.Arrays;
import java.util.List;

import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.Ordered;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * 🛡️ CORS Configuration - Robusta y garantizada
 * 
 * Usa AMBOS métodos para máxima compatibilidad:
 * 1. FilterRegistrationBean - Se ejecuta FIRST (Ordered.HIGHEST_PRECEDENCE)
 * 2. WebMvcConfigurer - Fallback para endpoints que no van a través del filtro
 * 
 * Válido para: http://localhost:3000, https://fishwish-ecommerce-web-five.vercel.app
 */
@Configuration
public class CorsConfig implements WebMvcConfigurer {

    // Usar List en lugar de array para evitar problemas de conversión
    private static final List<String> ALLOWED_ORIGINS = Arrays.asList(
        "http://localhost:3000", 
        "https://fishwish-ecommerce-web-five.vercel.app"
    );
    
    private static final List<String> ALLOWED_METHODS = Arrays.asList(
        "GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"
    );
    
    private static final long MAX_AGE = 3600;

    /**
     * ✅ MÉTODO 1: FilterRegistrationBean
     * Se ejecuta ANTES que cualquier otra cosa (HIGHEST_PRECEDENCE)
     * Garantiza que CORS se procesa primero, incluso si hay otros filtros
     */
    @Bean
    public FilterRegistrationBean<CorsFilter> corsFilter() {
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        CorsConfiguration config = new CorsConfiguration();

        // ✅ Configurar orígenes permitidos
        config.setAllowedOrigins(ALLOWED_ORIGINS);
        
        // ✅ Permitir todos los métodos HTTP
        config.setAllowedMethods(ALLOWED_METHODS);
        
        // ✅ Permitir todos los headers (incluyendo Authorization, Content-Type, etc.)
        config.setAllowedHeaders(Arrays.asList("*"));
        
        // ✅ Headers expuestos al cliente
        config.setExposedHeaders(Arrays.asList("Authorization", "X-Total-Count", "X-Page-Count"));
        
        // ✅ Permitir envío de credenciales (cookies, etc.)
        config.setAllowCredentials(true);
        
        // ✅ Cache de preflight requests (en segundos)
        config.setMaxAge(MAX_AGE);

        source.registerCorsConfiguration("/**", config);

        FilterRegistrationBean<CorsFilter> bean = new FilterRegistrationBean<>(new CorsFilter(source));
        
        // 🔴 CRÍTICO: Orden HIGHEST_PRECEDENCE = ejecutar ANTES que todo
        bean.setOrder(Ordered.HIGHEST_PRECEDENCE);
        
        System.out.println("✅ CORS Filter registrado con orden HIGHEST_PRECEDENCE");
        System.out.println("   Orígenes permitidos: " + ALLOWED_ORIGINS);
        System.out.println("   Métodos permitidos: " + ALLOWED_METHODS);

        return bean;
    }

    /**
     * ✅ MÉTODO 2: WebMvcConfigurer (Fallback)
     * Para endpoints que no pasen a través del filtro
     */
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins(ALLOWED_ORIGINS.toArray(new String[0]))
                .allowedMethods(ALLOWED_METHODS.toArray(new String[0]))
                .allowedHeaders("*")
                .exposedHeaders("Authorization", "X-Total-Count", "X-Page-Count")
                .allowCredentials(true)
                .maxAge(MAX_AGE);
        
        System.out.println("✅ WebMvc CORS mappings configurado para todos los endpoints");
    }
}