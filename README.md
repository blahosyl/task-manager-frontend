# Task Manager

## UX/UI

### Strategy

### Scope

### Structure

#### React component structure

`TaskTabs` uses `ProfileList` and `TaskList` directly when the `taskList` prop is passed. `TaskList` uses `Task`.
Otherwise, `TaskTabs` uses `TaskKanban`, which uses `Task`

#### Access management structure

#### CRUD

#### UI information design

##### Navigation bar design

##### Footer design

### Skeleton

#### Home page wireframes

#### Task list wireframes

#### Task detail wireframes

### Surface

#### Visual design

##### Logo

##### Minimalism

##### Color schemes

#### UX Improvements

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

## Project Management | Agile Methodologies

### Themes, Epics, Stories & Tasks

### Estimation

### Project Board

### Labels

#### Prioritization: MoSCoW

#### Timeboxing

#### Sprint planning

#### Sprint retroactives

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

The date fields are shown in a format the includes the day of the week, to facilitate processing.

#### Watch/unwatch function

Users can choose if they want to watch tasks created by them, as this might be required for some tasks but not others.

The watch button is an eye icon and a toolip instruction is show when hovering over it. This changes dynamically depending on whether the logged-in user is already watching the task or not.

#### Profile list

This is shown in the sidebar of certain Task views, and as a full-page version uner `/team`. The sidebar version only shows the avatar & [conditionally rendered name](#conditionally-rendered-names) of the user.
The full profile list also shows the pronouns and role if these are filled in.

#### Profile detail page

This page shows a user's profile information and [tasks assigned to them](#task-list-page).

For logged-in users, this shows all profile fields including empty ones.
In addition, the conditionally rendered user name has the suffix "(me)"
to indicate the user is viewing their own profile.

For all other users, only filled-in fields and the [conditially rendered name](#conditionally-rendered-names) is shown.

### Access management

### Admin Panel

### Future features

### Code features

#### Regular testing

#### Adequate commenting

#### DRY

#### Security

`npm audit fix` was run after every time a new package was installed. It is beyond the scope of the currect project to fix all dependency warnings, as these are typically handled by more senior developers or dedicated security engineers.

## Technologies used

### Languages used

### Other dependencies used

### Tools used

- [diffchecker.com](https://www.diffchecker.com/): comparing code
- [ES7+ React/Reduc/React-Native snippets extension for VS Code](https://marketplace.visualstudio.com/items?itemName=dsznajder.es7-react-js-snippets): quickly insert code snippets
- [markdownlint extension for VS Code](https://marketplace.visualstudio.com/items?itemName=DavidAnson.vscode-markdownlint): Markdown linting & style checking
- [`png` color changer](https://onlinepngtools.com/change-png-color)
- [Prettier extension for VS Code](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode): code formatter

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

Back End based on[DRF-API](https://github.com/Code-Institute-Solutions/drf-api) by [Code Institute](https://github.com/Code-Institute-Solutions/).

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
- [`flex` properyies](https://developer.mozilla.org/en-US/docs/Web/CSS/flex)
- [conditional tags in React JSX](https://stackoverflow.com/a/33471928)
- [prop drilling](https://stackoverflow.com/questions/67734236/understanding-how-we-can-avoid-passing-props-through-many-levels-of-component-hi)
- [`dayjs` `now`](https://day.js.org/docs/en/parse/now)
- [comparing dates](https://www.freecodecamp.org/news/javascript-date-time-dayjs/#howtocomparedatesindayjs)
- [Unicode for fire emoji](https://www.webfx.com/tools/emoji-cheat-sheet/)
- [Error: React Hook "useEffect" cannot be called inside a callback](https://stackoverflow.com/a/71900086)
- [Bootstrap vertical alignment](https://getbootstrap.com/docs/4.6/utilities/vertical-align/)
- [always push footer to the bottom](https://stackoverflow.com/a/66565163)

### Text

### Media

#### Images

- [orange-swirl](https://unsplash.com/photos/an-abstract-red-and-orange-background-with-curves-K-DwbsTXliY) by [LiZhang](https://unsplash.com/@sunx) ([Unspash](https://unsplash.com/))
- [silhouette](https://unsplash.com/photos/silhouette-photography-of-woman-0-eT-ApZmUw) by [Tem Rysh](https://unsplash.com/@tem_rysh) ([Unspash](https://unsplash.com/))
- [door](https://unsplash.com/photos/orange-room-with-open-door-DIewyzpUbRc) by [Natalia Y.](https://unsplash.com/@foxfox) ([Unspash](https://unsplash.com/))
- [logo](/src/assets/logo.jpg) & [favicon](public/favicon-16x16.png) created by me, changed colors with [onlinepngtools.com](https://onlinepngtools.com/change-png-color), converted to favicon with [favicon.io/](https://favicon.io/favicon-converter/)
- [lightbulb](https://unsplash.com/photos/lighted-orange-cfl-bylb-HfVfXJjktWw) by [Izumi](https://unsplash.com/@itsaizumi) ([Unspash](https://unsplash.com/))
- [no-results](/src/assets/no-results.png) & [upload](/src/assets/upload.png) taken from the Moments walkthrough project, colors changed with [onlinepngtools.com](https://onlinepngtools.com/change-png-color)

### Readmes

### Acknowledgements
