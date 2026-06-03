# Zerp Keycloak Theme

This folder contains a portable Keycloak login theme for Zerp.

## Install

1. Copy `zerp-frontend/keycloak-theme/zerp` into the Keycloak `themes` directory.
2. In the Keycloak admin console, open the realm settings and set **Login theme** to `zerp`.
3. Set the client **Home URL** to the project URL users should return to when they click the header logo.

If a client Home URL is not available, the logo link falls back to the realm attribute `zerpHomeUrl`, then to the current Keycloak login URL.
