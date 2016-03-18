FROM daocloud.io/node:0.10-onbuild
RUN mkdir -p /var/app
WORKDIR /var/app
COPY . /var/app
RUN npm install
EXPOSE 4000

CMD ["node", "server.js"]
