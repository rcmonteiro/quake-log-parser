# Quake Log Parser API

## How to use

### Install

```bash
pnpm install
cp .env.example .env
```

Open the `.env` file and set the `LOGFILE_PATH` variable to the path of the log file.

### Build the project

```bash
pnpm run build
```

### Run the API and Swagger UI

```bash
pnpm run start
```

- Access the Swagger UI at [http://localhost:4000/docs](http://localhost:4000/docs)
- You can fetch two types of reports:
- 1. Matches Report
- 2. Deaths Report
- You can run the reports using the `Try it out` button on the top right corner of the page.


### Some comments about the solution

- Since this version is working with a fixed log file, the unit tests were able to cover the majority of the codebase.
- Although the log file is fixed, the LogRepository is ready to receive any log file.
- Changed the JSON output for matches to use as array instead of object, each item in the array is a match, with a unique id.