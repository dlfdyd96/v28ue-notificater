# First stage: build and test
FROM node:10-alpine as nodebuild    
WORKDIR /app                        
COPY . .                            
RUN npm install && npm run build &&  npm run test && npm run test:cov

# Second stage: assemble the runtime image
FROM node:10-alpine as noderun      
WORKDIR /app                        
COPY --from=nodebuild /app/dist/ ./ 
COPY package*.json ./
COPY .env .env               
RUN npm install --only=prod         
EXPOSE 3000
ENTRYPOINT node /app/main       