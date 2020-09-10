#use the latest node image as our base image
FROM node:latest 

#set as our working directory
WORKDIR /usr/src/app

#copy our package.json into our working directory
COPY package*.json ./

#install dependencies
RUN npm install

#copy everything into the app
COPY . .

RUN npm run tsc

#expose port 3000 for the container to listen to
EXPOSE 3000

#start the app
#CMD node BillSplit/bin/www
CMD ["npm" , "start"]