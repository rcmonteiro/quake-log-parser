# Quake Log Parser API

## Use the API Deployed on Render

You can access the deployed API with Swagger UI using the following link:
- [Quake Log Parser API on Render](https://quake-log-parser.onrender.com/docs)

Please note that because this project uses free resources on Render, it may take up to 50 seconds for the API to become accessible again after a period of inactivity.

You can interact with the API directly in the browser. Use the `Try it out` button and then click `Execute` on each endpoint to test it out.

## Install and Run the API Locally

To set up and run the API on your local machine, follow these steps:

### Clone the Repository

```bash
git clone https://github.com/rcmonteiro/quake-log-parser.git
cd quake-log-parser
pnpm install
```

### Build the Project

```bash
pnpm run build
```

### Run the API and Swagger UI

```bash
pnpm run start
```

Access the Swagger UI at [http://localhost:4000/docs](http://localhost:4000/docs). You can also use the `Try it out` button and click `Execute` on each endpoint to test the API locally.

## Some Comments on the Proposed Solution

- Regarding the scoring rules, to align with the Quake game score, it was assumed that the player gains 1 point for each kill, as long as the victim is not the player themselves. The player loses 1 point each time they are killed by the <world> or by themselves.
- The log path was hardcoded both in the API routes and the tests. However, a `LogRepository` was created that accepts any file, facilitating future updates to allow different log files to be read.
- Although the project could have been delivered as a CLI, a domain and application layer was developed in an agnostic manner. This approach allows it to be consumed by any interaction form. After creating unit tests and validating business rules, I decided to build a simple API with Swagger documentation to expose the log parsing in a more interactive way.
- To avoid memory overflow when reading large files, the logs are read line by line in a read stream.
- The business rules for scoring are in the `Match` entity, and the log reading rules are in the `LogRepository`. While this results in more extensive code, it makes maintenance easier, especially when collaborating with other developers. The code could have been a simple single script, but I believed it was important to emphasize maintainable code for larger teams.
- A simple pipeline was set up to run unit and e2e tests using GitHub Actions.
- To illustrate some points for improvement in observability, comments with `TODO` were left in the code.
- The project was configured with ESLint and Prettier to enforce a consistent code style within the team.