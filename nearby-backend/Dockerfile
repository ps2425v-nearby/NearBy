# Etapa 1 - Build
FROM gradle:8.4-jdk21 AS builder
WORKDIR /app

# Copiar arquivos de configuração primeiro para melhor cache
COPY build.gradle.kts settings.gradle.kts ./
COPY gradle/ gradle/

# Baixar dependências (melhor cache)
RUN gradle dependencies --no-daemon

# Copiar código fonte
COPY src/ src/

# Build da aplicação
RUN gradle build --no-daemon -x test

# Encontrar e copiar o JAR correto
RUN cp $(find build/libs -type f -name "*-SNAPSHOT.jar" ! -name "*-plain.jar") app.jar

# Etapa 2 - Executar o JAR
FROM openjdk:21-jdk-slim
WORKDIR /app

# Copiar o JAR da etapa de build
COPY --from=builder /app/app.jar .

# Expor a porta
EXPOSE 8080

# Comando para executar a aplicação
CMD ["java", "-jar", "app.jar"]