![Banner image](https://user-images.githubusercontent.com/10284570/173569848-c624317f-42b1-45a6-ab09-f0ea3c247648.png)

# n8n-nodes-canvas

This is an n8n community node for interacting with the Canvas LMS API. It allows you to work with Canvas courses, users, assignments, and other resources through n8n workflows.

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/reference/license/) workflow automation platform.

## Installation

Follow these instructions to install this node in your n8n instance:

```bash
# In your n8n installation directory
npm install n8n-nodes-canvas

# OR with pnpm
pnpm install n8n-nodes-canvas
```

Restart n8n for the new node to appear in the nodes panel.

## Features

This node allows you to interact with the Canvas LMS API:

### Canvas LMS

#### Trigger Operations:

- New Course: Trigger when a new course is created
- Course Updated: Trigger when a course is updated
- New Assignment: Trigger when a new assignment is created
- New Submission: Trigger when a new submission is made
- New Announcement: Trigger when a new announcement is created

#### Action Operations:

- Course Operations:

  - Get: Retrieve a single course
  - Get All: Retrieve all courses
  - Create: Create a new course
  - Update: Update a course
  - Delete: Delete a course

- User Operations:

  - Get: Retrieve a single user
  - Get All: Retrieve all users
  - Create: Create a new user
  - Update: Update a user

- Assignment Operations:

  - Get: Retrieve a single assignment
  - Get All: Retrieve all assignments for a course
  - Create: Create a new assignment in a course
  - Update: Update an assignment
  - Delete: Delete an assignment

- Module Operations:

  - Get: Retrieve a single module
  - Get All: Retrieve all modules for a course
  - Create: Create a new module in a course
  - Update: Update a module
  - Delete: Delete a module

- Page Operations:

  - Get: Retrieve a single page
  - Get All: Retrieve all pages for a course
  - Create: Create a new page in a course
  - Update: Update a page
  - Delete: Delete a page

- Discussion Operations:

  - Get: Retrieve a single discussion topic
  - Get All: Retrieve all discussion topics for a course
  - Create: Create a new discussion topic in a course
  - Update: Update a discussion topic
  - Delete: Delete a discussion topic

- File Operations:

  - Get: Retrieve a single file
  - Get All: Retrieve all files for a course
  - Upload: Upload a file to a course
  - Delete: Delete a file

- Announcement Operations:

  - Get: Retrieve a single announcement
  - Get All: Retrieve all announcements for a course
  - Create: Create a new announcement in a course
  - Update: Update an announcement
  - Delete: Delete an announcement

- Quiz Operations:

  - Get: Retrieve a single quiz
  - Get All: Retrieve all quizzes for a course
  - Create: Create a new quiz in a course
  - Update: Update a quiz
  - Delete: Delete a quiz

- Submission Operations:

  - Get: Retrieve a submission
  - Get All: Retrieve all submissions for an assignment
  - Create: Create a submission for an assignment
  - Grade: Grade a submission

- Enrollment Operations:

  - Get: Retrieve an enrollment
  - Get All: Retrieve all enrollments for a course
  - Create: Create a new enrollment in a course
  - Delete: Delete an enrollment

- Group Operations:

  - Get: Retrieve a single group
  - Get All: Retrieve all groups for a course
  - Create: Create a new group in a course
  - Update: Update a group
  - Delete: Delete a group

- Rubric Operations:
  - Get: Retrieve a single rubric
  - Get All: Retrieve all rubrics for a course
  - Create: Create a new rubric in a course
  - Update: Update a rubric
  - Delete: Delete a rubric

## Credentials

To use this node, you need to create credentials for the Canvas LMS API:

1. Obtain an API key/token from your Canvas LMS instance
2. In n8n, go to Credentials → New
3. Select the 'Canvas LMS API' credential type
4. Enter your Canvas instance URL (e.g., https://myschool.instructure.com)
5. Enter your API key/token
6. Save the credential

## Resources

- [n8n documentation](https://docs.n8n.io/)
- [Canvas LMS API documentation](https://canvas.instructure.com/doc/api/)

## Version history

- 0.1.0: Initial release with basic course, user, and assignment operations
- 0.2.0: Added new resources: modules, pages, discussions, files, announcements, quizzes, submissions, enrollments, groups, and rubrics
- 0.3.0: Added trigger functionality to monitor for new courses, assignments, submissions, and announcements

## License

[MIT](LICENSE.md)
