# Progress Report

## Updated User Stories

1) As a user I want to add items I’ve purchased, their corresponding costs, and the frequencies at which I purchase them
2) As a user I want to join and leave billing groups
3) As a user, I want to be able to accept or decline items added to a group I am a member of
4) As a user I want to see a bill at a specified time interval that covers all item costs I owe to other users in the group
5) As a user I want to be notified about and notify others of bills that are owed in my group(s)
6) As a user I want to view my billing metrics, including amount owed, payment history and average spent per month
7) As a user who is a member of a group, I want to view that group's billing metrics such as the spending of all members, who’s spending the most and the average spent per month by the group

## Change log
Listed below are critical design or implementation decisions made after the creation of the initial design document.

### Dropped SCSS for styling for basic CSS
Given the low number of different layouts and pages used for BillSplit, and considering the fact that styling is not marked for the project, the effort required to implement SCSS for styling made it infeasible. As a result, we are doing all styling in css files, and currently all styling resides in the single style.css file.

### Frequency Attribute moved from Item model to Bill model
After creating the mockups for the app, we realized that it would be useful to allow users to reuse items for future purchases. Given that users may purchase items in differing amounts and at different intervals, we decided to add the purchase frequency into the Bill model as an attribute of each Item within the Bill itself. This will allow users to reuse items and input their own quantities and frequencies of purchase.

### Added TS-Jest and SuperTest
After starting to work on the code for our app, we quickly realized that we would need to add testing a framework. First TS-Jest was added as a means to both create and run tests. This worked great for the unit tests, which mostly focused on creating simple classes. TS-Jest was also used to get the code coverage. Once it came time for the integration tests, it became necessary to add in an additional framework. We chose SuperTest because it had plently of support and integrated well with our other tools. SuperTest was used in conjunction with TS-Jest to create integration tests, which test creation of classes, API requests and the database all together.

### More Methods Added to Controller
While working on the the app, we noticed that there needed to be more granular methods in the two of the controllers. To account for the change in the models, the bill controller needed a method to process purchase objects and relate them to the items in them. The items controller needed a way to get all items in a collection.
