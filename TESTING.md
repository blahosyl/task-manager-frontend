# Testing the Task Manager

Back to  `README.md`(README.md)

## Table of Contents

## Testing User Stories

Each user story has a list of acceptance criteria, which are the expected outcomes when the story is tested. An issue is only closed if manual testing confirms that the acceptance criteria are fulfilled.  

The commits corresponding to each User Story are linked in each the GitHuB Issue.

An overview of implemented and tested User Stories can be seen in the [Google Sheet containing User Stories](https://docs.google.com/spreadsheets/d/1qZQIKNKa_nGfCR9YQQ1UFkeIGvXR_ikOx7Oev0sEVBA/edit?usp=sharing).

All User Stories in the MVP have been implemented and work as intended.

Issues outside the MVO that were not completed for the first release of the project but still intend to be done in further development work are gathered under the label [`v2`](https://github.com/blahosyl/task-manager-frontend/issues?q=is%3Aissue+label%3A%22v2%22+) in GitHub Issues.

## Code validation

### HTML validation

#### Landing page validation

[No errors found](https://validator.w3.org/nu/?doc=https%3A%2F%2Fpp5-task-manager-frontend-eebb66e2c99d.herokuapp.com%2Fsignin)

#### Signin page validation

[No errors found](https://validator.w3.org/nu/?doc=https%3A%2F%2Fpp5-task-manager-frontend-eebb66e2c99d.herokuapp.com%2Fsignin)

#### Home page validation

### CSS validation

All custom `css` files were validated with [Jigsaw](https://jigsaw.w3.org/css-validator/validator), which uncovered a few minor issue that were corrected (see the commits in [#154](https://github.com/blahosyl/task-manager-frontend/issues/154)).
The resulting code passed without errors or warnings for all files.

![CSS validation: no issues](documentation-assets/testing-assets/validation/css-validation/css-validation.png)

In addition, each JS file was manually checked for comment coverage and unused code at the end of development [(#154)](https://github.com/blahosyl/task-manager-frontend/issues/154).

### JavaScript/JSX validation

[EsLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) was used throughout development to validate the code.
No errors or warnings are present in the project.

![JSX validation: no issues](documentation-assets/testing-assets/validation/jsx-validation/jsx-validation.png)

In addition, each JS file was manually checked for comment coverage, and formatted with the [Prettier extension for VS Code](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) at the end of development [(#155)](https://github.com/blahosyl/task-manager-frontend/issues/155).

## Manual feature testing

### Landing page

### Comments manual testing

### Tasks manual testing

### Profiles manual testing

### Watchers manual testing

### Authentication manual testing

#### Signin page

#### Signup page

## Accessibility testing

### Lighthouse

The following pages have been tested with Lighthouse emulating both a mobile and a desktop use case:

- landing page
- signin page
- signup page
- task kanban page
- task list page
- task detail page
- task create page
- task edit page
- profile list page
- profile detail page

The accessibility audits uncovered some minor issues with color contrasts and heading precedence. These were all corrected (see the commits of [the corresponding Issue](https://github.com/blahosyl/task-manager-frontend/issues/149)), so that the final accessibility audit result for all pages tested is 100%.

![JavaScript validation error: unknown variable `bootstrap`](documentation-assets/testing-assets/lighthouse/accessibility-100.png)

All accessibility reports can be found in [this folder](documentation-assets/testing-assets/lighthouse/).

### Color

In addition to Lighthouse, color contrasts were also tested with the [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker). This was especially important given that tasks have multiple color schemes conditionally rendered depending on their priority.

Where contrast did not meet at least AA standard, the colors were changed.

As pointed out by my mentor, the orange color of the navbar icons does not need to reach high contrast with the background, since it is always accompanied by a corresponding text indicating where the nav link leads.

#### High specifications

|color name  |HEX code|
|---   |--- |
|very-dark-high|#531D04|
|dark-high|#D7410F|
|light-high|#f7ddcf|

### Medium theme specifications

|color name  |HEX code|
|---   |--- |
|very-dark-med|#530E0E|
|dark-med|#992319|
|light-med|#FBEDE5|

### Low theme

|color name  |HEX code|
|---   |--- |
|very-dark-low|#07565A|
|dark-low|#0A8385|
|light-low|#D1FAF3|

### Neutral color specifications

|color name  |HEX code|
|---   |--- |
|light-neutral|#F9FAFC|
|white|#FFFFFF|
|light-gray|#dadadf|
|gray |#242a3d|

#### High theme contrast check

| color 1 |color 2 |contrast | [WCAG AA/AAA](https://ialabs.ie/what-is-the-difference-between-wcag-a-aa-and-aaa/) |Comment|
|---   |---  |:---:  |:---:| ---|
|very-dark-high  |white          |13.58:1  |AAA| |
|very-dark-high  |light-high  |10.48:1  |AAA| |
<!-- |very-dark-high 	|med-orange 	|5.28:1 	|AA| Only used for large text| -->
|very-dark-high  |light-neutral  |13:01:1  |AAA| |
|dark-high     |white          |4.51:1  |AA | Only used for large text|
|dark-high     |light-high  |3.48:1  |AA|Only used for icon|

#### Medium theme contrast check

| color 1 |color 2 |contrast | [WCAG AA/AAA](https://ialabs.ie/what-is-the-difference-between-wcag-a-aa-and-aaa/) |Comment|
|---   |---  |:---:  |:---:| ---|
|very-dark-med  |white          |14.61:1  |AAA| |
|very-dark-med  |light-med  |12.76:1  |AAA| |
<!-- |very-dark-med 	|med-blue 	|4.6:1 	|AAA|Only used for large text| -->
<!-- |very-dark-med  |light-neutral  |12.04:1  |AAA| | -->
|dark-med     |white          |8.04:1  |AAA | Only used for large text|
|dark-med     |light-med  |7.03:1  |AAA|Only used for icon|

#### Low theme contrast check

| color 1 |color 2 |contrast | [WCAG AA/AAA](https://ialabs.ie/what-is-the-difference-between-wcag-a-aa-and-aaa/) |Comment|
|---   |---  |:---:  |:---:| ---|
|very-dark-low  |white          |8.44:1  |AAA| |
|very-dark-low  |light-low  |7.5:1  |AAA| |
<!-- |very-dark-low 	|med-green 	|6.68:1 	|AAA|Only used for large text| -->
<!-- |very-dark-low  |light-neutral  |9.2:1  |AAA| | -->
|dark-low     |white          |4.56:1  |AA | Only used for large text|
|dark-low     |light-low  |4.06   :1  |AA|Only used for icon|

## Automated testing

## Bugs

All bugs are tracked in [GitHub Issues](https://github.com/blahosyl/task-manager-frontend/issues?q=is%3Aissue+label%3Abug).

### Known bugs

Known bugs are listed in [GitHub Issues](https://github.com/blahosyl/task-manager-frontend/issues?q=is%3Aissue+label%3Abug+is%3Aopen).

### Solved bugs

Solved bugs are listed in [GitHub Issues](https://github.com/blahosyl/task-manager-frontend/issues?q=is%3Aissue+label%3Abug+is%3Aclosed).

#### Expected errors in the Console

- 3 401 (unauthorized) errors on mount/refresh
- 401 when visiting the Signin or Signup pages
- 400 errors when sending incorrect form data
- a 401 (unauthorized) error when refreshing the access token
