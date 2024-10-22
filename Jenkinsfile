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
        HOMELAB_ENDPOINT = "192.168.84.16"
        IMAGE_TAG = "utm-builder"
        CONTAINER_NAME = "utm-builder"
        DEV = "$JOB_BASE_NAME"
        MONGO_ADMIN_USER = "admin_user"
        MONGO_ADMIN_PASS = "0"
        // DOCKER_RUN = "docker run -d -p 3130:80 --restart unless-stopped --name $CONTAINER_NAME $DOCKERH_REPO/$IMAGE_TAG:latest"
//        DOCKER_RUN_DEV = "docker run -d -p 3131:80 --restart unless-stopped --name $CONTAINER_NAME-$DEV $NEXUS_REPO/$IMAGE_TAG-$DEV:latest"
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
                sh "docker build -t $NEXUS_REPO/$IMAGE_TAG-$DEV:latest -t $NEXUS_REPO/$IMAGE_TAG-$DEV:$BUILD_VERSION ."
                // Next line in single quotes for security
                sh 'echo $NEXUS_CREDS_PSW | docker login -u $NEXUS_CREDS_USR --password-stdin $NEXUS_REPO'
                sh "docker push $NEXUS_REPO/$IMAGE_TAG-$DEV:latest"
                sh "docker push $NEXUS_REPO/$IMAGE_TAG-$DEV:$BUILD_VERSION"
            }
        }
        stage('Deploy DEV Docker container on HOMELAB (Host)') {
            // environment {
            //     HOMELAB_CREDS = credentials('creds-homelab')
            // }
            when {
                expression {
                    BRANCH_NAME == "dev" || BRANCH_NAME == "main"
                }
            }
            steps {
                // script {
                //     sshagent(['ssh-homelab']) {
                //         echo "Deploying Docker container on Homelab  ..."
                //         sh "ssh -o StrictHostKeyChecking=no $HOMELAB_CREDS_USR@$HOMELAB_ENDPOINT 'bash -c \"\$(wget -qLO - https://raw.githubusercontent.com/juronja/utm-builder/refs/heads/dev/compose-dev-commands.sh)\"'"
                //     }
                // }
                script {
                    sh "docker compose down"
                    sh "docker image prune --force"
                    sh "rm compose.yaml"
                    // sh "curl -o compose.yaml https://raw.githubusercontent.com/juronja/utm-builder/refs/heads/dev/compose.yaml"
                    echo "Starting container $CONTAINER_NAME-$DEV ..."
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