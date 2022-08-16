FROM node:18

WORKDIR /app
COPY . /app

EXPOSE 3003

CMD ["/bin/bash"]
