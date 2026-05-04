# local spring properties

```bash
cat crm.properties.template >> crm.properties
cat employee.properties.template >> employee.properties
cat eureka.properties.template >> eureka.properties
cat gateway.properties.template >> gateway.properties
cat notification.properties.template >> notification.properties
cat resource.properties.template >> resource.properties
cat sale.properties.template >> sale.properties
cat suggestion.properties.template >> suggestion.properties
cat user.properties.template >> user.properties
cat socket.properties.template >> socket.properties
```

## Docker templates

Files like `*.docker.properties.template` are meant for Docker runs. They use
container-friendly hostnames (e.g., `postgres`, `eureka`, `kafka`) and rely on
environment variables for secrets.

How to use them:

1. Create actual files (or mount them) by copying the templates, for example:

```bash
cat crm.docker.properties.template >> docker-config/crm.docker.properties
cat employee.docker.properties.template >> docker-config/employee.docker.properties
cat notification.docker.properties.template >> docker-config/notification.docker.properties
cat resource.docker.properties.template >> docker-config/resource.docker.properties
cat sale.docker.properties.template >> docker-config/sale.docker.properties
cat suggestion.docker.properties.template >> docker-config/suggestion.docker.properties
cat user.docker.properties.template >> docker-config/user.docker.properties
cat gateway.docker.properties.template >> docker-config/gateway.docker.properties
cat socket.docker.properties.template >> docker-config/socket.docker.properties
cat eureka.docker.properties.template >> docker-config/eureka.docker.properties
```

2. Point aggregated to these files using one of these options:

- Set `AGGREGATED_CONFIG_ROOT` to a folder that contains subfolders named
  `crm/`, `employee/`, `notification/`, `resource/`, `sale/`, `suggestion/`,
  `user/` and put the docker properties inside each folder.
- Or set `CRM_CONFIG_PATH`, `EMPLOYEE_CONFIG_PATH`, etc. to explicit file paths
  (preferred when you want to store them in this folder).

The Docker compose file wires these variables into the container, and the
aggregated app reads them at runtime to load each service's properties.
