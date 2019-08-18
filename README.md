# Steps to run this project:

1. Run `npm i` command
2. Create new mysql database
3. Update database settings inside `ormconfig.json` file
4. Run `npm start` command

## Routes:

For requests to work correctly, headers have to have accesstoken key with user's accesstoken value. This is how user performing the requests is indentified. 

### Endpoints:

1. Create endpoint (post:`/createendpoint`). For route to work as intended, body has to have JSON with following keys:
     name,url,monitoredInterval -values from 5 to 60  representing seconds). If url is stated without protocol (http://) service will assume https. 
2. Update endpoint (put:`/updateendpoint`). To update the endpoint, JSON in the body has to have key `id` with existing `id` of the endpoint belonging to user. Fields which are to be updated need to be included as well (see point 1. for optional fields)
3. list endpoints for given user: (get:`/endpoints`)
4. delete endpoint (with id of 1 in this example):(del:`/deleteendpoint?id=1`)

### MonitoringResults:

5. to list monitoring results (with monitoringendpoint of id 1, and with limit of 20 results): (get:`/monitoringresults?id=1&limit=20`). Limit can be omitted and in such case, up to  10 monitoringresults will be displayed.

### Users:

Users are seeded at the beginning of the app. There are no routes for users

