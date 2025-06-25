# Stage 1: Build
FROM gradle:8.4-jdk21 AS builder


WORKDIR /app
COPY . .

# Build the project, skipping tests
RUN gradle build --no-daemon -x test

# Rename the correct JAR (exclude *-plain.jar)
RUN cp $(find build/libs -type f -name "*-SNAPSHOT.jar" ! -name "*-plain.jar") build/libs/app.jar

# Stage 2: Run
FROM openjdk:21-jdk-slim

WORKDIR /usr/app

# Copy renamed JAR from builder stage
COPY --from=builder /app/build/libs/app.jar ./app.jar

EXPOSE 8080
CMD ["java", "-jar", "app.jar"]
