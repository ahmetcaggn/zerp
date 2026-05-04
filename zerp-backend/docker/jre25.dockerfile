FROM eclipse-temurin:25-jre

WORKDIR /app

ARG SERVICE
ARG JAR_FILE=zerp-backend/${SERVICE}/target/*.jar

COPY zerp-backend/docker/spring-entrypoint.sh /app/entrypoint.sh
RUN chmod +x /app/entrypoint.sh

COPY ${JAR_FILE} ${SERVICE}.jar

ENV SERVICE=${SERVICE} \
    MODULE_NAME=${SERVICE}

ENTRYPOINT ["/app/entrypoint.sh"]
