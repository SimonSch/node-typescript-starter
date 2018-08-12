FROM node:8
WORKDIR /usr/src/app
COPY server .
EXPOSE 3000
CMD [ "./server"]
