## ESLinter

A small Next.js 16 application with a login page and `/api/login` endpoint.

## Requirements

- Node.js 22 or newer
- npm
- `JWT_SECRET` for the login API

## Development

Install dependencies and start the dev server:

```bash
npm install
JWT_SECRET=dev-secret npm run dev
```

Open `http://localhost:3000`.

## Production Build

Build the app locally:

```bash
JWT_SECRET=dev-secret npm run build
```

The production build uses `next build --webpack` and `output: "standalone"` so it can be packaged into a small runtime image.

## Docker

Build the production image:

```bash
docker build -t eslinter .
```

Run the container:

```bash
docker run -p 3000:3000 -e JWT_SECRET=your-secret eslinter
```

## Docker Compose

Start with Compose:

```bash
JWT_SECRET=your-secret docker compose up --build
```

The app listens on `http://localhost:3000`.

## Notes

- Do not commit a real `JWT_SECRET`.
- The Docker image runs the standalone Next.js server with `node server.js`.
- Remote Google Fonts were removed so production builds work in restricted network environments.
