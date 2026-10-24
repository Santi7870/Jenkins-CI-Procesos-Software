# Pipeline CI - Procesos de Software

Proyecto Java con Jenkins, Maven, JUnit, GitHub privado y avisos por Telegram.

## Tres etapas

1. Repositorio privado: Jenkins obtiene el código desde GitHub.
2. Compilación y tests: se ejecutan pruebas automatizadas.
3. Notificación: Telegram informa si el build finalizó correctamente o con errores.

## Estrategias de optimización

- **Ejecución paralela:** en la rama `main` se ejecutan al mismo tiempo las suites `CalculadoraTest` y `CasosAdicionalesTest`, cada una en su propio directorio.
- **Caché:** Maven almacena dependencias en `JENKINS_HOME/maven-cache`, reutilizables entre ejecuciones del mismo Jenkins.
- **Ejecución selectiva:** en `main` se ejecutan ambas suites (5 pruebas). En otras ramas se ejecuta únicamente la suite principal (3 pruebas).
- **Modularidad:** `scripts/run-tests.ps1` y `scripts/send-telegram.ps1` contienen tareas reutilizables invocadas desde el `Jenkinsfile`.

## Configuración Jenkins para Windows

- Trabajo tipo **Pipeline**, definición **Pipeline script from SCM**, Git, rama `*/main`, ruta `Jenkinsfile`.
- Instalar Maven desde **Manage Jenkins > Tools** con nombre exacto `Maven3`.
- Configurar acceso de solo lectura al repositorio privado desde las credenciales del trabajo.
- Crear dos credenciales **Secret text**: `telegram-bot-token` y `telegram-chat-id`.
- Ejecutar **Build Now** y revisar **Pipeline Overview**, **Tests** y Telegram.
- Para probar otra rama, cambiar la rama configurada en el trabajo o utilizar un pipeline multibranch.

El disparador automático por push no está configurado. Las optimizaciones deben validarse mediante una nueva ejecución en Jenkins. No se ha medido una reducción de tiempo.
