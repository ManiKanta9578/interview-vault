# --- build stage: produce the jar -----------------------
FROM maven:3.9.11-eclipse-temurin-21 AS build
WORKDIR /app

# copy pom first to leverage layer caching for dependencies
COPY pom.xml .

# copy source
COPY src ./src

# build the jar (use -B for non-interactive)
RUN mvn -B clean package -DskipTests

# --- runtime stage: glibc-based JRE (avoid musl/alpine issues) ---
FROM eclipse-temurin:21-jre-jammy
WORKDIR /app

# copy jar from build stage
COPY --from=build /app/target/*.jar app.jar

# use shell form so $PORT expands at runtime; also pass server.port for safety
ENTRYPOINT ["sh", "-lc", "java -Dserver.port=${PORT:-8080} -jar /app/app.jar"]
