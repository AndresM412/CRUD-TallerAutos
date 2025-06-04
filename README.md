# API RESTful para Taller de Autos

API RESTful para la gestión de un taller de autos. Este proyecto permite realizar operaciones CRUD (Crear, Leer, Actualizar, Eliminar) sobre tres entidades principales: Clientes, Autos y Facturas.

## Endpoints disponibles

### Clientes
- **GET** `/clientes`: Obtener todos los clientes.
- **GET** `/clientes/:id`: Obtener un cliente por ID.
- **POST** `/clientes`: Crear un nuevo cliente.
- **PUT** `/clientes/:id`: Actualizar un cliente existente.
- **DELETE** `/clientes/:id`: Eliminar un cliente.

### Autos
- **GET** `/autos`: Obtener todos los autos.
- **GET** `/autos/:id`: Obtener un auto por ID.
- **POST** `/autos`: Crear un nuevo auto.
- **PUT** `/autos/:id`: Actualizar un auto existente.
- **DELETE** `/autos/:id`: Eliminar un auto.

### Facturas
- **GET** `/facturas`: Obtener todas las facturas.
- **GET** `/facturas/:id`: Obtener una factura por ID.
- **POST** `/facturas`: Crear una nueva factura.
- **PUT** `/facturas/:id`: Actualizar una factura existente.
- **DELETE** `/facturas/:id`: Eliminar una factura.

 
```markdown
# 🚀 Despliegue de Aplicación en Kubernetes con GKE

Este proyecto documenta el despliegue de una aplicación en Google Kubernetes Engine (GKE), incluyendo creación del clúster, despliegue, exposición, escalado y limpieza de recursos. Todo se ha ejecutado desde la terminal local con herramientas `gcloud` y `kubectl`.

---

## 🛠️ Paso 1: Crear el clúster en GKE

Se creó un clúster llamado `mi-cluster-gke` con 2 nodos en la zona `us-central1-a`:

```bash
gcloud container clusters create mi-cluster-gke \
  --zone us-central1-a \
  --machine-type=e2-medium \
  --num-nodes=2
```

---

## 🔧 Paso 2: Configurar kubectl para acceder al clúster

Para conectarse al clúster desde `kubectl`:

```bash
gcloud container clusters get-credentials mi-cluster-gke \
  --zone us-central1-a \
  --project crud-autos-459913
```

Verificación de conexión:

```bash
kubectl get nodes
```

---

## 📦 Paso 3: Crear y aplicar el Deployment

Se creó un archivo llamado `deployment.yaml` con el siguiente contenido:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: mi-aplicacion
spec:
  replicas: 2
  selector:
    matchLabels:
      app: mi-aplicacion
  template:
    metadata:
      labels:
        app: mi-aplicacion
    spec:
      containers:
      - name: mi-aplicacion
        image: nginx:latest
        ports:
        - containerPort: 80
```

Aplicación del Deployment:

```bash
kubectl apply -f deployment.yaml
```

Verificación de pods y despliegue:

```bash
kubectl get pods
kubectl get deployments
```

Resultado esperado:

```
NAME                             READY   STATUS    RESTARTS   AGE
mi-aplicacion-xxxxxxx-xxxxx     1/1     Running   0          Xs

NAME            READY   UP-TO-DATE   AVAILABLE   AGE
mi-aplicacion   2/2     2            2           Xs
```

---

## 🌐 Paso 4: Exponer el Deployment como un Servicio

Se creó un archivo llamado `service.yaml` con el siguiente contenido:

```yaml
apiVersion: v1
kind: Service
metadata:
  name: mi-aplicacion-service
spec:
  selector:
    app: mi-aplicacion
  ports:
    - protocol: TCP
      port: 80
      targetPort: 80
  type: LoadBalancer
```

Aplicación del servicio:

```bash
kubectl apply -f service.yaml
```

Verificación del servicio:

```bash
kubectl get services
```

Se espera una IP externa tipo LoadBalancer:

```
NAME                    TYPE           CLUSTER-IP     EXTERNAL-IP     PORT(S)        AGE
mi-aplicacion-service   LoadBalancer   34.xxx.xxx.xx  35.xxx.xxx.xx   80:xxxxx/TCP   Xs
```

Con esta IP puedes acceder a la app NGINX desde el navegador.

---

## 📈 Paso 5: Escalar la aplicación

Escalado de 2 a 4 réplicas:

```bash
kubectl scale deployment mi-aplicacion --replicas=4
```

Verificación:

```bash
kubectl get pods
```

Resultado esperado: 4 pods corriendo.

---

## 🧹 Paso 6: Limpiar recursos

Eliminación del deployment y el servicio:

```bash
kubectl delete -f deployment.yaml
kubectl delete -f service.yaml
```

Eliminación del clúster:

```bash
gcloud container clusters delete mi-cluster-gke \
  --zone us-central1-a \
  --project crud-autos-459913
```

---
