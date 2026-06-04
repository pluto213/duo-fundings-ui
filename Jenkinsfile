pipeline {
    agent any

    stages {

        stage('Checkout') {
            steps {
                checkout scm

                sh '''
                pwd
                ls -la
                '''
            }
        }

        stage('Docker Build') {
            steps {
                sh '''
                docker build -t duo-fundings-ui:test .
                '''
            }
        }

        stage('Verify Image') {
            steps {
                sh '''
                docker images | grep duo-fundings-ui
                '''
            }
        }
    }
}