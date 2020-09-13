# BillSplit
Billsplit is a cost-splitting app designed to improve the process of purchasing items for groups.

https://billsplittt.herokuapp.com/

[Design Document](./Documentation/DesignDocument.md)

[Progress Report 1](./Documentation/Progress1.md)

[Progress Report 2](./Documentation/Progress2.md)

[Progress Report 3](./Documentation/Progress3.md)

[Retrospective](./Documentation/retro.md)

## Build Process
Starting the Database:
Navigate to the BillSplit directory and run "mongod --dbpath ./db/storage --repair" in the terminal.
Then, run "mongod --config db/config/mongod.conf" in the terminal

Compiling:
In a new terminal, navigate to the "BillSplit/BillSplit" directory and run "tsc" in the terminal.

Starting the App: 
Run "www" in the "BillSplit/BillSplit/bin/" directory.
Navigate to "http://localhost:3000/" to view and use the app.   
