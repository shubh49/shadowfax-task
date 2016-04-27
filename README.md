## ESPGAME -> Shadowfax-task
> Problem \
Create an ESP game for Matching images. e.g. Artigo is an esp game that is used for tagging.


> Problem Description/Rules  
You need atleast two players paired to play this game at a time.
Each player may not know whom they are paired with.
During the game play each paired player is shown the same question.
Each question would have a primary image and a set of secondary images to match to the primary image
Both paired players can move to the next question only when they choose the same set of secondary images

## Live Demo

https://afternoon-springs-44315.herokuapp.com/

## NOTE

- **Some of the features are not working properly on heroku beacuse of SSL certificate. So it is advised to run locally.**
Need to disable secure feature for the app to work.

- **Cascading**    - lower camel case
- **Identitation** - whitespaces

## To run locally

- npm install
- node index.js
- Open http://localhost:3000 in browser

## Technology

- **Express**   - Server side framework
- **Socket-io** - Library for implementing sockets
- **Bootstrap** - Library for responsive design
