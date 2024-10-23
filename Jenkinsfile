//def xgs

pipeline {
    agent any
    tools {
        nodejs 'NodeJS_v20' // adds NPM commands
    }
    environment {
        BUILD_VERSION = VersionNumber (versionNumberString: '${BUILD_YEAR}.${BUILD_MONTH}.${BUILDS_THIS_MONTH}')
        DOCKERH_REPO = "juronja"
        NEXUS_REPO = "192.168.84.16:8082"
        IMAGE_TAG = "utm-builder"
        CONTAINER_NAME = "utm-builder"
        // BRANCH = "$JOB_BASE_NAME"
        MONGO_CREDS = credentials('creds-mongo-utm-builder') // essential for bringing the variables to jenkins container
        MONGO_ADMIN_USER = "$MONGO_CREDS_USR" // essential for bringing the variables to jenkins container
        MONGO_ADMIN_PASS = "$MONGO_CREDS_PSW" // essential for bringing the variables to jenkins container

//        DOCKER_RUN = "docker run -d -p 3130:80 --restart unless-stopped --name $CONTAINER_NAME $DOCKERH_REPO/$IMAGE_TAG:latest"
//        DOCKER_RUN_DEV = "docker run -d -p 3131:80 --restart unless-stopped --name $CONTAINER_NAME-$BRANCH_NAME $NEXUS_REPO/$IMAGE_TAG-$BRANCH_NAME:latest"
    }
    options { buildDiscarder(logRotator(numToKeepStr: '10')) } 
    stages {
//        stage('Innit ext script') {
//            steps {
//                script {
//                    xgs = load 'jenkins.groovy'
//                }
//            }
//        }
        // stage('Build app with Vite') {
        //     steps {
        //         echo "Building App with Vite ..."
        //         sh "npm install"    
        //         sh "npm run build"
        //     }
        // }
        stage('Build DEV Docker image for Nexus') {
            environment {
                NEXUS_CREDS = credentials('nexus-creds')
            }
            when {
                expression {
                    BRANCH_NAME == "dev" || BRANCH_NAME == "main"
                }
            }
            steps {
                echo "Building DEV Docker image for Nexus ..."
                sh "docker build -t $NEXUS_REPO/$IMAGE_TAG-$BRANCH_NAME:latest ."
                // Next line in single quotes for security
                sh 'echo $NEXUS_CREDS_PSW | docker login -u $NEXUS_CREDS_USR --password-stdin $NEXUS_REPO'
                sh "docker push $NEXUS_REPO/$IMAGE_TAG-$BRANCH_NAME:latest"
            }
        }
        stage('Deploy DEV Docker container on HOMELAB (Host)') {
            when {
                expression {
                    BRANCH_NAME == "dev" || BRANCH_NAME == "main"
                }
            }
            steps {
                script {
                    sh "docker compose down"
                    sh "docker image prune --force"
                    // sh "rm compose.yaml"
                    sh "printenv"
                    sh "curl -o compose.yaml https://raw.githubusercontent.com/juronja/utm-builder/refs/heads/dev/compose.yaml > compose.yaml"
                    echo "Starting container $CONTAINER_NAME-$BRANCH_NAME ..."
                    sh "docker compose up -d"
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
                    sh "docker compose down"
                    sh "docker image prune --force"
                    // sh "curl -o compose.yaml https://raw.githubusercontent.com/juronja/utm-builder/refs/heads/dev/compose.yaml > compose.yaml"
                    echo "Starting container $CONTAINER_NAME ..."
                    sh "docker compose up -d"

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
                    sshagent(['ssh-aws']) {
                        echo "Deploying Docker container on EC2  ..."
                        sh "ssh -o StrictHostKeyChecking=no ec2-user@35.157.110.150 'bash -c \"\$(wget -qLO - https://raw.githubusercontent.com/juronja/utm-builder/refs/heads/dev/compose-dev-e2c-commands.sh)\"'"
                    }
                }
            }
        }
    }
}