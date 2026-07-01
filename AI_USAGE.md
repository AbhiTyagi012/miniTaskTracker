# AI Usage Disclosure

## 1. Which AI tools did you use?

**Claude Code** (Anthropic's Claude Sonnet 4.6) via the Claude Code CLI/IDE extension, used at specific points during development — primarily for boilerplate generation and talking through deployment setup. The majority of design decisions, debugging, and verification were done manually.

---

## 2. What did you ask AI to help with?

AI was used as an accelerator for well-understood tasks, not as a replacement for thinking:

- Generating initial project scaffolding (directory structure, FastAPI app skeleton, Vite setup) once the architecture was already decided
- Producing first drafts of Pydantic schemas and Tailwind component markup to iterate on
- Talking through the Vercel + Render monorepo deployment setup (single branch, per-platform root directory config)
- Drafting the README template which was then revised to reflect the actual project

---

## 3. Which parts of the code were AI-assisted?

AI contributed first drafts in these areas, all of which were reviewed and adjusted:

| File | AI contribution | What I changed / verified |
|------|----------------|--------------------------|
| `backend/app/models/task.py` | Initial Pydantic schema structure | Added explicit `None` guard in `TaskUpdate` validator; verified `task_from_doc` handles missing optional fields |
| `backend/app/routes/tasks.py` | Endpoint scaffolding | Reviewed query logic, fixed `global client` bug in `database.py`, verified filter/search param behaviour |
| `backend/app/database.py` | Motor async client pattern | Fixed missing `global` keyword; verified lifespan hooks connect and close correctly |
| `frontend/src/api/tasks.js` | Axios wrapper stubs | Verified each function maps to the correct HTTP method and endpoint |
| `frontend/src/hooks/useTasks.js` | Initial hook structure | Reviewed state update logic for `markComplete` and `removeTask` to confirm local state stays in sync |
| `frontend/src/components/*.jsx` | Component markup | Adjusted TaskCard layout and hover-delete UX; rewrote empty-state copy |

The following were written entirely by me without AI:

- Architecture and stack selection
- Data model field decisions (what fields are required vs. optional, status enum values)
- Decision to keep search server-side (regex on MongoDB) rather than client-side
- All deployment configuration and debugging

---

## 4. What did you manually change or verify?

**Bugs caught during review:**

- `database.py` initially lacked the `global client` declaration inside `connect_db`, which would have silently failed at runtime — caught by reading the code before running it
- `TaskUpdate` Pydantic validator didn't guard against `None` being passed to `.strip()` — added the `if v is not None` check
- Confirmed `FilterBar` sends no `status` query param when "All" is selected (correct API behaviour), since AI initially left a comment suggesting client-side filtering instead

**Dependency issue debugged and fixed manually:**

When running the backend for the first time, uvicorn crashed with:

```
ImportError: cannot import name '_QUERY_OPTIONS' from 'pymongo.cursor'
```

AI had pinned `motor==3.5.1` in `requirements.txt`, which only supports PyMongo up to 4.8.x. pip resolved PyMongo 4.17.0, which removed `_QUERY_OPTIONS`. I diagnosed the incompatibility by reading the traceback, checked Motor's changelog to identify that 3.6.0+ was the first release supporting PyMongo 4.9+, and updated the pin to `motor==3.7.0`. The fix resolved the import error immediately.

**Other manual verifications:**

- Confirmed CORS `allow_origins=["*"]` is acceptable for development and noted it must be restricted to the Vercel domain before production
- Verified `vercel.json` SPA rewrite rule is required so React Router doesn't 404 on direct URL access
- Tested the `counts` badge in `FilterBar` — confirmed it reflects the correct per-status totals derived from the API response, not stale local state

---

## 5. How did you test the solution?

Testing was done manually end-to-end:

**Backend** — started `uvicorn` with `--reload` and used the auto-generated `/docs` (Swagger UI) to test each endpoint:
- `POST /tasks` with valid payload, empty title, and missing title field
- `GET /tasks` with no params, `?status=open`, `?status=completed`, `?search=term`
- `PATCH /tasks/{id}` to mark complete and to verify 404 on a bad ID
- `DELETE /tasks/{id}` and confirmed 404 on a non-existent ID

**Frontend** — ran `npm run dev` and tested the full user flow:
- Created tasks with title only, and with all optional fields (description, priority, due date)
- Attempted to submit with an empty title — confirmed inline error message appears
- Marked tasks complete — confirmed strikethrough, "Done" badge, and circle fill
- Switched between All / Open / Completed filters and confirmed counts update
- Searched by partial title (case-insensitive) — confirmed results narrow correctly
- Deleted a task by hovering to reveal the delete button
- Verified empty state appears correctly for both zero tasks and no-match searches

---

## 6. Did AI produce anything incorrect or risky?

Yes — two things worth calling out:

1. **Motor/PyMongo version pin was wrong.** `motor==3.5.1` was pinned in `requirements.txt` but pip resolved a newer PyMongo (4.17.0) that Motor 3.5.x doesn't support. This caused a startup crash. I caught it from the traceback, diagnosed the root cause (removed internal symbol `_QUERY_OPTIONS`), and fixed it by upgrading to `motor==3.7.0`. This is a good example of why AI-generated dependency pins need to be verified — AI's training data cutoff means it may not know about recent breaking changes in third-party packages.

2. **CORS wildcard.** The generated `allow_origins=["*"]` is a reasonable development default but would be a security issue in production. Flagged and noted for tightening before deployment.

No credentials were exposed — `.env` files are in `.gitignore` and only `.env.example` files (with placeholder values) are committed.

---

## 7. What would you improve if you had more time?

- Add a MongoDB text index on `title` for proper full-text search (current regex works but doesn't scale)
- Task editing — click a task to open an edit modal
- Optimistic UI updates — update local state immediately and roll back on API error, so the UI feels instant
- Integration tests for the FastAPI routes using `pytest` + `httpx.AsyncClient`
- Component tests for `CreateTaskModal` and `useTasks` using Vitest + React Testing Library
- Keyboard shortcut (`N`) to open the create modal without reaching for the mouse
