# BUILD FOR LOCAL DEVELOPMENT
###################

FROM node:20-alpine3.18 AS development

# Create app directory
WORKDIR /usr/src/app

COPY package*.json ./

# Install app dependencies using `npm install`
RUN npm install

# Bundle app source
COPY . .

# Build command
RUN npm run build

# ENTRYPOINT for development
ENTRYPOINT ["/bin/sh", "-c", "npm run start:dev"]

# BUILD FOR PRODUCTION
###################

FROM node:20-alpine3.18 AS production

# Create app directory
WORKDIR /usr/src/app

COPY package*.json ./

# Install ONLY production dependencies
RUN npm ci --only=production

# Bundle app source
COPY . .

# Copy build files from development stage
COPY --from=development /usr/src/app/dist ./dist

# ENTRYPOINT for production
ENTRYPOINT ["/bin/sh", "-c", "npm run start:prod"]