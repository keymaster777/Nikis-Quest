FROM node:18

WORKDIR /app
COPY . /app

RUN npm install
EXPOSE 3003

CMD ["/bin/bash"]
