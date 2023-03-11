# Readme.md

## Description

This project is a web application developed using Hapi.js and MySQL. The aim of this application is to provide an API for user management.

## Installation

To start the project correctly, please follow the following steps:

1. Clone the repository using the following command: `git clone https://github.com/your-repository.git`

2. Run the `npm install` command from a terminal at the root of the project to install all necessary dependencies.

3. Launch the Docker container with the following command:
```
docker run -p 3306:3306 --name hapi-mysql -e MYSQL_ROOT_PASSWORD=hapi -e MYSQL_DATABASE=user -d mysql:5
```
This container will be the project's database with the username root and the password hapi.

4. Go to /server/.env and complete it to configure everything. To modify the DB connection (if you don't want to go through the Docker container and have a DB on your side), you can add this to the .env:
```
DB_HOST = your_host
DB_USER = your_user
DB_PASSWORD = your_password
DB_DATABASE = your_database_name
```

Note: To configure emails, you can go to the following address: https://ethereal.email/ and create a new account, this will give you a functional configuration quickly.

5. Start the server by navigating to the root of the project and running the `npm start` command.

If everything went well, you should be able to go to http://localhost:3000/documentation and access the different API methods.
