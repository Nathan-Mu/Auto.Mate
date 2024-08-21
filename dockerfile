FROM node:22.6.0-alpine3.19
RUN addgroup app && adduser -S -G app app
USER app
WORKDIR /app
COPY ["package.json", "yarn.lock", "./"]
RUN yarn
COPY . .
RUN mkdir uploads
RUN mkdir uploads/transactions
EXPOSE 3000
ENTRYPOINT ["yarn", "start"]