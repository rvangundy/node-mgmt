node-mgmt
=========

A project management tool that goes with your project. No need for 3rd party collaboration, project management, or tracking services. This data can now be included internally with your project, stored within the git repository, and run locally. Automatically parses "hashtags" and issue numbers from git logs, and generates an ongoing UPDATES.md file. Node-mgmt can also be run as its own process on a server, acting as a standalone team collaboration and issue tracking service.

Insert setup blurb here

## Usage

```javascript
var mgmt = require('node-mgmt');

// Parse git logs
var logs = mgmt.parseCommitLogs();


```
