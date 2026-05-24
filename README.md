# Shopping list

This is a web application for keeping a shopping list. It has been designed for shared use between many users and especially to be used with a smart phone. It has been developed by [amandahamynen](https://github.com/amandahamynen) and [VSirvio](https://github.com/VSirvio) mainly for their personal use.

## Features

* Display all items on the shopping list
* Add a new item to the list
* Edit the name of an item
* Change the location of an item by dragging and dropping it
* Mark an item as purchased
* Delete all items that have been marked as purchased

## Technologies used

* **Backend:** [Express](https://expressjs.com) / TypeScript
* **Frontend:** [React](https://react.dev) / JavaScript
* **Database:** [Prisma ORM](https://www.prisma.io/orm) / [PostgreSQL](https://www.postgresql.org) (+ [MongoDB](https://www.mongodb.com) for [rate limiter data store](https://github.com/animir/node-rate-limiter-flexible))
* **CI/CD pipeline:** [GitHub Actions](https://docs.github.com/en/actions)
* **Development environment:** [Docker Compose](https://docs.docker.com/compose)

## Starting the development environment

Run the command

       docker compose up

Then the app will be running at [http://localhost:5173](http://localhost:5173). The password for logging in is `password`. The development environment can be shut down by pressing <kbd>Ctrl</kbd>+<kbd>C</kbd>.

## Running the backend in production

1. In `utils/generate_password_hash.mjs` set the constant `PASSWORD` to the password you want to use for logging in. Then run `node utils/generate_password_hash.mjs` to get its hash.

2. Go to `backend/` directory

3. Make sure that environment variables are set as below (`.env` is supported)

       NODE_ENV=production
       DATABASE_URL=your_postgresql_database_url
       LIMITER_DB_URL=your_mongodb_database_url
       LIMITER_DB_NAME=your_mongodb_database_name
       PORT=some_port_number
       HOST=0.0.0.0
       CORS_ORIGINS=your_frontend_url
       PASSWORD_HASH=your_password_hash
       SECRET=a_good_secret_key_here

    where `your_postgresql_database_url`, `your_mongodb_database_url`, `your_mongodb_database_name`, `some_port_number`, `your_frontend_url`, `your_password_hash`, and `a_good_secret_key_here` have been replaced with your own values (`HOST` can be also changed if necessary).

4. Install dependencies with `npm ci`

5. Generate Prisma client with `npx prisma generate`

6. Apply database migrations with `npx prisma migrate deploy`

7. Start the backend with `npm start`

## Running the frontend in production

1. Go to `frontend/` directory

2. Install dependencies with `npm ci`

3. In `src/config.js` replace `/api` with your backend URL.

4. Build the frontend with `npm run build`

5. The built frontend can be then found in `dist/` directory
