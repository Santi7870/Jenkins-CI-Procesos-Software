# Pipeline CI - Procesos de Software

Ejercicio de Integración Continua con Jenkins, GitHub privado y Java.

## Etapas

1. **Repositorio privado:** Jenkins obtiene el código desde GitHub.
2. **Compilación y tests:** Maven compila el proyecto y ejecuta 3 pruebas JUnit.
3. **Notificación:** Jenkins envía el resultado al chat de Telegram configurado.

## Archivos

- `src/main/java`: código Java de ejemplo.
- `src/test/java`: pruebas automáticas.
- `pom.xml`: dependencias y configuración Maven.
- `Jenkinsfile`: pipeline declarativo.

## Configuración en Jenkins (Windows)

1. En **Manage Jenkins > Tools**, configurar Maven con nombre exacto `Maven3` y activar instalación automática, si está disponible.
2. Crear un trabajo **Pipeline** con **Pipeline script from SCM**, Git y la URL de este repositorio.
3. Seleccionar las credenciales autorizadas de GitHub para clonar el repositorio privado. Usar rama `*/main` y ruta `Jenkinsfile`.
4. En **Manage Jenkins > Credentials**, añadir dos credenciales de tipo **Secret text**:
   - `telegram-bot-token`: token del bot de Telegram.
   - `telegram-chat-id`: identificador del chat destinatario.
5. Ejecutar **Build Now** y revisar los resultados y el mensaje recibido.

**Seguridad:** Nunca subir tokens, contraseñas o identificadores secretos al repositorio.

## Prueba local

Con Java 17+ y Maven instalados:

```powershell
mvn clean test
```

El proyecto debería compilar y ejecutar tres tests exitosos.
