FROM node:20-alpine AS builder
RUN apk update && apk --no-cache add git

ARG BASE_URL
ARG URL
ARG STAGING

WORKDIR /app
COPY package.json yarn.lock ./

# Remove rlx dependency which doesn't support ARM64 Linux
RUN sed -i '/@napalmpapalam\/rlx/d' package.json

RUN yarn install --frozen-lockfile

COPY . .
RUN yarn build

FROM nginx:1.20.2-alpine
COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=builder /app/build /usr/share/nginx/html