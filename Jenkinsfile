@Library('taskflow-lib@main') _
pipeline {
  agent none
  options { timestamps(); disableConcurrentBuilds() }
  parameters {
    choice(name: 'GIT_REF', choices: ['main', 'develop', 'feature/interfaz-tareas'], description: 'Rama de la aplicación')
  }
  stages {
    stage('Seleccionar rama') {
      agent any
      steps { script { env.TARGET_BRANCH = params.GIT_REF; echo 'Rama: ' + env.TARGET_BRANCH } }
    }
    stage('Pipelines independientes') {
      parallel {
        stage('Pipeline de pruebas') {
          steps {
            build job: 'TaskFlow-Pruebas', parameters: [string(name: 'GIT_REF', value: params.GIT_REF)], wait: true, propagate: true
          }
        }
        stage('Pipeline de calidad') {
          steps {
            build job: 'TaskFlow-Calidad', parameters: [string(name: 'GIT_REF', value: params.GIT_REF)], wait: true, propagate: true
          }
        }
      }
    }
  }
  post {
    always { script { echo 'Duración: ' + currentBuild.durationString + ' | Estado: ' + currentBuild.currentResult } }
    success { node('') { script { ciTasks.notifyTelegram('SUCCESS') } } }
    failure { node('') { script { ciTasks.notifyTelegram('FAILURE') } } }
  }
}
