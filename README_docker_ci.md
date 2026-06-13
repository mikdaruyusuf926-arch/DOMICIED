Automated Docker publish via GitHub Actions

This repository includes a GitHub Actions workflow that builds and pushes a Docker image to Docker Hub when commits are pushed to `main`.

Setup:
1. In your GitHub repository, go to Settings → Secrets → Actions and add:
   - `DOCKERHUB_USERNAME` — your Docker Hub username
   - `DOCKERHUB_TOKEN` — a Docker Hub access token (not your password)

2. The workflow will push image to: `DOCKERHUB_USERNAME/domicied:latest`.

Trigger:
- Push to the `main` branch.

Local manual push (optional):

```bash
docker build -t your-dockerhub-username/domicied:latest .
docker login --username your-dockerhub-username
# Enter password or token when prompted
docker push your-dockerhub-username/domicied:latest
```

After the image is on Docker Hub, you can run it:

```bash
docker run -p 3000:3000 your-dockerhub-username/domicied:latest
```
