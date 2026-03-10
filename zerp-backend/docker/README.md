- Note: create compose files under ../../docker directory, not here.

args:
  - SERVICE: the visible name of the service (jar name in the container)
  - MODULE_NAME: the name of the module for log4j2

envs:
  - SPRING_PROFILES_ACTIVE
  - $LOG4J2_CONFIG_PATH
