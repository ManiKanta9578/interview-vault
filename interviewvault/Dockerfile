FROM maven:3.9.11-eclipse-temurin-21 AS build
WORKDIR /app

COPY pom.xml .

COPY src ./src

RUN mvn -B clean package -DskipTests

FROM eclipse-temurin:21-jre-jammy
WORKDIR /app

COPY --from=build /app/target/*.jar app.jar

ENTRYPOINT ["sh", "-lc", "java -Dserver.port=${PORT:-8080} -jar /app/app.jar"]
