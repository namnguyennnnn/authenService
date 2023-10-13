FROM node:16.15.0-alpine
WORKDIR /src
COPY package.json package-lock.json ./
RUN npm install
COPY tsconfig.json tsconfig.build.json nest-cli.json ./

RUN mkdir ./libs
COPY ./libs ./libs

RUN mkdir -p ./apps/protos
COPY ./apps/protos ./apps/protos                    

RUN mkdir -p ./apps/auth
COPY ./apps/auth ./apps/auth

RUN npm run build
CMD ["npm", "run", "start", "auth"]
