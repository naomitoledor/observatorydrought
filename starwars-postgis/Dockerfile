FROM node:20-slim

ENV HOME=/home/user \
    NODE_ENV=production \
    PORT=7860

WORKDIR $HOME/app

COPY package*.json ./
RUN npm ci --omit=dev

COPY . .

EXPOSE 7860

CMD ["npm", "start"]
