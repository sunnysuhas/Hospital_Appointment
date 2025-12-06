FROM node:20-alpine

WORKDIR /app

# Copy only the package manifest (lock files are optional and may not exist)
COPY package.json ./
RUN npm install

COPY . /app

EXPOSE 3000

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
