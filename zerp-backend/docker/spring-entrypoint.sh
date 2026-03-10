#!/bin/bash
set -e

cmd=(java)

# Container-aware JVM memory settings
cmd+=("-XX:+UseContainerSupport" "-XX:MaxRAMPercentage=75.0")

# Optional extra JVM options (e.g. -Xmx512m)
if [ -n "$JAVA_OPTS" ]; then
  # Split JAVA_OPTS safely into array elements
  read -ra extra_opts <<< "$JAVA_OPTS"
  cmd+=("${extra_opts[@]}")
fi

if [ -n "$LOG4J2_CONFIG_PATH" ]; then
  cmd+=("-Dlog4j.configurationFile=$LOG4J2_CONFIG_PATH")
fi

# Ensure SERVICE is provided
if [ -z "$SERVICE" ]; then
  echo "❌ ERROR: SERVICE environment variable is not set."
  echo "Use --build-arg SERVICE=... during build and/or -e SERVICE=... at runtime."
  exit 1
fi

# Determine module name (MODULE_NAME overrides SERVICE)
module_name=${MODULE_NAME:-$SERVICE}
cmd+=("-DmoduleName=$module_name")

# Active Spring profiles (e.g. docker,prod)
if [ -n "$SPRING_PROFILES_ACTIVE" ]; then
  cmd+=("-Dspring.profiles.active=$SPRING_PROFILES_ACTIVE")
fi

# Add the JAR file to run
cmd+=("-jar" "/app/${SERVICE}.jar")

echo "▶ Starting service: $module_name"
echo "▶ Executing: ${cmd[@]}"

# Replace shell with the java process (so PID 1 is java)
exec "${cmd[@]}"