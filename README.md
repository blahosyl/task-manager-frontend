<!-- Disable warnings about inline HTML -->
<!-- markdownlint-disable MD033 -->
<!-- Disable warnings about hard tabs -->
<!-- markdownlint-disable MD010 -->

# Task Manager

## UX/UI

The app is intended for smaller groups/teams to complete relatively simple, everyday tasks. Currently, all logged-in users can see and comment on all tasks, so it is suitable for implementing in a closed environment or for tasks that do not contain sensitive information.

Accordingly, I chose a less work-oriented project for the mockup content: a typical Berliner team of tech workers organizing a team event: a grill party on a boat.

Since the available development time for the current version of the app was only a little over 3 weeks, more fine-grained access control using projects has been relegated to [version 2](https://github.com/blahosyl/task-manager-frontend/issues?q=is%3Aissue+label%3A%22v2%22+).

### Strategy

Most popular productivity apps focus on corporate contexts, consist of a lot of complicated fields and charts, and focus less on the look and feel.
The goal of this project is to develop an app that is more suited to non-work tasks and emphasizes ease of use and a positive user response.

#### The polarity of project execution

The name of the app evokes the polarity of situations and emotions that occur during every project.
The positive end of the spectrum is when we's breezing through tasks, colloquially referred to as "You're on fire!"
At the other end, there's the feeling that everything else is on fire, and we're paralyzed by indecision as to which one to put out first – or we're desperately trying to convince ourselves that "this is fine!", as immortalized by the widely memeified [Gunshow webcomic](https://en.wikipedia.org/wiki/Gunshow_(webcomic)#%22This_is_fine%22).

Someone's emotional state and general well-being influences their productivity just as much as factors considered more objective, such as their skill level and time commitment.

#### Conservative design of productivity apps

Unfortunately, the polarity described above is seldom taken into account.
Supporting productivity is mostly thought of as just issue tracking.
Many productivity apps focus on function rather than design, and have a surprisingly uniform look, often in dark blue and gray.

#### Cumbersome filtering

Filtering relevant tasks often means having to go through complicated menus or dropdowns.

### Scope: holistic productivity

Assisting productivity is more than just tracking tasks. Users should feel content and energized, which supports sustainability and true productivity.

This is why the goal of the app is to fuse function with bold, accessible and upbeat design.

#### Bold colors carrying meaning

The color scheme of the app is reflected in the visual design of the cards containing individual tasks in a fuctional way: each priority status corresponds to a main color scheme from the [palette](#color-palette).

#### Playful indications of overdue tasks

Overdue tasks are indicated by 🔥 emojis (the more overdue the task is, the more 🔥 emojis appear). This conveys important project information while at the same time maintainly a levity to the situation.

#### Easy filtering at a click

The app comes with built-in filters for the most likely use cases. These are accessible at one click from multiple views without having to reload the page.

### Structure

#### Components

`TaskTabs` uses `ProfileList` and `TaskList` directly when the `taskList` prop is passed. `TaskList` uses `Task`.
Otherwise, `TaskTabs` uses `TaskKanban`, which uses `Task`

#### Access management structure

The project implemented signup, signin and signout functionalities by using Allauth in the [backend](https://github.com/blahosyl/task-manager-api/).

[CRUD](#crud-in-the-frontend) functionalities are only available to logged-in users.

- Pages available to Logged-out Users:
  - Landing (default)
  - Signin
  - Signup
  - Pages available to Logged-in Users:
    - Tasks
      - TaskKanban (default)
      - TaskList
      - TaskDetail (includes all Comment-related components)
      - TaskCreate
      - TaskEdit
      - TaskDelete (implemented with modal on TaskKanban/List/Detail)
    - Profiles/Users
      - ProfileList/Teammates
      - ProfileDetail
      - ProfileEdit
      - Username Edit
      - Password Edit

#### CRUD in the FrontEnd

The assessment criteria for the MVP require at least TWO forms, with validation, that allow users to create and edit resources in the Back-End API".

The present version of the app contains 3 such forms: Comment, Task and User.
A profile instance is created automatically for each new user.

The 5th model, Watcher, offers the same functionality not via a form, but by clicking the eye icon on a task.

> [!NOTE]
> Since a Watcher instance only contains two ForeignKey fields, editing and deletion are effectively the same, since changing either the watcher or the watched task will amount to a different Watcher instance

3 of the API models have full CRUD in the UI: Comment, Task & Watcher.

Deletion of Profile and User instances is possible in the API, but not in the front end. This has UX reasons, as explained in the section [UX improvements](#ux-improvements).

Users can only access CRUD on their own resources, not on those of other users.

|Model |Create |Read | Update | Delete |
|--- |:---:|:---:|:---:|:---:|
|Comment |`CommentCreateForm`|`TaskDetail` > `Comment`|`CommentEditForm`|`TaskDetail` > `Comment`|
|Profile |created automatically with User|`ProfileDetail` > `Profile`|`ProfileEditForm`|N/A|
|Task |`TaskCreateForm` > `TaskForm`|`TaskDetail` > `Task`|`TaskEditForm` > `TaskForm`|`Task`|
|User |`SignInForm`|`ProfileDetail` > `Profile`|`UsernameForm` & `UserPasswordForm`|N/A|
|Watcher |`TaskList` & `TaskDetail` & `ProfileDetail` > `Task`|`TaskList` & `TaskDetail` & `ProfileDetail` > `Task`|`TaskList` & `TaskDetail` & `ProfileDetail` > `Task`|`TaskList` & `TaskDetail` & `ProfileDetail` > `Task`|

#### UI information design

importance: left to right & top to bottom

intuitive navigation

balance between putting as many links on a page as possible and not overcrowding the page: anitcipating user needs regarding what they are most likely to do next from any given page

##### Navigation bar design

##### Footer design

### Skeleton

According to the mobile-first principle of design, I only made wireframes for mobile views before the start of development.

As suggested by my mentor, I have made wireframes for the following pages:

#### Landing page wireframe

![Landing page wireframe](/documentation-assets/readme-assets/wireframes/start-wireframe.png)

#### Task Kanban wireframe

This wireframe also features an expaneded navigation menu.

To improve on UX, [filtering](#filtering-with-tabs) was later implemented using tabs rather than a dropdown selector.

![Task Kanban page wireframe](/documentation-assets/readme-assets/wireframes/tasks-kanban-wireframe.png)

#### Task create/edit wireframe

A number of elements on this wireframe were implemented using other UI elements than shown below.
To make the UI more uniform, the fields of create/edit forms of the app ended up either being text fields or dropdowns (with the exception of the date and upload fields).

![Task Kanban page wireframe](/documentation-assets/readme-assets/wireframes/create-edit-task-wireframe.png)

### Surface

#### Visual design

##### Color palette

##### Logo

#### Images

Elements on background images are positioned with intention, matching the image itself: Signin, Signup, Landing.

#### Emojis & gifs

##### Typography

#### UX Improvements

put timeout on redirect, so pages don't keep flickering

feedback: toastify messages

conditional rendering

use of color for visual effect as well as conveying information

not found page: interesting graphic instead of just a plain message

##### Conditionally rendered names

To facilitate legibility, user's names are rendered conditionally depending on whether a `firstname` and `lastname` is filled in in their profile (the `username` is always present).

1. show first and last name if both are available
2. show first or last name if either are available
3. show username if neither are available

In some cases, 1. is shortened to only show the first name even if a last name is available.

##### Tasks without an image

The Moments project that this app is based on requires an image to be added to every task created.
This makes sense for the use case of the Moments app, being a photo sharing platform.

For the current task manager app, however, images play a much less important role than other types of content, also reflected in the layout of the [Task Detail page](#task-detail-page).Thus, it would be unpractical to force users to add a photo to every task they create, so this is made optional.

I also decided not to use a placeholder image for tasks that do not have an image attached,
as this would create an unnecessary distraction without adding information or a positive UX experience.
instead, the `CardImage` is displayed conditionally only if there is an image.

##### No empty task card for deleted tasks

When manually entering URL of a deleted task into the browser address bar, an empty task card was shown.

![Empty task card shown for deleted tasks](/documentation-assets/readme-assets/empty-task-card.png)

While this is also present in the Moments sample project, it is not good UX, which is why I decided to [change it](https://github.com/blahosyl/task-manager-frontend/issues/129) for the present app.

One of my attempts at a solution was to put all of the rendering in TaskDetail into a conditional clause checking if `task` exists, otherwise render the NotFound page. This failed to work. Similarly, checking for `task.id` failed.

I theorized that this is because these 2 variables are defined in the component, and must exist so that the app knows which task the user wants to see. However, `task.title` is empty if the task has been deleted, and it must not be empty for any existing tasks, since it's a compulsory field. Setting this as the condition for rendering the TaskDetail page received the desired result for the deleted pages.

However, this change also caused TaskDetail pages for **existing tasks** to show a "Not Found" page (I suspect because the rendering conditional kicked in before the data were received from the API).

Instead, I used the `setLoaded` logic from `TaskList` and implemented in in `TaskDetail` as well.

##### Explicit confirmation after user CRUD actions

I added confirmation notifications after a user successfully completes a CRUD operation, or presses the Cancel button on a CRUD form ([#29](https://github.com/blahosyl/task-manager-frontend/issues/29)). At the suggestion of my mentor, I used the `toastify` package, as it comes with push-style notifications out of the box.

##### No deletion of Users or Profiles

##### Modal confirming task deletion

##### Tooltip for watch/unwatch icon

Deleting a task can have dire consequences, so I added a modal to confirm that this is what the user really intended.

Comments are not considered as important or time-consuming to create as tasks, so here I opted for convenience over caution, and let users delete comments without double-checking.

## Project Management | Agile Methodologies

### Themes, Epics, Stories & Tasks

The work to be done was divided into the following Themes:

- Access management
- CRUD
- View content
- Site elements
- UX improvements
- Setup & deployment

Each theme was then divided into Epics, and Epics into User Stories, as seen here (click [here](https://docs.google.com/spreadsheets/d/1qZQIKNKa_nGfCR9YQQ1UFkeIGvXR_ikOx7Oev0sEVBA/edit?usp=sharing) for the original Sheet):

![Themes, Epics & User Stories](/documentation-assets/user-stories/pp5-user-stories-initial.png)

Each epic was assigned a distinctive color, which was also used for its [label in GitHub Issues](#labels).
Epics belonging to the same Theme were assigned colors of similar hues.
This facilitated getting an overview of the work items.

Finally, User Stories were broken down into tasks. These can be seen for each User Story individually in [GitHub Issues](https://github.com/blahosyl/task-manager-frontend/issues) and on the [Project Board](#project-board).

Each user story has a list of acceptance criteria, which are the expected outcomes when the story is tested. An issue is only closed if manual testing confirms that the acceptance criteria are fulfilled.  

The commits corresponding to each User Story are linked in each the GitHuB Issue.

As this was my first project using React, some User Stories have a very detailed task list, both as learning and as documentation/reference.
Issues that have tasks that were already familiar only have high-level bullet points.

At the suggestion of my mentor, I have added several user stories to improve User Experience to the initial list:

- [UX Access Management](https://github.com/blahosyl/task-manager-frontend/issues?q=label%3A%22e%3A+ux+access+management%22)
- [UX Comments](https://github.com/blahosyl/task-manager-frontend/issues?q=label%3A%22e%3A+ux+comments%22)
- [UX General](https://github.com/blahosyl/task-manager-frontend/issues?q=label%3A%22e%3A+ux+general%22)
- [UX Profiles](https://github.com/blahosyl/task-manager-frontend/issues?q=label%3A%22e%3A+ux+profiles%22)
- [UX Tasks](https://github.com/blahosyl/task-manager-frontend/issues?q=label%3A%22e%3A+ux+tasks%22)

Some work items that have initially been classified as Epics have later been reclassified as User Stories – typically these were "meta" items to do with testing and documentation.

### Estimation

Estimating the time it would take to complete each User Story is notoriously difficult, doubly so with the first project  in a new framework.
This is why I did not assign sizes to the individual User Stories, instead, I treated them as one unit.

This proved to be the right strategy in retrospect, as inexperience caused me to take disproportionately long on tasks that would be much faster the second time around. On the other side, some other tasks could be completed much faster than estimated. All in all, the lack of relative sizing of individual User Stories did not have an adverse effect on the project.

### Project Board

The Issues were added to the [Project Board](https://github.com/users/blahosyl/projects/6/views/1) in GitHub Projects.

I have customized the Kanban columns to fit the project needs, and also added swimlanes representing milestones.

The project contains issues from both the FrontEnd and the API repository.

![Project Board](/documentation-assets/readme-assets/pp5-project-board.png)

### Labels

I have used several categories of labels during the project:

- Priority labels (those starting with `p:`)
- An `epic` label to enable filtering between Epics and User Stories on the Project Board
- A label for each epic (those starting with `e:`), to be assigned to the Epic and all its corresponding User Stories(since GitHub Issues does not provide any other way to link these).
The individual epic labels are color-coded to match the [Google Sheet containing User Stories](https://docs.google.com/spreadsheets/d/1qZQIKNKa_nGfCR9YQQ1UFkeIGvXR_ikOx7Oev0sEVBA/edit?usp=sharing)
- Other miscellaneous labels such as `bug`, `enhancement`, `mentor`, etc.

These have provided an excellent way to both filter Issues and to maintain an easier visual overview of them.

#### Prioritization: MoSCoW

As the available time for development was only 2.5 weeks (setting the last few days aside for testing and documentation), sorting User Stories into `must have`, `should have`, `could have` and `won't have` was done on the whole group of User Stories rather than on a sprint-by-sprint basis.

I have modified the MoSCoW method slightly in that I split the `won't have` label into two:

- [Issues with the label `wont have`](https://github.com/blahosyl/task-manager-frontend/issues?q=is%3Aissue+label%3A%22wont+have%22) are used for issues that will not get done in a give sprint as well as for duplicates or mistaken issues (the latter were closed when identified as such)
- Issues not completed for the first release of the project but still to be done in further development work are assigned the label [`v2`](https://github.com/blahosyl/task-manager-frontend/issues?q=is%3Aissue+label%3A%22v2%22+).

The links below show the User Stories excluding "meta" issues such as testing & documentation.

- [User Stories with priority `must have`](https://github.com/blahosyl/task-manager-frontend/issues?q=is%3Aissue+label%3A%22p%3A+must+have%22+-label%3A%22e%3A+setup+%26+deployment%22+-label%3Aepic+-label%3A%22fe+documentation%22+-label%3A%22e%3A+testing%22+-label%3A%22e%3A+code+quality%22+-label%3Abug+is%3Aopen+): 17
- [User Stories with priority `should have`](https://github.com/blahosyl/task-manager-frontend/issues?q=is%3Aissue+label%3A%22p%3A+should+have%22+-label%3A%22e%3A+setup+%26+deployment%22+-label%3Aepic+-label%3A%22fe+documentation%22+-label%3A%22e%3A+testing%22+-label%3A%22e%3A+code+quality%22+-label%3Abug+is%3Aopen): 32
- [User Stories with priority `could have`](https://github.com/blahosyl/task-manager-frontend/issues?q=is%3Aissue+label%3A%22p%3A+could+have%22+-label%3A%22e%3A+setup+%26+deployment%22+-label%3Aepic+-label%3A%22fe+documentation%22+-label%3A%22e%3A+testing%22+-label%3A%22e%3A+code+quality%22+-label%3Abug+is%3Aopen+): 22

The statistics on total issues & User Stories excluding "meta" issues can be seen on the **Statistics** tab of the [User Stories Google Sheet](https://docs.google.com/spreadsheets/d/1qZQIKNKa_nGfCR9YQQ1UFkeIGvXR_ikOx7Oev0sEVBA/edit?usp=sharing).

Epics that had User Stories of various levels of prioritization received all applicable labels. As the User Stories in the Epic were completed, the labels of completed User Stories were removed from the Epic.

#### Timeboxing

The available development time for the project was 3 weeks and 3 days. Accordingly, work items were divided into 4 milestones:

1. [API, auth, start page & task list](https://github.com/blahosyl/task-manager-frontend/milestone/1)
2. [CRUD & basic views](https://github.com/blahosyl/task-manager-frontend/milestone/2)
3. [UX & styling](https://github.com/blahosyl/task-manager-frontend/milestone/3)
4. [Testing & documentation](https://github.com/blahosyl/task-manager-frontend/milestone/4)

The first 3 milestones were assigned the User Stories discussed so far, while the last milestone was planned for "meta" tasks like testing and documentation.

Each milestone was assigned to a sprint around 5 days in length.

However, as tends to happen in real life, different sprints had different velocities, which is reflected in the uneven number of User Stories completed in each sprint.

#### Sprint planning

At the beginning of every sprint, I reviewed the Issues assigned to the current milestone and decided the order in which they are to be implemented, in a more fine-grained way than the existing prioritization labels.

I also defined tasks for the highest priority items, with tasks definitions for lower-priority items following as soon as it became plausible that I can finish them that sprint.

Whenever I have received updated information about prioritization or implementation from my mentor or the Code Institute community, I would also make appropriate changes in prioritization during sprints.

#### Sprint retroactives

At the end of every sprint, I reviewed the items that were not completed, and either reassigned them to the next sprint, or to [version 2 of the project](https://github.com/blahosyl/task-manager-frontend/issues?q=is%3Aissue+label%3Av2).

## Features

### Navigation bar

- Kaban & List
- Moved + with other Logged-In links
- only expand NavBar on large screens and above
- show short name in navbar

On medium and smaller screen sizes, the Navbar includes an extra link to the [profile list page](#profile-list).

### Teammates component

This appears on mid and larger viewports, and shows the list of teammates in descending order.

Users' names are shown conditionally: the first and/or last name is show if it is available,
otherwise, the username is displayed.

Clicking on a profile avatar or name leads to the relevant [profile detail page](#profile-detail-page).
Clicking on the heading **Teammates** leads to the [profile list page](#profile-list).

On small screen sizes, the [Navbar](#navigation-bar) includes an extra link to the [profile list page](#profile-list).

### Footer

#### Home page

### Create task page

#### Assignee dropdown

Fetches the list of profiles from the API, and displays them as options in the dropdown.

It displays the first and/or last name of the user if these are filled in. Otherwise, it displays the username.

The Profile ID is sent to the API. Since a profile is automatically created whenever a user is created, profile ID and user ID should be the same.

#### Task list page

The task list features a more compact version of the task cards, with only the following information shown:

- assignee
- priority
- status
- title
- excerpt
- due date
- watch/unwatch icon

The card body can be clicked to go to the [Task Detail](#task-detail-page) page.
This link is not stretched to the whole card, because the card header contains a link to the [assigned user's profile](#profile-detail-page),
and the bottom part of the card contains the [watch/unwatch icon](#watchunwatch-function).

The Color scheme of the card changes based on the priority of the task:

- low
- med
- high
- no priority

##### Filtering with tabs

Filtering is implemented with a tabbed structure on the [Task list](#task-list-page), [Kanban](#kanban-board) and [Profile Detail](#profile-detail-page) pages.

On the [Task list](#task-list-page) and [Kanban](#kanban-board), 4 columns are shown:

- tasks assigned to the logged-in user
- tasks watched by the logged-in user
- tasks created (owned) by the logged-in user
- all tasks

On the [Profile](#profile-detail-page) page, the list shown depends on the user whose Profile page is viewed:

- tasks assigned to the viewed user
- tasks watched by the viewed user
- tasks created (owned) by the viewed user

Each filtered column also shows how many tasks are in each one. Whenever a task is changed in one column (re-assigned, watched/unwatched or deleted), the change is reflected in all columns without having to reload the page.

##### Searching tasks

A search bar appears on the [Task list](#task-list-page), [Kanban](#kanban-board) and [Profile Detail](#profile-detail-page) pages. It returns tasks specific to the viewed [tab](#filtering-with-tabs) as the user types, without having to press a button.

Fields searched are:

- title
- excerpt
- description
- assignee
- owner

#### Kanban board

I also implemented a task Kanban board, where tasks are automatically sorted based on their status.
Inspired by GitHub Projects and Trello, I implemented horizontal scrolling for this view.

This page has the information and layout that a user is likely to want to see, which is why it is the starting page for logged-in users.

Since the size of the task cards in this view is the smallest of all, the content of the Task cards shown on this view is the most minimal/compact. This is governed by the conditional rendering logic in `Task.js`

The conditional color scheme and stretched link functionalities work just like on the [Task List page](#task-list-page).

#### Task detail page

The card header contains an avatar with a link to the [assigned user's profile](#profile-detail-page),
the due date / watch box contains the [watch/unwatch icon](#watchunwatch-function),
and the bottom part of the card displays the avatar of the tasks's owner (creator) with a link to their [profile](#profile-detail-page).

XXXX Which fields are shown with placeholders, which fields aren't

The Color scheme of the card changes based on the priority of the task:

- low
- med
- high
- no priority

#### Task Create Form

#### Task Edit Form

Only the owner (the user who created the task) can edit or delete it. The reasoning behind this is that they know the requirements, so they can judge whether a task can be completed or not.

In a future version, I plan to add some edit permissions to task assignees as well ([#98](https://github.com/blahosyl/task-manager-frontend/issues/98)).

#### Watch/unwatch function

Users can choose if they want to watch tasks created by them, as this might be required for some tasks but not others.

The watch button is an eye icon and a toolip instruction is show when hovering over it. This changes dynamically depending on whether the logged-in user is already watching the task or not.

#### Profile list

This is shown in the sidebar of certain Task views, and as a full-page version under `/team`. The sidebar version only shows the avatar & [conditionally rendered name](#conditionally-rendered-names) of the user.
The full profile list also shows the pronouns and role if these are filled in.

#### Profile detail page

This page shows a user's profile information and [tasks assigned to them](#task-list-page).

For logged-in users, this shows all profile fields including empty ones.
In addition, the conditionally rendered user name has the suffix "(me)"
to indicate the user is viewing their own profile.

For all other users, only filled-in fields and the [conditionally rendered name](#conditionally-rendered-names) is shown.

### Access management

### Admin Panel

### Future features

### Code features

custom hooks

conditional rendering

additional libraries

#### Regular testing

#### Adequate commenting

#### DRY

#### Security

`npm audit fix` was run after every time a new package was installed. It is beyond the scope of the correct project to fix all dependency warnings, as these are typically handled by more senior developers or dedicated security engineers.

All passwords are stored in a password manager, and not written down in plain text electronically or on physical paper.

Unfortunately, the infrastructure for project submission at Code Institute requires the admin credentials to be submitted in plain text.

#### GitHub branches

## Testing

See the document [`TESTING.md`](TESTING.md) for details.

## Technologies used

### Languages used

### Other dependencies used

- [`dayjs`](https://day.js.org/): format & compare dates
- [`toastify`](https://fkhadra.github.io/react-toastify/): CRUD notification messages

### Tools used

- [diffchecker.com](https://www.diffchecker.com/): compare code
- [ES7+ React/Reduc/React-Native snippets extension for VS Code](https://marketplace.visualstudio.com/items?itemName=dsznajder.es7-react-js-snippets): quickly insert code snippets
- [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint): JSX validation
- [Jigsaw](https://jigsaw.w3.org/css-validator/validator): CSS validator
- [markdownlint extension for VS Code](https://marketplace.visualstudio.com/items?itemName=DavidAnson.vscode-markdownlint): Markdown linting & style checking
- [`png` color changer](https://onlinepngtools.com/change-png-color)
- [Prettier extension for VS Code](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode): code formatter
- [REacTree](https://marketplace.visualstudio.com/): make a React component tree
- [SP studio](https://sp-studio.de/): create mock-up user pictures
- [Typos spell checker for VS Code](https://open-vsx.org/extension/tekumara/typos-vscode)
- [W3C HTML validator](https://validator.w3.org/)

## Deployment

### Prerequisites

### Fork the repository

### Deploy in the development environment

### Deploy to production

#### Pre#deployment steps

#### Steps on Heroku

## Credits

### Code credits

This project was developed on the basis of the [Moments](https://github.com/Code-Institute-Solutions/moments0) walkthrough project by [Code Institute](https://github.com/Code-Institute-Solutions/).

Many features and the overall feel was inspired by [Trello](https://support.atlassian.com/trello/).

I have also consulted the project [Tick It](https://github.com/Code-Institute-Submissions/ci_pp5_tick_it_react) by [Jamie King](https://github.com/jkingportfolio) and implemented the [Task deletion confirmation modal](https://github.com/blahosyl/task-manager-frontend/issues/17) based on it.

Spencer Barriball kindly provided a [suggestion](https://code-institute-room.slack.com/archives/C02MTH5MBDG/p1723141476108919?thread_ts=1723121474.717569&cid=C02MTH5MBDG) to get rid of the [non-breaking warning](https://github.com/blahosyl/task-manager-frontend/issues/83) in the Profile Edit Form, which is also present in the [Moments](https://github.com/Code-Institute-Solutions/moments0) walkthrough project by [Code Institute](https://github.com/Code-Institute-Solutions/).

Tutor John Rearden was kind enough to keep working on [making infinite scroll work for Profiles](https://github.com/blahosyl/task-manager-frontend/issues/66), which we could not solve in the tutoring session, and came up with a [solution](https://github.com/johnrearden/task-manager-frontend/commit/ec8e98e9cdbad1159501fc5b92dc2f23cb7975a4#diff-0c6bbc781d2ac66b877546123b753fb2f69957838aea8419d7c2bc46740d6aea): using a custom API call instead of using `fetchMoreData().`

### Related advice

Following a [suggestion](https://code-institute-room.slack.com/archives/C02MTH5MBDG/p1723026165340779?thread_ts=1722951810.045149&cid=C02MTH5MBDG) by [Kelly Hutchison](https://github.com/quiltingcode), I added Frontend validation by adding the `required` prop to the form fields in the SignInForm ([Issue](https://github.com/blahosyl/task-manager-frontend/issues/20)). I then extended this to required fields in all forms in the project [#96](https://github.com/blahosyl/task-manager-frontend/issues/96).

### Study/lookup sources

- [React Bootstrap documentation](https://react-bootstrap-v4.netlify.app/)
- [Rect Bootstrap Form props](https://react-bootstrap-v4.netlify.app/components/forms/#form-group-props)
- [React Bootstrap date form input field](https://stackoverflow.com/a/66271815)
- [`exact` & `strict` props](https://stackoverflow.com/a/52275337s)
- [ternary conditional](https://www.w3schools.com/react/react_es6_ternary.asp)
- [swimlanes in GitHub Projects](https://github.blog/changelog/2023-07-27-github-issues-projects-july-27th-update/#%F0%9F%8F%8A-board-swimlanes)
- [use template literals for multiple `className` props](https://stackoverflow.com/a/39053038)
- [CSS `border` shorthand](https://www.w3schools.com/css/css_border_shorthand.asp)
- [CSS `border-radius` shorthand](https://www.w3schools.com/cssref/css3_pr_border-radius.php)
- [Warning/Caution in Markdown](https://gist.githubusercontent.com/cseeman/8f3bfaec084c5c4259626ddd9e516c61/raw/9e223c88ea8e445098a9c54d9df8a48e1c2c7151/markdown_examples.md)
- [`dayjs` documentation](https://day.js.org/docs/en/display/format)
- [horizontal scrolling](https://codeburst.io/how-to-create-horizontal-scrolling-containers-d8069651e9c6)
- [Bootstrap `small`: faded text with smaller size](https://getbootstrap.com/docs/4.6/content/typography/)
- [fix InfiniteScroll not triggering – didn't work](https://stackoverflow.com/a/59689953)
- [fix InfiniteScroll not triggering – worked](https://stackoverflow.com/a/74509225)
- [alternative fix to InfiniteScroll not triggering – worked](https://stackoverflow.com/a/76741176)
- [Bootstrap tabs](https://react-bootstrap-v4.netlify.app/components/tabs/)
- [`flex` properties](https://developer.mozilla.org/en-US/docs/Web/CSS/flex)
- [conditional tags in React JSX](https://stackoverflow.com/a/33471928)
- [prop drilling](https://stackoverflow.com/questions/67734236/understanding-how-we-can-avoid-passing-props-through-many-levels-of-component-hi)
- [`dayjs` `now`](https://day.js.org/docs/en/parse/now)
- [comparing dates](https://www.freecodecamp.org/news/javascript-date-time-dayjs/#howtocomparedatesindayjs)
- [Unicode for fire emoji](https://www.webfx.com/tools/emoji-cheat-sheet/)
- [Error: React Hook "useEffect" cannot be called inside a callback](https://stackoverflow.com/a/71900086)
- [Bootstrap vertical alignment](https://getbootstrap.com/docs/4.6/utilities/vertical-align/)
- [always push footer to the bottom](https://stackoverflow.com/a/66565163)
- [`timeout` documentation](https://developer.mozilla.org/en-US/docs/Web/API/setTimeout)
- [`react-select` documentation](https://react-select.com/) (not used)
- [`react-select-async-paginate` documentation](https://www.npmjs.com/package/react-select-async-paginate) (not used)
- [`react-toastify` documentation](https://fkhadra.github.io/react-toastify/)
- [Emojipedia](https://emojipedia.org/)
- [customizing `Markdownlint`](https://github.com/DavidAnson/vscode-markdownlint#configure)

### Text

All text was written by me.

### Media

#### Image credits

- [orange-swirl](https://unsplash.com/photos/an-abstract-red-and-orange-background-with-curves-K-DwbsTXliY) by [LiZhang](https://unsplash.com/@sunx) ([Unspash](https://unsplash.com/))
- [silhouette](https://unsplash.com/photos/silhouette-photography-of-woman-0-eT-ApZmUw) by [Tem Rysh](https://unsplash.com/@tem_rysh) ([Unspash](https://unsplash.com/))
- [door](https://unsplash.com/photos/orange-room-with-open-door-DIewyzpUbRc) by [Natalia Y.](https://unsplash.com/@foxfox) ([Unspash](https://unsplash.com/))
- [logo](/src/assets/logo.jpg) & [favicon](public/favicon-16x16.png) created by me, changed colors with [onlinepngtools.com](https://onlinepngtools.com/change-png-color), converted to favicon with [favicon.io/](https://favicon.io/favicon-converter/)
- [lightbulb](https://unsplash.com/photos/lighted-orange-cfl-bylb-HfVfXJjktWw) by [Izumi](https://unsplash.com/@itsaizumi) ([Unspash](https://unsplash.com/))
- [no-results](/src/assets/no-results.png) & [upload](/src/assets/upload.png) taken from the Moments walkthrough project, colors changed with [onlinepngtools.com](https://onlinepngtools.com/change-png-color)
- ["this is fine" gif](/src/assets/this-is-fine.gif) from [customemoji.com](https://www.customemoji.com/custom-emoji/this-is-fine-fire)
- the mockup user images were created by myself and Peter Litauszki with [SP Studio](https://sp-studio.de/)

### Readmes

- [Creating your first README with Kera Cudmore](https://www.youtube.com/watch?v=XbYJ4VlhSnY) by Code Institute
- [Creating your first README](https://github.com/kera-cudmore/readme-examples) by Kera Cudmore
- [Bully Book Club](https://github.com/kera-cudmore/Bully-Book-Club) by Kera Cudmore
- [Bodelschwingher Hof](https://github.com/4n4ru/CI_MS1_BodelschwingherHof/tree/master) by Ana Runje
- [Travel World](https://github.com/PedroCristo/portfolio_project_1/) by Pedro Cristo
- [Sourdough Bakes](https://github.com/siobhanlgorman) by Siobhan Gorman
- [Horizon Photo](https://github.com/Ri-Dearg/horizon-photo/blob/master/README.md#mobile-testing) by Rory Patrick Sheridan
- [BackeStock](https://github.com/amylour/BakeStock/) by [Amy Richardson](https://github.com/amylour)
- [American Pizza Order System](https://github.com/useriasminnaamerican_pizza_order_system/) by [Iasmina Pal](https://github.com/useriasminna)
- [Neverlost](https://github.com/Ri-Dearg/neverlost-thrift) by [Rory Patrick Sheridan](https://github.com/Ri-Dearg)
- [EastStr](https://github.com/ndsurgenor/east-street) by Nathan Surgenor
- [League Hub](https://github.com/MikeR94/CI-Project-Portfolio-5) by [MikeE94](https://github.com/MikeR94)
- [Tick it](https://github.com/jkingportfolio/ci_pp5_tick_it_react) by [Jamie King](https://github.com/jkingportfolio)
- [The README of my first Code Institute project](https://github.com/blahosyl/academic-publishing)
- [The README of my second Code Institute project](https://github.com/blahosyl/operator-game)
- [The README of my third Code Institute project](https://github.com/blahosyl/dinner-party)
- [The README of my fourth Code Institute project](https://github.com/blahosyl/spicy)

### Acknowledgements

I would like to express my gratitude to my mentor, [Marcel Mulders](https://www.123helpmestudy.com/) for his incredibly useful and understanding support throughout the project.
Issues raised by him or discussed with him can be found [here](https://github.com/blahosyl/task-manager-frontend/issues?q=is%3Aissue+label%3Amentor) (see the individual ticket descriptions for the details of his contribution).

I am also grateful to the Code Institute tutoring team, in particular, to John, Oisin, Rebecca, Roman, Roo and Thomas for their help. The details of their contributions can be found [here](https://github.com/blahosyl/task-manager-frontend/issues?q=label%3Atutoring).

I would also like to thank Peter Litauszki for photo and video editing help.
