FROM node:latest

RUN mkdir -p /usr/src/mock-premier-league

WORKDIR /usr/src/mock-premier-league

COPY package.json /usr/src/mock-premier-league/

# RUN npm uninstall *

RUN npm install

COPY . /usr/src/mock-premier-league

EXPOSE 8080

VOLUME [ "/usr/src/mock-premier-league" ]
# RUN npm run build

CMD ["npm", "run", "dev"]