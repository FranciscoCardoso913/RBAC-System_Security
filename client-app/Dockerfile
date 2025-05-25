FROM node:18

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the app
COPY . .

# Expose the default React dev server port
EXPOSE 3000

# Start the development server
CMD ["npm", "start"]
