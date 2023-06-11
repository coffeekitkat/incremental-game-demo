# incremental-game-demo
A very basic client-server incremental game / cookie clicker / idle game. Made using [Phaser](https://github.com/photonstorm/phaser), [AdonisJS](https://adonisjs.com) and with help of [OpenAI Chat GPT (preview)](https://openai.com/chatgpt)


## Requirements

- NodeJS >= 20.3
- Yarn 1.22

## Setup

Run both client and server.

### Client

Open terminal and run the commands to start the client.

```
cd client

# Install dependencies
yarn install

# Start client in watch mode
yarn watch
```

### Server

Open another terminal to start the server.
```
cd server

# Install dependencies
yarn install

# Start server in watch mode
yarn dev
```


## Troubleshooting

**(client) The client does not auto/live-reload on the browser**

The client does not auto-reload when it's open in browser. You need to manually reload the page because there is no live-reload plugin. I think it should be added
in the rollup config. The client template was obtained from https://github.com/photonstorm/phaser3-typescript-project-template

**(client) tslib error**

Install `tslib` as dev dependency: `yarn add -D tslib`


**(client) socket.io-client "default" is not exported by websocket.js**

Modify the production and dev rollup config (`rollup.config.dev.js` and `rollup.config.prod.js`), add `browser: true` in the `nodeResolve` plugins config

```diff
import { nodeResolve } from '@rollup/plugin-node-resolve';

plugins: [ 
   nodeResolve({
        extensions: [ '.ts', '.tsx' ],
+       browser: true,
   }),
]
```
