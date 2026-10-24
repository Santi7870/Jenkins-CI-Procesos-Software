# TaskFlow — Procesos de Software

Aplicación web de tareas: crear, editar, buscar, priorizar, eliminar y cambiar el estado de actividades, con persistencia local.

## Ejecutar localmente
Instalar Node.js 22. Ejecutar `npm install` y `npm run dev`. Abrir la URL indicada por Vite.

## Pruebas definidas
- 12 pruebas unitarias: `npm run test:unit`
- 8 pruebas de integración: `npm run test:integration`
- 4 pruebas E2E: instalar Chromium con `npx playwright install chromium` y ejecutar `npm run test:e2e`

## Modularización: tres trabajos Jenkins
El archivo raíz `Jenkinsfile` es el orquestador. Invoca mediante `build job:` dos trabajos independientes **en paralelo**, espera a que terminen y propaga sus resultados:

| Trabajo | Archivo de definición | Responsabilidad |
| --- | --- | --- |
| TaskFlow-Principal | `Jenkinsfile` | Llamar a los pipelines secundarios y notificar a Telegram |
| TaskFlow-Pruebas | `Jenkinsfile.pruebas` | Unitarias, integración y E2E según rama |
| TaskFlow-Calidad | `Jenkinsfile.calidad` | ESLint, build y SonarQube según rama |

La biblioteca Groovy `vars/ciTasks.groovy` comparte funciones de instalación, ejecución y notificación.

## Configuración en Jenkins Windows
Crear tres trabajos tipo **Pipeline**, cada uno con **Pipeline script from SCM**, Git, URL `https://github.com/Santi7870/Jenkins-CI-Procesos-Software.git`, credencial GitHub configurada en cada trabajo, rama de script `*/main` y el respectivo **Script Path** de la tabla anterior.

En el trabajo principal usar **Build with Parameters** y elegir `main`, `develop` o `feature/interfaz-tareas` en `GIT_REF`. El principal transmite la selección a los dos trabajos hijos. Los archivos Jenkinsfile se cargan desde main, mientras el código validado se descarga desde la rama indicada.

Antes de ejecutar los hijos, definir en **Manage Jenkins > System > Global properties > Environment variables** las variables `GIT_REPOSITORY_URL` (URL HTTPS o SSH del repositorio) y `GIT_CREDENTIALS_ID` (ID de la credencial configurada en Jenkins). Los dos Jenkinsfiles secundarios leen esas variables; no contienen URL ni ID de credenciales del repositorio en su código. El repositorio de los propios Jenkinsfiles se configura por SCM en la interfaz de cada trabajo.

Configurar en Jenkins:
- Plugins **Pipeline**, **Git**, **Credentials Binding**, **NodeJS**, **PowerShell** y **SonarQube Scanner for Jenkins**.
- Registrar la herramienta NodeJS `NodeJS22` en Manage Jenkins > Tools. Los agentes que ejecutan los pipelines deben ser Windows, ya que los Jenkinsfiles usan `bat`.
- Registrar el servidor `SonarQube-UDLA` en Manage Jenkins > System con su credencial de token, y el escáner `SonarScanner` en Tools.
- Una **Global Pipeline Library** llamada `taskflow-lib`, obtenida de este repositorio privado en la versión `main`. Usa `vars/ciTasks.groovy`.
- Credenciales `telegram-bot-token` y `telegram-chat-id`.
- SonarQube necesita un servidor en ejecución accesible desde Jenkins. Chromium se instala en el agente al ejecutar la etapa E2E de `main`.

El archivo `jenkins-home.zip` entregado corresponde a otro entorno: contiene el trabajo histórico `Pipeline-CI-Procesos-Software` (Java/Maven), no los tres trabajos TaskFlow. Su única ejecución registrada (#1) terminó correctamente, pero eso no valida estos pipelines. No restaures ese `JENKINS_HOME` encima de una instalación existente para configurar TaskFlow; crea los tres trabajos indicados y conserva el ZIP cifrado porque contiene credenciales y claves.

## Cuatro estrategias de optimización
1. **Paralela:** el principal activa los pipelines secundarios de pruebas y calidad simultáneamente.
2. **Caché:** la biblioteca utiliza una carpeta persistente para dependencias npm.
3. **Selectiva por rama:** feature ejecuta unitarias y ESLint; develop agrega integración, build y SonarQube; main agrega las E2E.
4. **Modular:** un pipeline principal invoca otros dos mediante `build job:`, cada uno con su propio Jenkinsfile; además se reutiliza Groovy.

## Métricas y alcance
Los trabajos permiten medir duración total y por pipeline. Comparar ejecuciones equivalentes de la misma rama, incluyendo caché fría y caliente. Los resultados de la versión nueva **no están verificados todavía en Jenkins**. El build genera `dist/`, pero no existe un despliegue automático a hosting. El Quality Gate de SonarQube no está configurado como bloqueo.

Las credenciales y tokens deben mantenerse dentro de Jenkins, nunca dentro del repositorio.
