# Freight Delay Notification Exercise (Engineering Edition)

#### This is my solution to the exercise

### Running this project

1. `npm run server` to start [Temporal Server](https://github.com/temporalio/cli/#installation).
1. `npm install` to install dependencies.
1. `npm run watch` to start the Worker.
1. In another shell, `npm run workflow` to run the Workflow Client.

The Temporal UI can be accessed in
http://localhost:8233/namespaces/default/workflows

### Environment variables

You need to create a .env file (see .env.sample). This is needed to load the environment variables:

- OpenAI key
- Google Maps API key

### Running Tests

`npm run test`

### Developer

**Adebayo Moses**
