FROM mhart/alpine-node:5.11.0

RUN mkdir -p /src
WORKDIR /src

COPY package.json /src

RUN npm install --production

RUN npm install pm2 -g

COPY . /src

EXPOSE 80

CMD ["pm2", "start", "index.js", "-i", "0", "--no-daemon"]