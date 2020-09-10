## Git Workflow
### Creating a New Branch
1) Navigate to the issue you are working on in Gitlab.
2) Click the dropdown arrow next to the "create merge request" button and change the option to "create branch".
3) Name the branch ADCSS-< issue number>. For example, issue ADCSS-1 should also have its branch called ADCSS-1.
4) In Fork, right click on "origin" in the "Remotes" tab on the left side and click "fetch".
5) You should now see your newly created branch. Double click on it.
6) In the popup screen, click "Track" to create a new local branch of the remote issue branch you just created in GitLab. Your branch should now exist locally and be checked out, so you should see the branch under the "Branches" tab with a check mark beside it.
### Pushing to Branch
When you are ready to update your issue branch, follow these steps.
1) Navigate to "Changes" in Fork. You should see all the local changes you made to the branch since your last commit/initial pull.
2) After ensuring they are all expected changes, right click on them and click "stage".
3) Now that they are staged, enter commit subject. It should be structured as follows:
*< Branch name >: Issue name*, which is identical to the GitLab issue title. For instance, *ADCSS-1: Demo issue*
4) Enter a bullet form description of the changes you made.
5) Click on the dropdown arrow next to "Commit" and click on "Commit and Push".
6) Navigate to your issue branch in GitLab through the issues list or the issue itself. You should see the changes you just made.
### Merge Request
When it's time to request a review and merge into develop, follow these steps.
1) Ensure your GitLab branch is up to date with whatever changes you've made locally using the steps in the above section.
2) In your GitLab issue branch, click on "create merge request".
3) The merge request description should be auto-filled from your latest issue branch push. Ensure it is accurate and *fully encapsulates all* changes you've made.
4) Set the assignee to the lead tester for the team
5) Set the milestone to the current sprint
6) Change the label to "In review"
7) Ensure the target branch is set to develop.
8) Check the "Delete source branch when merge request is accepted" box.
9) Submit the merge request.
### Merge Conflict Resolution
1) Ensure the branch in conflict is checked out
2) Right click on the develop branch and click "Fast-Foward Pull develop"
3) Right click on the develop branch and click "Fast-Foward Pull < branch name >"
4) Right click on the develop branch and click "Merge into < branch name >"
5) Resolve the conflict. Details on conflict resolution can be found [here](https://www.atlassian.com/git/tutorials/using-branches/merge-conflicts)

There may be cases where it is simply easier to reset your branch to a certain point rather than resolve the conflict. To do so:
1) In the commit history in the center of the Fork screen, navigate to the previous commit you would like to reset to.
2) Right click on the commit and select "reset < branch name > to here"
3) Click on "Push" in the top toolbar
4) Select "force push" and push to the branch.

## Tools
### Fork
Fork is a git workflow tool that effectively visualizes the entire git process for development.
Before you start, make sure you've cloned the [GitLab Software repository](https://gitlab.com/ORCASat/ADCS/software) using your terminal and GitLab credentials into a easy to reference location on your computer.
1) Download [fork.dev](https://fork.dev)
2) Enter your *full name* for your username and your *GitLab account* email for the email. This should be your school email.
3) On the next screen, open the cloned software repository. Fork should automatically detect it if you cloned it, otherwise navigate to it.
4) In the repository manager, click on "software". You should be presented with a screen that shows the branches, remotes and other information on the left side, and a commit history in the center.
