FROM eclipse-temurin:25-jre

WORKDIR /app

ARG SERVICE

COPY zerp-backend/docker/spring-entrypoint.sh /app/entrypoint.sh
RUN chmod +x /app/entrypoint.sh

COPY jars/${SERVICE}.jar /app/${SERVICE}.jar

ENV SERVICE=${SERVICE} \
    MODULE_NAME=${SERVICE}

ENTRYPOINT ["/app/entrypoint.sh"]
