FROM openjdk:17-alpine
WORKDIR /app
EXPOSE 1212
LABEL maintainer = "ahmetcaggn"
COPY target/Mail-0.0.1-SNAPSHOT.jar mail.jar
ENTRYPOINT ["java", "-jar", "notification.jar"]