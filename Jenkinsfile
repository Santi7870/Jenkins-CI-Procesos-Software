@Library('taskflow-lib@main') _
pipeline {
 agent any
 tools { nodejs 'NodeJS22' }
 options { skipDefaultCheckout(true); timestamps(); disableConcurrentBuilds() }
 stages {
  stage('Checkout') { steps { checkout scm } }
  stage('Validaciones paralelas') {
   parallel {
    stage('ESLint') {
     steps { dir('lint-workspace') { checkout scm; script { ciTasks.run('npm run lint', env.JENKINS_HOME + '\\npm-taskflow-cache') } } }
    }
    stage('Unitarias') {
     steps { dir('unit-workspace') { checkout scm; script { ciTasks.run('npm run test:unit', env.JENKINS_HOME + '\\npm-taskflow-cache') } } }
     post { always { junit allowEmptyResults:true, testResults:'unit-workspace/reports/vitest.xml' } }
    }
   }
  }
  stage('Integración y build') {
   when { anyOf { branch 'develop'; branch 'main' } }
   steps { script { ciTasks.run('npm run test:integration', env.JENKINS_HOME + '\\npm-taskflow-cache') }; bat 'npm run build' }
   post { always { junit allowEmptyResults:true, testResults:'reports/vitest.xml' } }
  }
  stage('SonarQube') {
   when { anyOf { branch 'develop'; branch 'main' } }
   steps {
    script {
     ciTasks.install(env.JENKINS_HOME + '\\npm-taskflow-cache')
     bat 'npm run test:coverage'
     def scannerHome = tool 'SonarScanner'
     withSonarQubeEnv('SonarQube-UDLA') { bat '"' + scannerHome + '\\bin\\sonar-scanner.bat"' }
    }
   }
  }
  stage('E2E y entrega') {
   when { branch 'main' }
   steps { bat 'npx playwright test'; archiveArtifacts artifacts:'dist/**', allowEmptyArchive:false }
   post { always { junit allowEmptyResults:true, testResults:'reports/playwright.xml' } }
  }
 }
 post {
  always { script { echo 'Duración: ' + currentBuild.durationString + ' | Estado: ' + currentBuild.currentResult } }
  success { script { ciTasks.notifyTelegram('SUCCESS') } }
  failure { script { ciTasks.notifyTelegram('FAILURE') } }
 }
}
