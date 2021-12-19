FROM node:17

# https://github.com/Yelp/dumb-init
RUN wget -O /usr/bin/dumb-init https://github.com/Yelp/dumb-init/releases/download/v1.2.5/dumb-init_1.2.5_x86_64
RUN chmod +x /usr/bin/dumb-init

EXPOSE 3000
WORKDIR /app
COPY . .
RUN npm install

ENTRYPOINT ["/usr/bin/dumb-init", "--"]
CMD ["bin/run"]
