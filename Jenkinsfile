pipeline {
  agent any

  environment {
    CI_COMMIT_SHA = "${env.GIT_COMMIT}"
    IMAGE_TAG = "local-registry:5000/simple-todo:${env.CI_COMMIT_SHA}"
  }

  stages {
    stage('Build + Test Unitaires (Trash)') {
      steps {
        echo "🔨 Build image trash avec tests unitaires - TAG: ${IMAGE_TAG}"

        sh '''
          docker build \
            --target=trash \
            --env_file .env.build \
            --build-arg TEST_RUN_TAG=$(date +%s) \
            -t $IMAGE_TAG \
            --progress=plain .
        '''
      }
    }

    stage('Push image trash') {
      steps {
        echo "📤 Push image vers le registre : ${IMAGE_TAG}"

        sh '''
          docker push $IMAGE_TAG
        '''
      }
    }
  }

  post {
    success {
      echo "✅ Build trash terminé avec succès : $IMAGE_TAG"
    }
    failure {
      echo "❌ Échec de la construction ou des tests unitaires"
    }
  }
}
