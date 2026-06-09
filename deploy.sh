#!/bin/bash
# deploy.sh — Build y despliegue completo en Kubernetes local (Docker Desktop)

set -e

echo "🐳 Construyendo imágenes Docker..."

# product-service (mock Node.js)
docker build -t fishwish/product-service:latest ./apps/product-service

# order-service (Spring Boot)
docker build -t fishwish/order-service:latest ./apps/order-service

# web (Next.js)
docker build -t fishwish/web:latest -f Dockerfile.web .

echo ""
echo "☸️  Aplicando manifiestos de Kubernetes..."

kubectl apply -f k8s-secrets.yaml
kubectl apply -f k8s-postgres.yaml
kubectl apply -f k8s-redis-rabbitmq.yaml
kubectl apply -f k8s-product-service.yaml

echo "⏳ Esperando a que PostgreSQL y product-service estén listos..."
kubectl wait --for=condition=ready pod -l app=postgres --timeout=90s
kubectl wait --for=condition=ready pod -l app=product-service --timeout=60s

kubectl apply -f k8s-order-service.yaml
kubectl apply -f k8s-web.yaml

echo ""
echo "✅ Despliegue completo. Verificando pods..."
kubectl get pods
echo ""
echo "🌐 Servicios disponibles:"
kubectl get services
echo ""
echo "📌 Accesos:"
echo "   Web:             http://localhost"
echo "   Order Service:   http://localhost:8082"
echo "   Product Service: http://localhost:8081/api/products"
echo "   RabbitMQ UI:     http://localhost:15672  (guest/guest)"
