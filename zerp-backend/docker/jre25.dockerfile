FROM eclipse-temurin:25-jre

WORKDIR /app

ARG SERVICE
ARG JAR_FILE=target/*.jar
COPY ${SERVICE}/${JAR_FILE} ${SERVICE}.jar

ENTRYPOINT ["java","-jar","${SERVICE}.jar"]
