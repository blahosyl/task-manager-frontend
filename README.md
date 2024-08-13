# Task Manager

## UX/UI

### Strategy

### Scope

### Structure

#### React component structure

`TaskTabs` uses `ProfileList` and `TaskList` directly when the `list` prop is passed. `TaskList` uses `Task`.
Otherwise, `TaskTabs` uses `TaskKanban`, which uses `TaskList`, which uses `Task`

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

#### Task list

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

##### Filtering

##### Searching

#### Kanban board

I also implemented a task Kanban board, where tasks are automatically sorted based on their status.
Inspired by GitHub Projects and Trello, I implemented horizontal scrolling for this view.

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

This page shows a user's profile information and [tasks assigned to them](#task-list).

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
- [`png` color changer](https://onlinepngtools.com/change-png-color)

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

### Text

### Media

#### Images

- [orange-swirl](https://unsplash.com/photos/an-abstract-red-and-orange-background-with-curves-K-DwbsTXliY) by [LiZhang](https://unsplash.com/@sunx) ([Unspash](https://unsplash.com/))
- [silhouette](https://unsplash.com/photos/silhouette-photography-of-woman-0-eT-ApZmUw) by [Tem Rysh](https://unsplash.com/@tem_rysh) ([Unspash](https://unsplash.com/))
- [door](https://unsplash.com/photos/orange-room-with-open-door-DIewyzpUbRc) by [Natalia Y.](https://unsplash.com/@foxfox) ([Unspash](https://unsplash.com/))
- [logo & favicon] created by me, changed colors with [onlinepngtools.com](https://onlinepngtools.com/change-png-color), converted to favicon with [favicon.io/](https://favicon.io/favicon-converter/).

### Readmes

### Acknowledgements
