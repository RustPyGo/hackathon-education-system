# Use the official Bun image as a base
FROM oven/bun:latest

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and bun.lockb to leverage Docker caching
COPY package.json bun.lockb* ./

# Install dependencies
RUN bun install

# Copy the rest of your application code
COPY . .

# Expose the port Next.js runs on
EXPOSE 3000

# Start the Next.js development server
CMD ["bun", "run", "dev"]
