FROM node:20-slim

RUN useradd -m -u 1000 user

ENV HOME=/home/user \
    NODE_ENV=production \
    PORT=7860

WORKDIR $HOME/app

COPY --chown=user package*.json ./
RUN npm ci --omit=dev

COPY --chown=user . .

USER user

EXPOSE 7860

CMD ["npm", "start"]
