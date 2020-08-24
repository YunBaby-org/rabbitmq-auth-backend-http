#################
# Compile Stage #
#################
FROM node:alpine as builder

# Setting working directory
WORKDIR /usr/app

# Copy project dependencies
COPY ./package*.json ./

# Install dependencies
RUN npm install 

# Copy project file
COPY . .
# Run compile. Compile with production setting if corresponding environment is set
RUN if [ "$NODE_ENV" = "production" ]; then npm run compile -- -b tsconfig.prod.json; else npm run compile; fi
RUN npm run compile

#####################
# Application Stage #
#####################
FROM node:alpine

# Setting  working directory
WORKDIR /usr/app

# Copy project dependencies
COPY ./package*.json ./

# Install production dependencies
RUN npm install --production

# Copy compiled file from last stage
COPY --from=builder /usr/app/build .

ENV PORT=80

EXPOSE 80/tcp

ENTRYPOINT [ "node", "./src/index.js" ]
