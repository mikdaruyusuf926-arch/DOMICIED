# Domicied School Website

Simple Node.js + Express site for Dr. Mohamed Ibn Chambas Institute of Education.

## Local run

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the app:
   ```bash
   npm start
   ```
3. Open `http://localhost:3000`

## Docker

Build and run the app in a container:

```bash
docker build -t domicied-app .
docker run -p 3000:3000 domicied-app
```

## Deployment notes

- The app serves `DOMICIED.HTML` as the homepage and exposes `/submit` for enrollment submissions.
- Static files are served from the project root, so keep `styles.css` and any other assets in the same folder structure.

## Optional email delivery

If you want submissions emailed, set these environment variables before starting the server:

- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_SECURE` (`true` or `false`)
- `SMTP_USER`
- `SMTP_PASS`
- `SUBMISSION_EMAIL`
- `SMTP_FROM` (optional)

Example:

```bash
SMTP_HOST=smtp.example.com SMTP_PORT=587 SMTP_USER=user@example.com SMTP_PASS=secret SUBMISSION_EMAIL=admin@example.com npm start
```

## Publish providers

This project can be deployed to any Node.js host that supports `npm start`, including:

- Railway
- Render
- Heroku
- Vercel (Node.js server)
- DigitalOcean App Platform

## Heroku deployment

1. Install the [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli).
2. Log in with `heroku login`.
3. Create a new app:
   ```bash
   heroku create your-app-name
   ```
4. Push the repository to Heroku:
   ```bash
   git push heroku main
   ```
5. Set environment variables if you need email delivery:
   ```bash
   heroku config:set SMTP_HOST=smtp.example.com SMTP_PORT=587 SMTP_USER=user@example.com SMTP_PASS=secret SUBMISSION_EMAIL=admin@example.com
   ```
6. Open the live site:
   ```bash
   heroku open
   ```
