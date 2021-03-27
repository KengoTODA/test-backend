[![Coverage Status](https://coveralls.io/repos/github/KengoTODA/test-backend/badge.svg?branch=master)](https://coveralls.io/github/KengoTODA/test-backend?branch=master)

## Developers' Note

### Configure environment variable

To [configure passport-github](https://github.com/jaredhanson/passport-github/tree/46b96e8ad4af7a3f30532316ab2ce6cc36316ed2#configure-strategy), we need to set `GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET` environment variable.
It is also necessary to configure `GITHUB_REDIRECT_URL` if your server is not running at `https://localhost:3000/` (e.g. in production)).

```
GITHUB_CLIENT_ID=...
GITHUB_CLIENT_SECRET=...
GITHUB_REDIRECT_URL=https://example.com:3000/accounts/login/callback
```

### Run MongoDB in container

```sh
docker pull mongo:4.4
docker run -it -p 27017:27017 mongo:4.4
```

### Enable HTTPS in local

To [use HTTPS in local](https://web.dev/how-to-use-local-https/), make sure you've created `localhost.pem` and `localhost-key.pem` in the project root directory:

```sh
brew install mkcert
mkcert -install
mkcert localhost
```

Then you can access https://localhost:3000/ instead of http://localhost:3000/.
