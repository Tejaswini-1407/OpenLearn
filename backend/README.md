
## Course and learning-content features

Authenticated users can browse the course catalog, course outlines, lectures, and video content. Faculty can create and manage only their own courses, modules, and lectures. Deleting a course removes its related modules and lectures; deleting a module removes its lectures.

### Course API

All course routes require a valid Bearer token.

- `GET /api/courses` — browse courses
- `GET /api/courses/mine` — faculty member's courses
- `GET /api/courses/:id` — course with modules and lectures
- `POST /api/courses` — create course (faculty)
- `PUT /api/courses/:id` — update owned course (faculty)
- `DELETE /api/courses/:id` — delete owned course and content (faculty)
- `POST /api/courses/:courseId/modules` — create module in owned course (faculty)
- `PUT /api/modules/:id` — update module in owned course (faculty)
- `DELETE /api/modules/:id` — delete module and lectures (faculty)
- `POST /api/modules/:moduleId/lectures` — create lecture in owned course (faculty)
- `PUT /api/lectures/:id` — update lecture in owned course (faculty)
- `DELETE /api/lectures/:id` — delete lecture in owned course (faculty)

### Frontend routes

- `/courses` — student course catalog
- `/courses/:id` — course details and module outline
- `/courses/:id/lectures/:lectureId` — learning page and video player
- `/faculty/courses/new` — new course form
- `/faculty/courses/:id/manage` — course, module, and lecture management
