FROM eclipse-temurin:25-jre

WORKDIR /app

ARG SERVICE
# Try to find the executable JAR: if multiple JARs exist (due to classifier), *-exec.jar is the executable one.
# If only one JAR exists (aggregated), then it is the executable one.
ARG JAR_FILE=zerp-backend/${SERVICE}/target/*.jar

COPY zerp-backend/docker/spring-entrypoint.sh /app/entrypoint.sh
RUN chmod +x /app/entrypoint.sh

# We use a wildcard to copy, but rename it to a fixed name for the ENTRYPOINT
COPY ${JAR_FILE} /app/${SERVICE}.jar

ENV SIMPLE_JRE_DOCKER_FILE_ENV_SERVICE=${SERVICE}

ENTRYPOINT ["/bin/sh", "-c", "java -jar /app/${SIMPLE_JRE_DOCKER_FILE_ENV_SERVICE}.jar"]
