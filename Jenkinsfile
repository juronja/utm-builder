//def xgs

pipeline {
    agent any
    tools {
        nodejs 'NodeJS_v20'
    }
    environment {
        BUILD_VERSION = VersionNumber (versionNumberString: '${BUILD_YEAR}.${BUILD_MONTH}.${BUILDS_THIS_MONTH}')
        DOCKERH_REPO = "juronja"
        NEXUS_REPO = "192.168.84.16:8082"
        IMAGE_TAG = "$JOB_BASE_NAME"
        IMAGE_TAG_DEV = "$JOB_BASE_NAME-dev"
        CONTAINER_NAME = "$JOB_BASE_NAME"
        CONTAINER_NAME_DEV = "$JOB_BASE_NAME-dev"
        DOCKER_RUN = "docker run -d -p 151515:80 --restart unless-stopped --name $CONTAINER_NAME $DOCKERH_REPO/$IMAGE_TAG:latest"
    }
        
    stages {
//        stage('Innit ext script') {
//            steps {
//                script {
//                    xgs = load 'jenkins.groovy'
//                }
//            }
//        }
        stage('Build app with Vite') {
            steps {
                echo "Building App with Vite ..."
                sh "npm install"    
                sh "npm run build"
            }
        }
        stage('Build DEV Docker image for Nexus') {
            environment {
                NEXUS_CREDS = credentials('nexus-creds')
            }
            when {
                expression {
                    BRANCH_NAME == "dev" or BRANCH_NAME == "main"
                }
            }
            steps {
                echo "Building Docker image for Nexus ..."
                sh "docker build -t $NEXUS_REPO/$IMAGE_TAG_DEV:latest -t $NEXUS_REPO/$IMAGE_TAG_DEV:$BUILD_VERSION ."
                // Next line in single quotes for security
                sh 'echo $NEXUS_CREDS_PSW | docker login -u $NEXUS_CREDS_USR --password-stdin 192.168.84.16:8082'
                sh "docker push $NEXUS_REPO/$IMAGE_TAG_DEV:latest"
                sh "docker push $NEXUS_REPO/$IMAGE_TAG_DEV:$BUILD_VERSION"
            }
        }
        stage('Deploy DEV Docker container on HOST') {
            when {
                expression {
                    BRANCH_NAME == "dev" or BRANCH_NAME == "main"
                }
            }
            steps {
                script {
                    // Check if container exists
                    def containerId = sh(script: "docker ps --quiet --filter name=$CONTAINER_NAME", returnStdout: true).trim()

                    if (containerId.isEmpty()) {
                        echo "Container $CONTAINER_NAME not found. Skipping stop/remove steps."
                    } else {
                        echo "Stopping and removing existing container $CONTAINER_NAME ..."
                        sh "docker stop $CONTAINER_NAME"
                        sh "docker rm $CONTAINER_NAME"
                        sh "docker rmi $DOCKERH_REPO/$IMAGE_TAG:latest" // Remove leftover image if needed
                        sh "docker rmi $DOCKERH_REPO/$IMAGE_TAG:$BUILD_VERSION" // Remove leftover image if needed
                    }

                    // Always run the container regardless of previous existence
                    echo "Starting container $CONTAINER_NAME ..."
                    sh "$DOCKER_RUN"
                    sh "docker image prune --force"
                }
            }
        }
        stage('Build Docker image for Docker Hub') {
            environment {
                DOCKERHUB_CREDS = credentials('dockerhub-creds')
            }
            when {
                expression {
                    BRANCH_NAME == "main"
                }
            }
            steps {
                echo "Building Docker image for Docker Hub ..."
                sh "docker build -t $DOCKERH_REPO/$IMAGE_TAG:latest -t $DOCKERH_REPO/$IMAGE_TAG:$BUILD_VERSION ."
                // Next line in single quotes for security
                sh 'echo $DOCKERHUB_CREDS_PSW | docker login -u $DOCKERHUB_CREDS_USR --password-stdin'
                sh "docker push $DOCKERH_REPO/$IMAGE_TAG:latest"
                sh "docker push $DOCKERH_REPO/$IMAGE_TAG:$BUILD_VERSION"
            }
        }
        stage('Deploy Docker container on HOST') {
            when {
                expression {
                    BRANCH_NAME == "main"
                }
            }
            steps {
                script {
                    // Check if container exists
                    def containerId = sh(script: "docker ps --quiet --filter name=$CONTAINER_NAME", returnStdout: true).trim()

                    if (containerId.isEmpty()) {
                        echo "Container $CONTAINER_NAME not found. Skipping stop/remove steps."
                    } else {
                        echo "Stopping and removing existing container $CONTAINER_NAME ..."
                        sh "docker stop $CONTAINER_NAME"
                        sh "docker rm $CONTAINER_NAME"
                        sh "docker rmi $DOCKERH_REPO/$IMAGE_TAG:latest" // Remove leftover image if needed
                        sh "docker rmi $DOCKERH_REPO/$IMAGE_TAG:$BUILD_VERSION" // Remove leftover image if needed
                    }

                    // Always run the container regardless of previous existence
                    echo "Starting container $CONTAINER_NAME ..."
                    sh "$DOCKER_RUN"
                    sh "docker image prune --force"
                }
            }
        }
        stage('Deploy Docker container on EC2') {
            when {
                expression {
                    BRANCH_NAME == "main"
                }
            }
            steps {
                script {
                    sshagent(['aws-ssh']) {
                        echo "Deploying Docker container on EC2  ..."
                        sh "ssh -o StrictHostKeyChecking=no ec2-user@35.157.110.150 'bash -c \"\$(wget -qLO - https://raw.githubusercontent.com/juronja/DiluteRight/refs/heads/main/ec2-commands.sh)\"'"
                    }
                }
            }
        }
    }
}