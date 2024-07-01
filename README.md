# Running the project

## Starting the server

In order to be able to use Yjs to communicate \
between instances we are using a Yjs websocket server. \
To start this you will need to run: \

`npx y-websocket-server`

## Starting the clients

In order to start a client you can run either: \

`npm start`

to run one instance of the app, or: \

`npm run dev`

to run 2 instances of the app concurrently on ports 3000 and 3001. \
if running on the same machine, open one of the instances in another \
browser in order to prevent both instances to update the same react state.
