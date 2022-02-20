# Mock-Premier-League
API that exposes endpoints to create users, teams and fixtures for a Mock Premier League

## Hosting

The API is hosted on AWS at
[http://3.12.152.204:3500/api/v1](http://3.12.152.204:3500/api/v1)

## User Stories

**Admin accounts**
- signup/login
- manage teams (add, remove, edit, view)
- create fixtures (add, remove, edit, view)
- Generate unique links for fixture

**Users accounts**

- signup/login
- view teams
- view completed fixtures
- view pending fixtures
- search fixtures/teams

## Stack

- NodeJs
- TypeScript
- Express
- MongoDB
- Redis
- Docker
- POSTMAN
- Jest


## Requirements and Installation

To run this API:

- Clone this repository
- Run docker compose up --build
- Run 'npm install' in the root of the project
- Create .env file (check .env.example for sample)
- Run 'npm run dev' or 'npm run prod' depending on the environment
- To test, run 'npm run test'


## Test Credentials

```sh
- email `admin@test.com`
- password `@dm1nAutH`
```

## Documentation

[https://documenter.getpostman.com/view/11551727/UVkjwJFv](https://documenter.getpostman.com/view/11551727/UVkjwJFv)


## Author

Victor Ikuomola (victorikuomola.k@gmail.com)