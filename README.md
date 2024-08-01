# Quake Log Parser API

## Use the API deployed on Render

Here is the link to the deployed API Swagger UI:
- [https://quake-log-parser.onrender.com/docs](https://quake-log-parser.onrender.com/docs)

You can also try the API using the `Try it out` and then clicking on the `Execute` on each endpoint.

## Install and run the API locally

```bash
git clone https://github.com/rcmonteiro/quake-log-parser.git
cd quake-log-parser
pnpm install
```

### Build the project

```bash
pnpm run build
```

### Run the API and Swagger UI

```bash
pnpm run start
```

Access the Swagger UI at [http://localhost:4000/docs](http://localhost:4000/docs)
You can also try the API using the `Try it out` and then clicking on the `Execute` on each endpoint.

## Some comments about the solution for this test

- Since this version is working with a fixed log file, the unit tests were able to cover the majority of the codebase.
- Although the log file is fixed, the LogRepository is ready to receive any log file.
- Changed the JSON output for matches to use as array instead of object, each item in the array is a match, with a unique id.
- A simple CI pipeline was implemented using GitHub Actions to run the unit tests
- The project was set up to use eslint and prettier, with some custom rules to enforce the code style.
- The idea using an API to serve the reports was inspired to deliver a simple solution to test the project with the swagger documentation. My first idea was to build a CLI interface, but I think using the API and some SOLID principles is a better approach to deliver the solution in this test.
- There are some comments with `TODO` in the code, for future improvements.