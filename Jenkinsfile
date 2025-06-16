pipeline {
  agent any

  environment {
    CI_COMMIT_SHA = "${env.GIT_COMMIT}"
    IMAGE_TAG = "local-registry:5000/simple-todo:${CI_COMMIT_SHA}"
    TEST_RUN_TAG = "${env.BUILD_ID}"
  }

  stages {
    stage('Build + Test Unitaires (Trash)') {
      steps {
        echo "🔨 Build image trash avec tests unitaires - TAG: ${IMAGE_TAG}"
        sh """
          docker build \
            --target=build \
            --env-file .env.build \
            --build-arg TEST_RUN_TAG=${TEST_RUN_TAG} \
            -t ${IMAGE_TAG} \
            --progress=plain .
        """
      }
    }

    stage('Push image trash') {
      steps {
        echo "📤 Push image vers le registre : ${IMAGE_TAG}"
        sh "docker push ${IMAGE_TAG}"
      }
    }
  }

  post {
    success {
      echo "✅ Build (trash image) terminé avec succès : ${IMAGE_TAG}"
    }
    failure {
      echo "❌ Échec de la construction ou des tests unitaires"
    }
  }
}
