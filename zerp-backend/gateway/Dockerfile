FROM openjdk:17-alpine
WORKDIR /app
EXPOSE 8080
LABEL maintainer = "ahmetcaggn"
COPY target/Gateway-0.0.1-SNAPSHOT.jar Gateway.jar
ENTRYPOINT ["java", "-jar", "Gateway.jar"]