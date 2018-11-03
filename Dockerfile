FROM node:8
WORKDIR /usr/src/app
COPY index .
COPY dbConfig.json .
EXPOSE 3000
CMD [ "./index"]
