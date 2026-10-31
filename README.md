# API de tareas — Clean Architecture

Proyecto pequeño para aprender y demostrar **Clean Architecture** con TypeScript y Node.js. Permite registrar tareas y consultarlas mediante una API REST.

## 1. Requisitos

- Node.js 20 o superior (incluye npm).
- Visual Studio Code.
- Postman (opcional, para probar los endpoints).

Comprueba que Node y npm estén instalados:

```bash
node -v
npm -v
```

## 2. Instalar y ejecutar

Abre la carpeta del proyecto en Visual Studio Code. En la terminal ejecuta:

```bash
npm install
npm run dev
```

El servidor queda disponible en `http://localhost:3000`.

Para detenerlo, presiona `Ctrl + C`.

## 3. Estructura del proyecto

```text
src/
├── domain/
│   ├── entities/
│   │   └── Task.ts
│   └── repositories/
│       └── TaskRepository.ts
├── application/
│   ├── dtos/
│   │   └── CreateTaskDTO.ts
│   └── use-cases/
│       ├── CreateTask.ts
│       ├── ListTasks.ts
│       └── GetTaskById.ts
├── infrastructure/
│   └── repositories/
│       └── InMemoryTaskRepository.ts
├── presentation/
│   ├── controllers/
│   │   └── TaskController.ts
│   ├── routes/
│   │   └── taskRoutes.ts
│   └── app.ts
└── main.ts

tests/
├── unit/
└── integration/
```

### ¿Qué hace cada capa?

- **Dominio:** contiene la entidad `Task` y la interfaz `TaskRepository`. Aquí están las reglas principales del negocio.
- **Aplicación:** contiene los casos de uso. Indica qué acciones puede realizar el sistema: crear, listar y consultar una tarea.
- **Infraestructura:** implementa el repositorio. En este ejemplo utiliza memoria para guardar las tareas.
- **Presentación:** contiene Express, las rutas y el controlador que recibe las solicitudes HTTP.

### Inversión de dependencias e inyección

La capa de dominio define la interfaz `TaskRepository`, pero no conoce la clase que guarda los datos. `InMemoryTaskRepository` implementa esa interfaz.

En `presentation/app.ts` se inyecta el repositorio en los casos de uso. Así, la aplicación depende de una abstracción y no de una implementación concreta. En el futuro se podría crear otro repositorio para una base de datos sin cambiar los casos de uso.

## 4. Probar con Postman

Con el servidor ejecutándose, crea estas solicitudes:

### Registrar una tarea

- Método: `POST`
- URL: `http://localhost:3000/api/tasks`
- Body → raw → JSON:

```json
{
  "title": "Estudiar Clean Architecture"
}
```

Respuesta esperada: código `201 Created`, con el identificador, título, estado y fecha de creación.

### Consultar todas las tareas

- Método: `GET`
- URL: `http://localhost:3000/api/tasks`

Respuesta esperada: código `200 OK` y un arreglo de tareas.

### Consultar una tarea por ID

- Método: `GET`
- URL: `http://localhost:3000/api/tasks/ID_DE_LA_TAREA`

Sustituye `ID_DE_LA_TAREA` por el identificador que devolvió el POST.

### Comprobar que el servidor está activo

- Método: `GET`
- URL: `http://localhost:3000/health`

Respuesta:

```json
{
  "status": "ok"
}
```

### Respuestas de error

- `400`: el título está vacío o no es válido.
- `404`: la tarea solicitada no existe.

## 5. Ejecutar las pruebas

Pruebas unitarias y de integración:

```bash
npm test
```

Modo de observación (vuelve a ejecutar las pruebas al guardar cambios):

```bash
npm run test:watch
```

Compilar TypeScript:

```bash
npm run build
```

Ejecutar la versión compilada:

```bash
npm start
```

- **Vitest:** ejecuta las pruebas.
- **Pruebas unitarias:** verifican los casos de uso de forma aislada.
- **Supertest:** envía solicitudes HTTP a la aplicación Express para probar la integración de rutas, controladores y casos de uso.

## 6. Importante para la demostración

Este proyecto utiliza un repositorio en memoria para mantenerlo sencillo. Por eso, las tareas se borran al detener o reiniciar el servidor. No utiliza una base de datos.

Una forma sencilla de explicar el flujo es:

1. Postman envía una solicitud a una ruta.
2. La ruta dirige la solicitud al controlador.
3. El controlador ejecuta el caso de uso correspondiente.
4. El caso de uso utiliza la interfaz `TaskRepository`.
5. La implementación de infraestructura guarda o consulta la tarea.
6. El controlador devuelve la respuesta HTTP.

**Idea clave:** cada capa tiene una responsabilidad y las capas internas no dependen de Express ni de la forma concreta de almacenar los datos.
