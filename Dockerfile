FROM node:20

# use changes to package.json to force Docker not to use the cache
# when we change our application's nodejs dependencies:
COPY package.json /tmp/package.json
COPY package-lock.json /tmp/package-lock.json
RUN cd /tmp && npm install
RUN mkdir -p /cubevision && cp -a /tmp/node_modules /cubevision

ADD . /cubevision
WORKDIR /cubevision

RUN npm run heroku-postbuild

ENTRYPOINT [ "npm", "run", "start" ]