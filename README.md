# TaskFlow — Procesos de Software

Aplicación web funcional: crear, editar, eliminar y buscar tareas, priorizarlas, cambiar estados y guardar datos en el navegador.

## Ejecutar

Node.js 22. Ejecutar `npm install` y `npm run dev`. Para CI, la biblioteca utiliza `npm install` con caché persistente porque todavía no se ha generado un archivo `package-lock.json` verificado. Abrir la dirección que muestra Vite.

## Pruebas: 24 casos definidos

- 12 unitarias: `npm run test:unit`
- 8 integración: `npm run test:integration`
- 4 E2E Playwright: `npx playwright install chromium` y `npm run test:e2e`

## Ramas

- `feature/*`: ESLint y unitarias en paralelo.
- `develop`: añade integración, build y análisis SonarQube.
- `main`: añade pruebas E2E y archiva `dist/`.

## Optimización

- Paralelo: ESLint y pruebas unitarias independientes.
- Caché: `npm ci --cache` con caché persistente en Jenkins.
- Selectivo: etapas activadas según `BRANCH_NAME` mediante `when`.
- Biblioteca compartida: `vars/ciTasks.groovy`, importada mediante `@Library('taskflow-lib@main')`.

## Jenkins Windows — configuración manual necesaria

Crear **Multibranch Pipeline** GitHub con credenciales del repositorio privado.
En Manage Jenkins > Tools instalar/configurar NodeJS con nombre **NodeJS22** (plugin NodeJS).
En Manage Jenkins > System configurar **Global Pipeline Library**, nombre **taskflow-lib**, fuente Git SCM que apunte a este mismo repositorio, versión por defecto **main**, y permitir la versión solicitada.
Instalar plugin **SonarQube Scanner for Jenkins**; en System registrar servidor **SonarQube-UDLA** con credenciales; en Tools configurar SonarScanner CLI como **SonarScanner**.
Configurar secretos `telegram-bot-token` y `telegram-chat-id`.
En el agente Windows instalar navegador E2E: `npx playwright install chromium`.
SonarQube necesita un servidor accesible desde Jenkins. El Quality Gate aún no está configurado como bloqueo.
El pipeline archiva la carpeta `dist/` para la entrega; no despliega a hosting externo. Para comparación de rendimiento, observar duración de etapas en Jenkins y registrar al menos tres ejecuciones con caché fría y caliente.

## Medición

Jenkins publica tiempos de ejecución; realizar al menos tres ejecuciones comparables para medir tiempos y observar el efecto de caché. La ejecución de esta nueva versión en Jenkins está pendiente.
