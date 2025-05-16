# Stage 1: Build the Angular application
FROM node:18 AS build
WORKDIR /usr/src/app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
# Build for production, output to a 'dist' folder within this build stage
RUN npm run build -- --configuration production --output-path=dist

# Stage 2: Serve the application with Nginx
FROM nginx:alpine
# Copy the built app from the build stage to Nginx's webroot
COPY --from=build /usr/src/app/dist /usr/share/nginx/html
# (Optional) If you need custom Nginx configuration (e.g., for Angular routing)
# Create an nginx.conf file in your 'client' folder and uncomment the next line:
# COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]