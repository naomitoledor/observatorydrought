---
title: Drought Observatory
emoji: "🌎"
colorFrom: blue
colorTo: green
sdk: docker
app_port: 7860
---

# Drought Observatory

Express/EJS application prepared for deployment on Hugging Face Spaces with Docker.

## Runtime variables

Set these in the Space settings when the services are hosted outside the container:

- `GEOSERVER_URL`: public GeoServer base URL, for example `https://example.com/geoserver`
- `DATABASE_URL`: PostgreSQL connection URL, for example `postgres://user:password@host:5432/database`
- `GEOSERVER_USERNAME` and `GEOSERVER_PASSWORD`: optional GeoServer credentials if the app needs authenticated server-side requests

The app listens on `PORT`, defaulting to `7860` in Docker.
