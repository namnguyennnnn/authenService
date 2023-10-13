FROM node:16.15.0-alpine
WORKDIR /usr/src/app
RUN echo "$PWD"
COPY package.json package-lock.json ./
RUN npm install
COPY ./apps/proxy-service .
COPY tsconfig.json .
RUN npm run build
CMD ["npm", "run", "start"]