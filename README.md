# FishWish E-Commerce

Guia completa para instalar, configurar y ejecutar FishWish en macOS y Windows.

FishWish es una tienda en linea para vender snacks naturales deshidratados para mascotas. El proyecto usa un frontend en Next.js y dos microservicios en Spring Boot.

## Que vas a ejecutar

El sistema completo tiene 4 piezas:

```text
1. PostgreSQL       Base de datos
2. product-service Catalogo y stock de productos
3. order-service   Registro de pedidos
4. web             Tienda en el navegador
```

Cuando todo este funcionando, estas URLs deben abrir:

```text
Frontend:        http://localhost:3000
Productos API:   http://localhost:8081/api/products
Ordenes API:     http://localhost:8082/api/orders
PostgreSQL:      localhost:5433
```

## Mapa del proyecto

```text
fishwish-ecommerce-main/
|-- apps/
|   |-- web/                Frontend Next.js
|   |-- product-service/    Backend de productos
|   `-- order-service/      Backend de ordenes
|-- docker/
|   `-- docker-compose.yml  Base de datos y servicios Docker
|-- packages/               Configuraciones compartidas
|-- package.json            Scripts principales del monorepo
|-- pnpm-workspace.yaml     Configuracion de pnpm
`-- turbo.json              Configuracion de Turborepo
```

## Requisitos obligatorios

Antes de correr el proyecto instala:

- Git
- Docker Desktop
- Node.js 18 o superior
- pnpm 9
- Java JDK 21
- Maven 3.9 o superior

No saltes esta parte. Si falta una herramienta, algo va a fallar despues.

## Instalar requisitos en macOS

La forma mas simple en macOS es usar Homebrew.

Instalar Homebrew si no lo tienes:

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

Instalar herramientas:

```bash
brew install git node pnpm openjdk@21 maven
```

Instalar Docker Desktop:

```bash
brew install --cask docker
```

Despues abre Docker Desktop manualmente desde Applications y espera a que diga que Docker esta corriendo.

Si `java --version` no encuentra Java 21, configura Java:

```bash
echo 'export PATH="/opt/homebrew/opt/openjdk@21/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
```

En Mac con Intel, puede ser:

```bash
echo 'export PATH="/usr/local/opt/openjdk@21/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
```

## Instalar requisitos en Windows

Usa PowerShell como administrador.

Instalar con Winget:

```powershell
winget install Git.Git
winget install Docker.DockerDesktop
winget install OpenJS.NodeJS.LTS
winget install EclipseAdoptium.Temurin.21.JDK
winget install Apache.Maven
```

Cierra y vuelve a abrir PowerShell despues de instalar.

Instalar pnpm:

```powershell
npm install -g pnpm@9
```

Abre Docker Desktop desde el menu Inicio y espera a que termine de arrancar.

## Verificar que todo esta instalado

Ejecuta estos comandos.

macOS:

```bash
git --version
docker --version
node --version
pnpm --version
java --version
mvn --version
```

Windows PowerShell:

```powershell
git --version
docker --version
node --version
pnpm --version
java --version
mvn --version
```

Debes ver versiones, no errores de "command not found" o "no se reconoce".

Versiones esperadas:

```text
Node.js: 18 o superior
pnpm: 9.x
Java: 21
Maven: 3.9 o superior
Docker: cualquier version reciente de Docker Desktop
```

## Descargar el proyecto

Elige una carpeta donde quieras guardar el proyecto.

Con HTTPS:

```bash
git clone https://github.com/al064697/fishwish-ecommerce-main.git
cd fishwish-ecommerce-main
```

Con SSH:

```bash
git clone git@github.com:al064697/fishwish-ecommerce-main.git
cd fishwish-ecommerce-main
```

En Windows tambien puedes usar los mismos comandos desde PowerShell.

## Instalar dependencias del frontend

Desde la raiz del proyecto:

```bash
pnpm install
```

Esto instala las dependencias de `apps/web` y de los paquetes compartidos.

Si falla por permisos o cache, prueba:

```bash
pnpm store prune
pnpm install
```

## Forma recomendada de correr el proyecto

La forma mas facil para desarrollo es:

```text
Docker: solo PostgreSQL
Maven: product-service y order-service
pnpm: frontend
```

Necesitas 4 terminales abiertas:

```text
Terminal 1: PostgreSQL
Terminal 2: product-service
Terminal 3: order-service
Terminal 4: frontend
```

No cierres esas terminales mientras uses el proyecto.

## Paso 1: levantar PostgreSQL

Desde la raiz del proyecto:

macOS:

```bash
docker compose -f docker/docker-compose.yml up -d postgres
```

Windows PowerShell:

```powershell
docker compose -f docker/docker-compose.yml up -d postgres
```

Verifica que este vivo:

```bash
docker ps
```

Debes ver un contenedor llamado:

```text
fishwish-postgres
```

Datos de la base de datos:

```text
Host local:      localhost
Puerto local:    5433
Base de datos:   fishwish
Usuario:         fishwish
Password:        fishwish123
```

## Paso 2: preparar variables de entorno

Los microservicios necesitan saber como conectarse a PostgreSQL.

Importante: estas variables se configuran por terminal. Si abres una terminal nueva, debes volver a pegarlas.

macOS:

```bash
export PGHOST=localhost
export PGPORT=5433
export PGDATABASE=fishwish
export PGUSER=fishwish
export PGPASSWORD=fishwish123
export PRODUCT_SERVICE_URL=http://localhost:8081/api/products
```

Windows PowerShell:

```powershell
$env:PGHOST="localhost"
$env:PGPORT="5433"
$env:PGDATABASE="fishwish"
$env:PGUSER="fishwish"
$env:PGPASSWORD="fishwish123"
$env:PRODUCT_SERVICE_URL="http://localhost:8081/api/products"
```

## Paso 3: levantar product-service

Abre una terminal nueva.

Entra al proyecto:

```bash
cd ruta/a/fishwish-ecommerce-main
```

En esa misma terminal pega las variables de entorno del paso 2.

Luego ejecuta:

macOS:

```bash
cd apps/product-service
mvn spring-boot:run
```

Windows PowerShell:

```powershell
cd apps/product-service
mvn spring-boot:run
```

Si todo va bien, veras algo parecido a:

```text
Tomcat started on port 8081
Product Service INICIADO correctamente en http://localhost:8081
```

Prueba en otra terminal:

macOS:

```bash
curl http://localhost:8081/api/products
```

Windows PowerShell:

```powershell
Invoke-RestMethod http://localhost:8081/api/products
```

Respuesta esperada: una lista de productos FishWish.

## Paso 4: levantar order-service

Abre otra terminal nueva.

Entra al proyecto:

```bash
cd ruta/a/fishwish-ecommerce-main
```

En esa misma terminal pega las variables de entorno del paso 2.

Luego ejecuta:

macOS:

```bash
cd apps/order-service
mvn spring-boot:run
```

Windows PowerShell:

```powershell
cd apps/order-service
mvn spring-boot:run
```

Si todo va bien, veras algo parecido a:

```text
Tomcat started on port 8082
Order Service iniciado en http://localhost:8082
```

Prueba en otra terminal:

macOS:

```bash
curl http://localhost:8082/api/orders
```

Windows PowerShell:

```powershell
Invoke-RestMethod http://localhost:8082/api/orders
```

Respuesta esperada: una lista vacia `[]` si todavia no hay pedidos.

## Paso 5: levantar el frontend

Abre otra terminal desde la raiz del proyecto.

macOS:

```bash
pnpm dev
```

Windows PowerShell:

```powershell
pnpm dev
```

Abre el navegador en:

```text
http://localhost:3000
```

Si ves la tienda y los productos cargan, el sistema ya esta funcionando.

## Resumen de terminales abiertas

Al final debes tener esto:

```text
Terminal 1:
docker compose -f docker/docker-compose.yml up -d postgres

Terminal 2:
cd apps/product-service
mvn spring-boot:run

Terminal 3:
cd apps/order-service
mvn spring-boot:run

Terminal 4:
pnpm dev
```

Recuerda: Terminal 2 y Terminal 3 necesitan las variables de entorno antes de correr Maven.

## Variables del frontend

El frontend ya usa valores por defecto:

```text
NEXT_PUBLIC_PRODUCT_API_URL=http://localhost:8081
NEXT_PUBLIC_ORDER_URL=http://localhost:8082
```

Si quieres definirlas manualmente, crea este archivo:

```text
apps/web/.env.local
```

Contenido:

```env
NEXT_PUBLIC_PRODUCT_API_URL=http://localhost:8081
NEXT_PUBLIC_ORDER_URL=http://localhost:8082
```

Despues reinicia `pnpm dev`.

## Probar que una compra funciona

Antes de probar una compra, deben estar activos:

```text
PostgreSQL
product-service
order-service
```

macOS:

```bash
curl -X POST http://localhost:8082/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "customerName": "Cliente Demo",
    "address": "Calle 1",
    "city": "Campeche",
    "phone": "9810000000",
    "items": [
      { "productId": 1, "quantity": 1 }
    ]
  }'
```

Windows PowerShell:

```powershell
$body = @{
  customerName = "Cliente Demo"
  address = "Calle 1"
  city = "Campeche"
  phone = "9810000000"
  items = @(
    @{
      productId = 1
      quantity = 1
    }
  )
} | ConvertTo-Json -Depth 5

Invoke-RestMethod -Method Post -Uri http://localhost:8082/api/orders -ContentType "application/json" -Body $body
```

Si funciona, recibiras la orden creada con un `id`.

Luego revisa:

```bash
curl http://localhost:8082/api/orders
```

En Windows:

```powershell
Invoke-RestMethod http://localhost:8082/api/orders
```

## Correr todo el backend con Docker

Tambien puedes levantar PostgreSQL y los dos microservicios con Docker:

```bash
docker compose -f docker/docker-compose.yml up --build
```

Esto levanta:

```text
PostgreSQL:       localhost:5433
product-service: http://localhost:8081
order-service:   http://localhost:8082
Redis:           localhost:6379
RabbitMQ:        http://localhost:15672
```

En este modo el frontend se corre aparte:

```bash
pnpm dev
```

Si solo quieres detener Docker:

```bash
docker compose -f docker/docker-compose.yml down
```

Si quieres borrar tambien los datos de PostgreSQL:

```bash
docker compose -f docker/docker-compose.yml down -v
```

## Comandos utiles

Frontend y monorepo desde la raiz:

```bash
pnpm dev
pnpm build
pnpm lint
pnpm check-types
```

Backend desde `apps/product-service` o `apps/order-service`:

```bash
mvn spring-boot:run
mvn clean package
```

Docker desde la raiz:

```bash
docker compose -f docker/docker-compose.yml up -d postgres
docker compose -f docker/docker-compose.yml up --build
docker compose -f docker/docker-compose.yml down
docker ps
docker logs fishwish-postgres
```

## Puertos usados

```text
3000  Frontend Next.js
5433  PostgreSQL expuesto en tu maquina
6379  Redis
8081  product-service
8082  order-service
15672 RabbitMQ dashboard
```

Si un puerto esta ocupado, el servicio puede fallar al iniciar.

## Como apagar todo

Para detener frontend o microservicios:

```text
Presiona Ctrl + C en cada terminal donde esten corriendo.
```

Para detener Docker:

```bash
docker compose -f docker/docker-compose.yml down
```

Para detener Docker y borrar la base de datos local:

```bash
docker compose -f docker/docker-compose.yml down -v
```

## Solucion de problemas

### Docker no arranca

Abre Docker Desktop manualmente y espera a que diga que esta corriendo.

Luego prueba:

```bash
docker ps
```

Si eso falla, Docker todavia no esta listo.

### `docker compose` no existe

Prueba:

```bash
docker-compose --version
```

Si tu instalacion usa el comando viejo, reemplaza:

```text
docker compose
```

por:

```text
docker-compose
```

### `mvn` no se reconoce

Maven no esta instalado o no esta en el PATH.

macOS:

```bash
brew install maven
```

Windows:

```powershell
winget install Apache.Maven
```

Cierra y vuelve a abrir la terminal.

### Java no es version 21

El proyecto usa Java 21.

Verifica:

```bash
java --version
```

Si sale Java 17, Java 11 u otra version, instala JDK 21 y configura tu PATH/JAVA_HOME.

### `Connection refused` al iniciar un microservicio

Casi siempre significa que PostgreSQL no esta corriendo.

Verifica:

```bash
docker ps
```

Si no aparece `fishwish-postgres`:

```bash
docker compose -f docker/docker-compose.yml up -d postgres
```

### Error con `PGHOST`, `PGPORT`, `PGDATABASE`, `PGUSER` o `PGPASSWORD`

Te faltan variables de entorno en esa terminal.

Vuelve a pegar esto antes de correr Maven.

macOS:

```bash
export PGHOST=localhost
export PGPORT=5433
export PGDATABASE=fishwish
export PGUSER=fishwish
export PGPASSWORD=fishwish123
export PRODUCT_SERVICE_URL=http://localhost:8081/api/products
```

Windows PowerShell:

```powershell
$env:PGHOST="localhost"
$env:PGPORT="5433"
$env:PGDATABASE="fishwish"
$env:PGUSER="fishwish"
$env:PGPASSWORD="fishwish123"
$env:PRODUCT_SERVICE_URL="http://localhost:8081/api/products"
```

### El frontend abre pero no muestra productos

Primero revisa product-service:

```bash
curl http://localhost:8081/api/products
```

En Windows:

```powershell
Invoke-RestMethod http://localhost:8081/api/products
```

Si eso falla, product-service no esta corriendo.

Si eso funciona, revisa `apps/web/.env.local`. Debe apuntar a:

```env
NEXT_PUBLIC_PRODUCT_API_URL=http://localhost:8081
```

Reinicia `pnpm dev`.

### El checkout falla

Primero revisa order-service:

```bash
curl http://localhost:8082/api/orders
```

En Windows:

```powershell
Invoke-RestMethod http://localhost:8082/api/orders
```

Luego revisa que product-service este activo:

```bash
curl http://localhost:8081/api/products
```

Si order-service no puede hablar con product-service, asegurate de tener esta variable:

```text
PRODUCT_SERVICE_URL=http://localhost:8081/api/products
```

### El puerto 3000 ya esta ocupado

Busca que proceso lo usa o cambia el puerto temporalmente:

```bash
cd apps/web
pnpm dev -- --port 3001
```

Luego abre:

```text
http://localhost:3001
```

### El puerto 8081 o 8082 ya esta ocupado

Probablemente dejaste otro backend corriendo.

macOS:

```bash
lsof -i :8081
lsof -i :8082
```

Windows PowerShell:

```powershell
netstat -ano | findstr :8081
netstat -ano | findstr :8082
```

Cierra el proceso anterior o cambia el puerto en:

```text
apps/product-service/src/main/resources/application.yml
apps/order-service/src/main/resources/application.yml
```

### pnpm install falla

Prueba limpiar cache:

```bash
pnpm store prune
pnpm install
```

Tambien revisa que Node sea 18 o superior:

```bash
node --version
```

## Checklist final

Antes de decir "ya corre", confirma esto:

- `docker ps` muestra `fishwish-postgres`.
- `http://localhost:8081/api/products` devuelve productos.
- `http://localhost:8082/api/orders` responde.
- `http://localhost:3000` abre la tienda.
- Puedes agregar un producto al carrito.
- Puedes completar el checkout.

## Notas importantes

- Este repositorio no trae Maven Wrapper, por eso debes instalar Maven y usar `mvn`.
- `product-service` tiene productos demo en memoria dentro de `ProductController`.
- `order-service` guarda ordenes en PostgreSQL.
- Redis y RabbitMQ estan en Docker Compose, pero la ejecucion basica del proyecto no depende de ellos.
- Los directorios `target/`, `.next/` y `node_modules/` son generados por compilacion/instalacion.
