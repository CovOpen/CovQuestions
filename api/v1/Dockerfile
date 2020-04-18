# FROM node:13.12@sha256:7921beca7c2d5ba543c52a0baa5e6368a282c0dfaf6a8d12115026cde4dcb556 as builder

# # set working directory
# RUN  mkdir /usr/local/app
# WORKDIR /usr/local/app

# COPY ./package-lock.json /usr/local/app/package-lock.json
# COPY ./package.json /usr/local/app/package.json
# RUN npm ci 
# # Because: https://stackoverflow.com/questions/37715224/copy-multiple-directories-with-one-command
# COPY ./src/ ./src/

# COPY ["tsconfig.json", "./"]
# RUN npm run build



##################
### production ###
##################

FROM nginx:1.17.9@sha256:7ac7819e1523911399b798309025935a9968b277d86d50e5255465d6592c0266
WORKDIR /etc/nginx

RUN rm -r ./*
COPY ./nginx/ ./

RUN rm -r /usr/share/nginx/html/
# COPY --from=builder /usr/local/app/dist /usr/share/nginx/html
COPY ./dist /usr/share/nginx/html
