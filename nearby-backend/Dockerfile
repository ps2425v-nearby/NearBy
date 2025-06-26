# Etapa 1 - Compilar com Gradle
FROM gradle:8.4-jdk21 AS builder
WORKDIR /app
COPY . .
RUN gradle build --no-daemon -x test
RUN cp $(find build/libs -type f -name "*-SNAPSHOT.jar" ! -name "*-plain.jar") app.jar

# Etapa 2 - Executar o JAR
FROM openjdk:21-jdk-slim
WORKDIR /app
COPY --from=builder /app/app.jar .
COPY src/main/resources/osmID.json .
EXPOSE 8080
CMD ["java", "-jar", "app.jar"]
