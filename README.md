# Shopping list

## Starting the development container

Run the command
```
docker compose up
```
Then the app will be running at [http://localhost:5173](http://localhost:5173). The password is `password`. If you edit the application's code while the development container is running and your edits are not automatically loaded to the app, then stop the development container and start it again.

If you add new npm packages or edit the `package.json` files in any other way, you have to stop the development container and delete the images `shopping-list-backend` and `shopping-list-frontend`, and the volumes `shopping-list_node_modules_backend` and `shopping-list_node_modules_frontend` in Docker. If you want to reset the database, then stop the development container and delete the volume `shopping-list_database` in Docker.
