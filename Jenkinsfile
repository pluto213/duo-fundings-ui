pipeline {
  agent any

  environment {
    AWS_REGION = 'ap-southeast-2'
    AWS_ACCOUNT_ID = '127348475166'
    ECR_REPO_NAME = 'duo-aws-repo'
    ECS_CLUSTER_NAME = 'duo-fundings-cluster'
    ECS_SERVICE_NAME = 'duo-fundings-ui-service'
    IMAGE_TAG = "${env.BUILD_NUMBER}"
    LATEST_TAG = 'latest'
    AWS_ECR_REGISTRY = "${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com"
    IMAGE_URI = "${AWS_ECR_REGISTRY}/${ECR_REPO_NAME}:${IMAGE_TAG}"
    LATEST_IMAGE_URI = "${AWS_ECR_REGISTRY}/${ECR_REPO_NAME}:${LATEST_TAG}"
  }

  options {
    buildDiscarder(logRotator(numToKeepStr: '20'))
    timestamps()
  }

  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Install dependencies') {
      steps {
        sh 'npm ci'
      }
    }

    stage('Build') {
      steps {
        sh 'npm run build'
      }
    }

    stage('Build Docker image') {
      steps {
        sh '''
          docker build -t ${IMAGE_URI} .
          docker tag ${IMAGE_URI} ${LATEST_IMAGE_URI}
        '''
      }
    }

    stage('Login to ECR') {
      steps {
        withCredentials([usernamePassword(credentialsId: 'aws-credentials', usernameVariable: 'AWS_ACCESS_KEY_ID', passwordVariable: 'AWS_SECRET_ACCESS_KEY')]) {
          sh '''
            aws configure set region ${AWS_REGION}
            aws configure set aws_access_key_id ${AWS_ACCESS_KEY_ID}
            aws configure set aws_secret_access_key ${AWS_SECRET_ACCESS_KEY}
            aws ecr get-login-password --region ${AWS_REGION} | docker login --username AWS --password-stdin ${AWS_ECR_REGISTRY}
          '''
        }
      }
    }

    stage('Push image') {
      steps {
        sh '''
          docker push ${IMAGE_URI}
          docker push ${LATEST_IMAGE_URI}
        '''
      }
    }

    stage('Deploy to ECS') {
      steps {
        sh '''
          aws ecs update-service \
            --cluster ${ECS_CLUSTER_NAME} \
            --service ${ECS_SERVICE_NAME} \
            --force-new-deployment
        '''
      }
    }
  }

  post {
    success {
      echo "部署成功：${LATEST_IMAGE_URI}"
    }
    failure {
      echo '部署失败，请检查 Jenkins 日志和 AWS 权限配置。'
    }
  }
}
