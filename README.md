<!-- Disable warnings about inline HTML -->
<!-- markdownlint-disable MD033 -->
<!-- Disable warnings about hard tabs -->
<!-- markdownlint-disable MD010 -->
<!-- Disable warnings about language specifictaion infenced code blocks -->
<!-- markdownlint-disable MD040 -->

# On Fire 🔥 - the cheerful productivity app

This app lets users track tasks in a simple, visually pleasing and functionally colored app. It features multiple filtering options at a click, and an intuitive UI without overwhelming settings & lists.

![App showcase](/documentation-assets/readme-assets/amiresponsive/showcase.png)

Developer: [Dr. Sylvia Blaho](https://www.linkedin.com/in/blahosylvia/)

- [Deployed app](https://pp5-task-manager-frontend-eebb66e2c99d.herokuapp.com/)
- [Deployed API](https://pp5-task-manager-api-380974d293dd.herokuapp.com/)
- [API GitHub repository](https://github.com/blahosyl/task-manager-api)

See the development progress and further plans on the [Project Kanban board](https://github.com/users/blahosyl/projects/6).

<!-- Shield.io badges -->
![GitHub last commit](https://img.shields.io/github/last-commit/blahosyl/task-manager-frontend?color=red)
![GitHub contributors](https://img.shields.io/github/contributors/blahosyl/task-manager-frontend?color=orange)
![GitHub language count](https://img.shields.io/github/languages/count/blahosyl/task-manager-frontend?color=black)

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

The component tree of the app is depicted below (generated with [ReacTree](https://marketplace.visualstudio.com/)).

It illustrates the extensive reuse of not only small components like `Avatar` or `Asset`, but also larger components like `TaskList`, `ProfileList` and `Task`.

This is discussed in more details in the section [DRY](#dry).

![Start of component tree](/documentation-assets/readme-assets/component-tree/vertical/1-start-vertical-component-tree.png)

![2nd part of component tree](/documentation-assets/readme-assets/component-tree/vertical/2-task-create-vertical-component-tree.png)

![3rd part of component tree](/documentation-assets/readme-assets/component-tree/vertical/3-task-detail-vertical-component-tree.png)

![4th part of component tree](/documentation-assets/readme-assets/component-tree/vertical/4-task-profile-vertical-component-tree.png)

![5th part of component tree](/documentation-assets/readme-assets/component-tree/vertical/5-end-vertical-component-tree.png)

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

Keeping with established principles, I structured information from top to bottom & left to right.

My goal was to strike a balance between putting as many links on a page as possible and not overcrowding the page: anitcipating user needs regarding what they are most likely to do next from any given page.

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

A balance between harmony and contrast: terracotta and marron with a warm shade of teal.

##### Logo

#### Images

Elements on background images are positioned with intention, matching the image itself: Signin, Signup, Landing, Not Found.

Only pages with relatively little content have background images, as these would be too distracting on pages with multiple tasks, filters or profiles.

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

This section briefly introduces the features implemented in the current version of the project. For videos demonstrating how each feature works, see the [Manual feature testing section](TESTING.md#manual-feature-testing) of `TESTING.md`.

### Landing page

This page greets visitors who are not logged in. It has a striking and energetic background image, a short description of the app, and links to the [Signin](#signin-page) & [Signup](#signup-page) pages.

![Landing page](/documentation-assets/readme-assets/amiresponsive/landing-amiresponsive.png)

### Signup page

The signup page contains the Signup Form and a link to the [Signin page](#signin-page). The all field of the signup form are validated.

The design features a salient custom image, and the position of text elements is responsively adapted to complement the image.

![Singup page](/documentation-assets/readme-assets/amiresponsive/signup-amiresponsive.png)

### Signin page

The signin page contains the Signin Form and a link to the [Signup page](#signup-page). The all field of the signup form are validated.

The design features another custom image, and the position of text elements is purposely showcasing the image.

![Singin page](/documentation-assets/readme-assets/amiresponsive/signin-amiresponsive.png)

### Navigation bar

The Navbar is present on every page, and contains the links that are anticipated to be most frequently needed by users.

#### Navbar for visitors

The navbar for visitors features the logo and app name on the left, and the Signin and Signup icons on the right.

![Navbar on desktop for visitors](/documentation-assets/readme-assets/features/navbar-full-not-logged-in.png)

It is collapsed on small and medium viewports.

![Collapsed Navbar on mobile](/documentation-assets/readme-assets/features/navbar-collapsed-not-logged-in.png)

When clicking the hamburger icon, the Navbar expands.

![Expanded Navbar on mobile for visitors](/documentation-assets/readme-assets/features/navbar-expanded-not-logged-in.png)

#### Navbar for Logged-in Users

For this view, I have made considerable changes compared to the Moments project:

- instead of links tofiltered views, the Navbar only has links to the [Kaban](#kanban-board) & [List](#task-list-page) pages, since these have extensive filtering options included.
- I moved the + icon with the other Logged-In links
- the NavBar only expands on large screens and above, to avoid overcrowding
- only the user's [short name](#conditionally-rendered-names) is shown in the navbar

![Navbar on desktop for Logged-in Users](/documentation-assets/readme-assets/features/navbar-desktop-logged-in.png)

On medium and smaller screen sizes, the Navbar includes an extra link to the [Profile List page](#profile-list). This is not needed on larger viewports, as these have the Profile List shown in a sidebar on the main page of [Task List](#task-list-page) and [Profile Detail](#profile-detail-page), and a link to the Task List is included on the [Kanban page](#kanban-board).

![Expanded Navbar on mobile for Logged-in Users](/documentation-assets/readme-assets/features/navbar-expanded-logged-in.png)

I have changed the icon default, active and  hover colors to provide more contrast to the background for [accessibility](/TESTING.md/#color-contrast-testing) reasons.

![Navbar on desktop for Logged-in Users](/documentation-assets/readme-assets/features/navbar-icon-hover-color.png)

### Footer

The footer is also present on every page, but the information contained here is predicted to be used less frequently: the developer name and social media profile links.

![Footer](/documentation-assets/readme-assets/features/footer.png)

#### Task detail page

The card header contains an avatar with a link to the [assigned user's profile](#profile-detail-page),
the due date / watch box contains the [watch/unwatch icon](#watchunwatch-function),
and the bottom part of the card displays the avatar of the tasks's owner (creator) with a link to their [profile](#profile-detail-page).

Other fields are show when they are not empty.

The Color scheme of the card changes based on the priority of the task:

- low
- med
- high

![Task Detail page](/documentation-assets/readme-assets/amiresponsive/task-detail-amiresponsive.png)

Cards that are owned by (create by) the currently Logged-in User also have a **vertical dots** icon on the top right. Clicking this enables [editing](#task-edit-form) or [deleting](#task-deletion) a task.

#### Comments

The bottom of the Task Detail page shows the comments on the task (if any), as well as the comment create form.
Each comment shows the author's avatar and [conditionally rendered name](#conditionally-rendered-names).

Users can edit or delete their own comments using the **vertical dots** dropdown next to them.

![Comments](/documentation-assets/readme-assets/features/comment.png)

#### Task List page

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

The conditional color scheme works just like on the [Task Detail page](#task-detail-page).

![Task List page](/documentation-assets/readme-assets/amiresponsive/task-list-amiresponsive.png)

#### Kanban board

The main task view implemented in this app is a task Kanban board, where tasks are automatically sorted based on their status.
Inspired by GitHub Projects and Trello, I implemented horizontal scrolling for this view for small screens.

This page has the information and layout that a user is likely to want to see, which is why it is the starting page for logged-in users.

Since the size of the task cards in this view is the smallest of all, the content of the Task cards shown on this view is the most minimal/compact. This is governed by the conditional rendering logic in `Task.js`.

The conditional color scheme, watch/unwatch and stretched link functionalities work just like on the [Task List page](#task-list-page).

![Task Kanban board](/documentation-assets/readme-assets/amiresponsive/task-kanban-amiresponsive.png)

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

![Task search](/documentation-assets/readme-assets/amiresponsive/search-amiresponsive.png)

#### Watch/unwatch function

Users can choose if they want to watch tasks regardless of whether they are assigned to them or the tasks were created by them.

The watch button is an eye icon, and a toolip instruction is show when hovering over it. This changes dynamically depending on whether the logged-in user is already watching the task or not.

The count of users watching a task is shown next to the eye icon. This is also updated without having to reload the page.

This functionality is available everywhere where a task card is shown:

- [Kanban](#kanban-board) page
- [Task List](#task-list-page) page
- [Task Detail](#task-detail-page) page
- [Profile Detail](#profile-detail-page) page

### Teammates component

This appears on mid and larger viewports on the following pages:

- [Task List](#task-list-page) page
- [Task Detail](#task-detail-page) page
- [Profile Detail](#profile-detail-page) page

It shows the list of teammates in descending order of profile creation, with infinite scroll

Users' names are shown [conditionally](#conditionally-rendered-names): the first and/or last name is shows if it is available,
otherwise, the username is displayed.

Clicking on a profile avatar or name leads to the relevant [profile detail page](#profile-detail-page).

Clicking on the heading **Teammates** leads to the [profile list page](#profile-list).

On small screen sizes, the [Navbar](#navigation-bar) includes an extra link to the [profile list page](#profile-list).

#### Task Create Form

This is used for creating new tasks, and is available to all Logged-in Users.

Since the **title** field is compulsory on all tasks, the **create** button is disabled on the form when the page loads, with an information message under it.
As soon as the **title** field gets some content, the button is enabled and the message disappears.

This form contains the following types of fields:

- several text fields
- a date field
- an image upload field
- two dropdown selectors with fixed options
- and the [assignee dropdown](#assignee-dropdown) where options are dynamically fetched and [conditionally rendered](#conditionally-rendered-names).

The form is responsive, and the buttons are placed at the most convenient location on each screen size.

![Task Create Form](/documentation-assets/readme-assets/amiresponsive/task-create-amiresponsive.png)

#### Task Edit Form

The Task Edit Form has the same structure as the [Task Create Form](#task-create-form), which help user navigation and also makes use of the same component in the code.

The title of the page and the submit button text change conditionally depending on which form is rendered.

The Task Edit Form fetches the existing data from the API and pre-fills the fields with these.

Only the owner (the user who created the task) can edit or delete it. The reasoning behind this is that they know the requirements, so they can judge whether a task can be completed or not.

![Task Edit Form](/documentation-assets/readme-assets/amiresponsive/task-edit-amiresponsive.png)

In a future version, I plan to add some edit permissions to task assignees as well ([#98](https://github.com/blahosyl/task-manager-frontend/issues/98)).

#### Assignee dropdown

This is part of the [Task Create Form](#task-create-form) and the [Task Edit Form](#task-edit-form).

It fetches the list of all profiles from the API, and displays them [conditionally](#conditionally-rendered-names) as options in the dropdown:
it displays the first and/or last name of the user if these are filled in. Otherwise, it displays the username.

#### Task Deletion

Since tasks are the most important objects in this app, I have enhanced the deletion functionality of the Moments app with an extra confirmation step.
When clicking the **trashcan** icon on the Task Dropdown menu, a modal pops up confirming whether the user wants to delete the task. This helps avoid accidental errors.

![Task Deletion modal](/documentation-assets/readme-assets/features/task-deletion-modal.png)

#### Profile list

This is the full-page version  of the Teammates list under the  `/team` URL. The sidebar version only shows the avatar & [conditionally rendered name](#conditionally-rendered-names) of the user, whereas
the full-page profile list also shows the pronouns and role if these are filled in.

![Profile List](/documentation-assets/readme-assets/amiresponsive/profile-list-amiresponsive.png)

#### Profile Detail page

This page shows a user's profile information and [tasks assigned to them](#task-list-page).

For logged-in users, this shows all profile fields including empty ones.
In addition, the conditionally rendered user name has the suffix "(me)"
to indicate the user is viewing their own profile.

![Own Profile Detail page](/documentation-assets/readme-assets/amiresponsive/own-profile-detail-amiresponsive.png)

For all other users, only filled-in fields and the [conditionally rendered name](#conditionally-rendered-names) is shown.

![Profile Detail page](/documentation-assets/readme-assets/amiresponsive/profile-detail-amiresponsive.png)

For users viewing their own Profile Detail page, a pencil icon is shown. This opens the Profile/Username/Password edit dropown menu.

![Profile Edit dropdown](/documentation-assets/readme-assets/amiresponsive/profile-edit-dropdown-amiresponsive.png)

#### Profile Edit Form

This form lets users edit their own profile data. All fields are optional, so the **save** button is never disabled.

![Profile Edit Form](/documentation-assets/readme-assets/amiresponsive/profile-edit-amiresponsive.png)

#### Username Change Form

The Username Change Form is based on the Moments project, validated, with added [CRUD messages](#explicit-confirmation-after-user-crud-actions) confirming the change of username, or cancelling the change.

![Username Change Form](/documentation-assets/readme-assets/amiresponsive/username-change-amiresponsive.png)

#### Password Change Form

The Password Change Form is based on the Moments project,  validated, with added [CRUD messages](#explicit-confirmation-after-user-crud-actions) confirming the change of password, or cancelling the change.

![Password Change Form](/documentation-assets/readme-assets/amiresponsive/password-change-amiresponsive.png)

#### Not Found page

A broken link is always annoying at best, anxiety-inducing at most. This is why I styled the "Not Found" page to be interesting, aesthetically pleasing and in harmony with the rest of the app design, with an eye-catching background image and a link to the home page.

![Not Found Page](/documentation-assets/readme-assets/amiresponsive/not-found-amiresponsive.png)

### Future features

Since development time for this version of the project was only a bit more than 3 weeks, and this was my first project using React & Django, several desired features could not be implemented in this short time frame:

- drag & drop tasks on Kanban board
- ask for current password before changing login credentials
- tag other users in comments
- send notifications when due date is close or task status changes
- the other [features relegated to version 2]((https://github.com/blahosyl/task-manager-frontend/issues?q=is%3Aissue+label%3A%22v2%22+))

### Code features

#### Customization

Although this app started out based on the Moments project, it features extensive code customizationin the form of custom hooks, widely used conditional rendering and [additional libraries](#other-dependencies-used).

#### Regular testing

The code was continually tested and validated with ESLint throughout development.
At the end of the development process, a final, comprehensive round of testing and validating was completed.
The results are detailed in [TESTING.md](TESTING.md).

#### Adequate commenting

Apart from making sure that the app functions as intended, I have also taken special care to make sure the code is well organized and appropriately commented. Since I am just becoming familiar with React (and dealing with executive functioning issues), I have erred on the side of "more is more" for code comments and docstrings for methods that were new to me.

#### DRY

I have also done my best to adhere to the principle of Don't Repeat Yourself (DRY):

- I refactored the `TaskCreateForm` and `TaskEditForm` to use the same component, `TaskForm`, which fulfills both functions depending on the `taskEdit` prop.
- the `TaskList` component is used in both `TaskTabs` and `ProfileDetail`
- the `Task` component is used in both `TaskList`, `TaskKanban` and `TaskDetail`
- the `ProfileList` component is usedin `TaskKanban` (conditionally depending on the `taskList` prop), `TaskDetail` and `ProfileDetail`, as well as on its own under `/team`
- smaller components, such as `Avatar`, `Asset` or `NotFound` are used throughout the app.

The full component list can be viewed in the section [Components](#components).

I also completed a number of Issues just for [refactoring code](https://github.com/blahosyl/task-manager-frontend/issues?q=is%3Aissue+label%3Arefactoring+).

#### Security

`npm audit fix` was run after every time a new package was installed. It is beyond the scope of the correct project to fix all dependency warnings, as these are typically handled by more senior developers or dedicated security engineers.

There are no secret keys or URIs stored in this app (as opposed to the API).

All passwords are stored in a password manager, and not written down in plain text electronically or on physical paper.

Unfortunately, the infrastructure for project submission at Code Institute requires the admin credentials to be submitted in plain text.

#### GitHub branches

Since this is a one-person project, it would have been overly complicated to make use of feature branches for all user stories. Therefore, I conducted most development on the `main` branch.

However, for features or bug fixes that I judged to be especially risky for breaking existing functionality, I created separate [featrue branches](https://github.com/blahosyl/task-manager-frontend/branches).

Normally these would be deleted after they are merged or decided not to be merged. Since this project is submitted for assessment, feature branches are kept as a reference.

## Testing

See the document [`TESTING.md`](TESTING.md) for details.

## Technologies used

### Languages used

- [JSX](https://react.dev/learn/writing-markup-with-jsx) – write HTML with JavaScript
- [JavaScript](https://www.javascript.com/) – programming language for web development
- [HTML](https://en.wikipedia.org/wiki/HTML5) – markup language for structuring and presenting content
- [CSS](https://en.wikipedia.org/wiki/CSS) – web style sheet language

### Frameworks & Libraries used

- [React](https://react.dev/) – library for web and native user interfaces
- [Bootstrap](https://getbootstrap.com/docs/4.6/getting-started/introduction/) – front-end framework
- [FontAwesome](https://fontawesome.com/) – navigation icons
- [Kodchasan from Google Fonts](https://fonts.google.com/specimen/Kodchasan) – font used throughout the app

### Other dependencies used

- [`axios`](https://axios-http.com/docs/intro) – a [promise-based](https://javascript.info/promise-basics) HTTP Client
- [`dayjs`](https://day.js.org/): format & compare dates
- [`jwt-decode`](https://www.npmjs.com/package/jwt-decode) – handling JSON Web Tokens
- [`react-bootstrap`](https://react-bootstrap-v4.netlify.app/) - front-end framework
- [`react-dom`](https://www.npmjs.com/package/react-dom) – serves as the entry point to the DOM and server renderers for React
- [`react-infinite-scroll-component`](https://www.npmjs.com/package/react-infinite-scroll-component) – load more pages of the API response by scrolling
- [`react-router-dom`](https://www.npmjs.com/package/react-router-dom) – bindings for using React Router in web applications
- [`react-scripts`](https://www.npmjs.com/package/react-scripts) – scripts and configuration used by Create React App
- [`react-toastify`](https://fkhadra.github.io/react-toastify/): CRUD notification messages
- [`web-vitals`](https://www.npmjs.com/package/web-vitals) – measuring all the Web Vitals metrics on real users

### Tools used

- [Am I Responsive?](https://ui.dev/amiresponsive) – show the website on a range of devices
- [Balsamiq](https://balsamiq.com/) – create wireframes
- [Coolors.co](https://coolors.co/) - color palettes
- [diffchecker.com](https://www.diffchecker.com/): compare code
- [ES7+ React/Reduc/React-Native snippets extension for VS Code](https://marketplace.visualstudio.com/items?itemName=dsznajder.es7-react-js-snippets): quickly insert code snippets
- [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint): JSX validation
- [Favicon.io](https://favicon.io/) – create the favicon
- [Freeconvert](https://www.freeconvert.com/): convert manual testing videos from `.mov` to `.mp4`
- [Git](https://git-scm.com/) – version control
- [GitHub](https://github.com/) – store the source files
- [GitHub Desktop](https://desktop.github.com/) – GitHub UI
- [GitHub Issues](https://github.com/features/issues) – feature management, bug tracking
- [GitHub Projects](https://docs.github.com/en/issues/planning-and-tracking-with-projects/learning-about-projects/about-projects) – project management
- [GitHub TOC generator](http://github.com/3kh0/readme-toc/) – automatically generate a Markdown TOC
- [GitHub web editor](https://github.com/)
- [GitPod](https://gitpod.io/) – Integrated Development Environment
- [Google Chrome Developer Tools](https://developer.chrome.com/docs/devtools) – troubleshoot, test responsivity and styling
- [Google Sheets](https://docs.google.com/spreadsheets) – planning user stories
- [Heroku](https://heroku.com/) – host the production version of the app
- [Jigsaw](https://jigsaw.w3.org/css-validator/validator): CSS validator
- [markdownlint extension for VS Code](https://marketplace.visualstudio.com/items?itemName=DavidAnson.vscode-markdownlint): Markdown linting & style checking
- [Preview](https://support.apple.com/guide/preview/welcome/mac) – cropping and annotating images
- [Shields.io](https://shields.io/) – add badges to README
- [Slack](https://slack.com/) – mentor communication
- [`png` color changer](https://onlinepngtools.com/change-png-color)
- [Prettier extension for VS Code](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode): code formatter
- [ReacTree](https://marketplace.visualstudio.com/): make a React component tree
- [SP studio](https://sp-studio.de/): create mock-up user pictures
- [Typos spell checker for VS Code](https://open-vsx.org/extension/tekumara/typos-vscode)
- [Visual Studio Code](https://code.visualstudio.com/) – code editor
- [W3C HTML validator](https://validator.w3.org/)
- [WebAIM](https://webaim.org/resources/contrastchecker/) – color contrast checking

## Deployment

The following instructions describe the deployment process with the tools used for this project.
Of course, you can choose other tools/providers for the individual functions described below, e. g., a different Postgres database instead of Neon, or a different development environment instead of GitPod.
Naturally, detailed instructions are only provided for the tools used in this project.

### Prerequisites

- [GitPod](https://www.gitpod.io/) (or another IDE)
- [Python 3.12](https://www.python.org/)
- [pip](https://github.com/pypa/pip)
- [git](https://git-scm.com/)
- [Neon](https://neon.tech/) (or another Postgres database)
- [Cloudinary](https://cloudinary.com/) (or another media hosting provider)
- [Heroku](https://www.heroku.com/) (or another could platform)
- Dependencies listed in [`requirements.txt`](requirements.txt)

> [! WARNING]
> The setup has been known to be prone to version conflicts, so use the exact versions specified in [`requirements.txt`](requirements.txt)

### Fork the repository

You can fork the repository by following these steps:

1. Log in to [GitHub](https://github.com/) (if you don't have a GitHub account yet, you can [create one](https://docs.github.com/en/get-started/start-your-journey/creating-an-account-on-github) for free).
2. Navigate to the project website [https://github.com/blahosyl/task-manager-api](https://github.com/blahosyl/task-manager-api).
3. Click on **Fork** in the upper right part of the screen.
4. On the next page you have the possibility to change the repository name. To do this, simply write your desired name in the text field in the center part of the screen. You can also leave the name as it is.
5. Click **Fork** in the bottom right part of the screen.

>[!TIP]
>If you do rename the repository, make sure to keep the [GitHub naming conventions](https://github.com/bcgov/BC-Policy-Framework-For-GitHub/blob/master/BC-Gov-Org-HowTo/Naming-Repos.md) in mind.

### Deploy in the development environment

1. Open the repository in a new workspace in GitPod.
2. Create a new React app by typing the following into the terminal:<br>
 `npx create-react-app . --use-npm`
3. Install all required dependencies from the `package.json` file by typing `npm install` into the terminal (without any arguments).
4. Because of a conflict between the GitHub template provided by Code Institute and Node, you might have to downgrade your `node` and `npm` versions.
Run `nvm install 16 && nvm use 16` in the terminal to use `node` v16.20.2 (`npm` v8.19.4).
5. To connect the app to the deployed API, go to [`/src/api/axiosDefaults.js`](/src/api/axiosDefaults.js), and add your deployed API's URL to `axios.defaults.baseURL`, replacing the current URL.
6. Start the app in the development environment by typing `npm start` into the terminal.

### Deploy to production

#### Pre-deployment steps

Make sure to complete the following pre-deployment steps in your development environment, especially if you made changes to the project:

1. Check that a `Procfile` is present in the repository at the root level.
It should have the content `web: serve -s build`.
2. Commit any changes you made to the code.
3. Push your changes to GitHub.

#### Steps on Heroku

1. Log in to your [Heroku](https://www.heroku.com/) account (or create a new one if you have not done so yet).
2. [Create a new Heroku app](https://dashboard.heroku.com/new-app) by selecting your region and app name.
3. Under **Deploy > Deployment method** in Heroku, select **GitHub** and connect Heroku to your GitHub account.
	- Type in your repository name, then click **Search**.
	- When your repository appears, click **Connect** next to it.
4. Under **Deploy > Manual deploy** in Heroku, select **Deploy branch** to deploy manually.
	- Once the process is finished, the following message will appear:<br>
	_Your app was successfully deployed_
	- Click **View** under the message, and a new tab will appear with your deployed app.
5. (optional) Under **Deploy > Automatic deploy** in Heroku, select **Enable Automatic Deploys** if you want your app to be rebuilt each time you push to the `main` branch of your GitHub repository (but make sure your `settings.py` file always has `DEBUG=False` when you do).

## Credits

### Code credits

This project was developed on the basis of the [Moments](https://github.com/Code-Institute-Solutions/moments) walkthrough project by [Code Institute](https://github.com/Code-Institute-Solutions/).

Many features and the overall feel was inspired by [Trello](https://support.atlassian.com/trello/).

I have also consulted the project [Tick It](https://github.com/Code-Institute-Submissions/ci_pp5_tick_it_react) by [Jamie King](https://github.com/jkingportfolio) and implemented the [Task deletion confirmation modal](https://github.com/blahosyl/task-manager-frontend/issues/17) based on it.

Spencer Barriball kindly provided a [suggestion](https://code-institute-room.slack.com/archives/C02MTH5MBDG/p1723141476108919?thread_ts=1723121474.717569&cid=C02MTH5MBDG) to get rid of the [non-breaking warning](https://github.com/blahosyl/task-manager-frontend/issues/83) in the Profile Edit Form, which is also present in the [Moments](https://github.com/Code-Institute-Solutions/moments) walkthrough project by [Code Institute](https://github.com/Code-Institute-Solutions/).

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
- [install all dependencies from `package.json`](https://stackoverflow.com/a/42969648)

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
