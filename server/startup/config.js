export default function () {
  const env_variables = new Set(['HT_jwtPrivateKey', 'HT_mongoURI']);

  env_variables.forEach(function (value) {
    if (!(value in process.env)) {
      throw new Error(
        `FATAL ERROR: Required environment variable ${value} not set so application shutting down. Please set this variable before running the application again.`
      );
    }
  });
}
