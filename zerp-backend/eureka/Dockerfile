# define base docker image
FROM openjdk:17-alpine
LABEL maintainer = "ahmetcaggn"
WORKDIR /app
EXPOSE 8761
COPY target/eureka-0.0.1-SNAPSHOT.jar eureka.jar
ENTRYPOINT ["java", "-jar", "eureka.jar"]