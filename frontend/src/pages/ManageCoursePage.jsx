import { Link, useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import * as api from '../services/courseService.js';
import { useAuth } from '../context/AuthContext.jsx';

const emptyLecture = {
  title: '',
  description: '',
  videoUrl: '',
  notes: '',
  duration: '',
  order: 0,
};

function LectureEditor({ lecture, token, refresh }) {
  const [form, setForm] = useState({
    title: lecture.title || '',
    description: lecture.description || '',
    videoUrl: lecture.videoUrl || '',
    notes: lecture.notes || '',
    duration: lecture.duration || '',
    order: lecture.order || 0,
  });

  const [editing, setEditing] = useState(false);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const save = async (event) => {
    event.preventDefault();
    setError('');
    setSaving(true);

    try {
      await api.updateLecture(lecture._id, form, token);
      setEditing(false);
      await refresh();
    } catch (err) {
      setError(err.message || 'Failed to update lecture.');
    } finally {
      setSaving(false);
    }
  };

  const deleteLecture = async () => {
    if (!window.confirm('Delete this lecture?')) {
      return;
    }

    setError('');

    try {
      await api.deleteLecture(lecture._id, token);
      await refresh();
    } catch (err) {
      setError(err.message || 'Failed to delete lecture.');
    }
  };

  return (
    <div className="lecture-editor">
      <div>
        <strong>{lecture.title}</strong>
        <small>{lecture.duration || 'No duration'}</small>
      </div>

      <div>
        <button
          type="button"
          className="link-button"
          onClick={() => {
            setError('');
            setEditing(!editing);
          }}
        >
          {editing ? 'Cancel' : 'Edit'}
        </button>

        <button
          type="button"
          className="danger-button"
          onClick={deleteLecture}
        >
          Delete
        </button>
      </div>

      {error && <p className="error-message">{error}</p>}

      {editing && (
        <form className="mini-form" onSubmit={save}>
          <input
            required
            placeholder="Title"
            value={form.title}
            onChange={(event) =>
              setForm({
                ...form,
                title: event.target.value,
              })
            }
          />

          <textarea
            placeholder="Description"
            value={form.description}
            onChange={(event) =>
              setForm({
                ...form,
                description: event.target.value,
              })
            }
          />

          <input
            placeholder="Video URL"
            value={form.videoUrl}
            onChange={(event) =>
              setForm({
                ...form,
                videoUrl: event.target.value,
              })
            }
          />

          <input
            placeholder="Duration"
            value={form.duration}
            onChange={(event) =>
              setForm({
                ...form,
                duration: event.target.value,
              })
            }
          />

          <textarea
            placeholder="Notes / resources"
            value={form.notes}
            onChange={(event) =>
              setForm({
                ...form,
                notes: event.target.value,
              })
            }
          />

          <input
            type="number"
            placeholder="Order"
            value={form.order}
            onChange={(event) =>
              setForm({
                ...form,
                order: event.target.value,
              })
            }
          />

          <button
            type="submit"
            className="button button-primary"
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Save lecture'}
          </button>
        </form>
      )}
    </div>
  );
}

function ModuleEditor({ item, token, refresh }) {
  const [lecture, setLecture] = useState(emptyLecture);

  const [title, setTitle] = useState(item.title || '');
  const [description, setDescription] = useState(item.description || '');
  const [order, setOrder] = useState(item.order || 0);

  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const updateModule = async () => {
    setError('');
    setSaving(true);

    try {
      await api.updateModule(
        item._id,
        {
          title,
          description,
          order,
        },
        token
      );

      await refresh();
    } catch (err) {
      setError(err.message || 'Failed to update module.');
    } finally {
      setSaving(false);
    }
  };

  const deleteModule = async () => {
    if (!window.confirm('Delete module and all its lectures?')) {
      return;
    }

    setError('');

    try {
      await api.deleteModule(item._id, token);
      await refresh();
    } catch (err) {
      setError(err.message || 'Failed to delete module.');
    }
  };

  const addLecture = async (event) => {
    event.preventDefault();
    setError('');

    try {
      await api.createLecture(item._id, lecture, token);

      setLecture({
        ...emptyLecture,
      });

      await refresh();
    } catch (err) {
      setError(err.message || 'Failed to create lecture.');
    }
  };

  return (
    <details className="manage-module" open>
      <summary>
        <span>{item.title}</span>
        <span>{item.lectures.length} lectures</span>
      </summary>

      {error && <p className="error-message">{error}</p>}

      <div className="module-tools">
        <button
          type="button"
          className="link-button"
          onClick={updateModule}
          disabled={saving}
        >
          {saving ? 'Saving...' : 'Save module'}
        </button>

        <button
          type="button"
          className="danger-button"
          onClick={deleteModule}
        >
          Delete module
        </button>
      </div>

      <div className="mini-form">
        <input
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Module title"
        />

        <textarea
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder="Description"
        />

        <input
          type="number"
          value={order}
          onChange={(event) => setOrder(event.target.value)}
          placeholder="Order"
        />
      </div>

      <div className="manage-lectures">
        {item.lectures.length > 0 ? (
          item.lectures.map((lectureItem) => (
            <LectureEditor
              key={lectureItem._id}
              lecture={lectureItem}
              token={token}
              refresh={refresh}
            />
          ))
        ) : (
          <p className="muted-text">No lectures added yet.</p>
        )}
      </div>

      <form
        className="mini-form add-lecture"
        onSubmit={addLecture}
      >
        <h4>Add lecture</h4>

        <input
          required
          placeholder="Title"
          value={lecture.title}
          onChange={(event) =>
            setLecture({
              ...lecture,
              title: event.target.value,
            })
          }
        />

        <textarea
          placeholder="Description"
          value={lecture.description}
          onChange={(event) =>
            setLecture({
              ...lecture,
              description: event.target.value,
            })
          }
        />

        <input
          placeholder="Video URL"
          value={lecture.videoUrl}
          onChange={(event) =>
            setLecture({
              ...lecture,
              videoUrl: event.target.value,
            })
          }
        />

        <input
          placeholder="Duration"
          value={lecture.duration}
          onChange={(event) =>
            setLecture({
              ...lecture,
              duration: event.target.value,
            })
          }
        />

        <textarea
          placeholder="Notes / resources"
          value={lecture.notes}
          onChange={(event) =>
            setLecture({
              ...lecture,
              notes: event.target.value,
            })
          }
        />

        <input
          type="number"
          placeholder="Order"
          value={lecture.order}
          onChange={(event) =>
            setLecture({
              ...lecture,
              order: event.target.value,
            })
          }
        />

        <button
          type="submit"
          className="button button-outline"
        >
          Add lecture
        </button>
      </form>
    </details>
  );
}

export function ManageCoursePage() {
  const { id } = useParams();
  const { token } = useAuth();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [form, setForm] = useState(null);

  const [module, setModule] = useState({
    title: '',
    description: '',
    order: 0,
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [savingCourse, setSavingCourse] = useState(false);
  const [addingModule, setAddingModule] = useState(false);

  const refresh = async () => {
    try {
      setError('');

      const data = await api.getCourse(id, token);

      setCourse(data.course);
      setForm(data.course);
    } catch (err) {
      setError(err.message || 'Failed to load course.');
    } finally {
      setLoading(false);
    }
  };

  /*
   * IMPORTANT:
   * Do not pass an async function directly to useEffect.
   * The previous code used:
   *
   * useEffect(refresh, [id, token]);
   *
   * refresh() returns a Promise, which caused:
   * "useEffect must not return anything besides a function"
   * and "destroy is not a function".
   */
  useEffect(() => {
    refresh();
  }, [id, token]);

  const saveCourse = async (event) => {
    event.preventDefault();

    setError('');
    setSavingCourse(true);

    try {
      await api.updateCourse(id, form, token);
      await refresh();
    } catch (err) {
      setError(err.message || 'Failed to update course.');
    } finally {
      setSavingCourse(false);
    }
  };

  const deleteCourse = async () => {
    if (!window.confirm('Delete course and all its content?')) {
      return;
    }

    setError('');

    try {
      await api.deleteCourse(id, token);
      navigate('/faculty/dashboard');
    } catch (err) {
      setError(err.message || 'Failed to delete course.');
    }
  };

  const addModule = async (event) => {
    event.preventDefault();

    setError('');
    setAddingModule(true);

    try {
      await api.createModule(id, module, token);

      setModule({
        title: '',
        description: '',
        order: 0,
      });

      await refresh();
    } catch (err) {
      setError(err.message || 'Failed to create module.');
    } finally {
      setAddingModule(false);
    }
  };

  if (loading) {
    return (
      <main className="loading-screen">
        Loading course manager...
      </main>
    );
  }

  if (!course || !form) {
    return (
      <main className="content-page">
        <p className="error-message">
          {error || 'Course could not be loaded.'}
        </p>

        <button
          type="button"
          className="button button-primary"
          onClick={refresh}
        >
          Try again
        </button>

        <br />

        <Link
          className="text-link"
          to="/faculty/dashboard"
        >
          Back to dashboard
        </Link>
      </main>
    );
  }

  return (
    <main className="content-page manage-page">
      <Link
        className="text-link"
        to="/faculty/dashboard"
      >
        ← My courses
      </Link>

      <h1>Manage course</h1>

      {error && (
        <p className="error-message">
          {error}
        </p>
      )}

      <form
        className="editor-card"
        onSubmit={saveCourse}
      >
        <label>
          Course title

          <input
            required
            value={form.title || ''}
            onChange={(event) =>
              setForm({
                ...form,
                title: event.target.value,
              })
            }
          />
        </label>

        <label>
          Description

          <textarea
            required
            value={form.description || ''}
            onChange={(event) =>
              setForm({
                ...form,
                description: event.target.value,
              })
            }
          />
        </label>

        <label>
          Thumbnail URL

          <input
            value={form.thumbnail || ''}
            onChange={(event) =>
              setForm({
                ...form,
                thumbnail: event.target.value,
              })
            }
          />
        </label>

        <div className="form-actions">
          <button
            type="submit"
            className="button button-primary"
            disabled={savingCourse}
          >
            {savingCourse ? 'Saving...' : 'Save course'}
          </button>

          <button
            type="button"
            className="danger-button"
            onClick={deleteCourse}
          >
            Delete course
          </button>
        </div>
      </form>

      <h2>Modules</h2>

      {course.modules && course.modules.length > 0 ? (
        course.modules.map((item) => (
          <ModuleEditor
            key={item._id}
            item={item}
            token={token}
            refresh={refresh}
          />
        ))
      ) : (
        <p className="muted-text">
          No modules added yet.
        </p>
      )}

      <form
        className="editor-card compact-card"
        onSubmit={addModule}
      >
        <h3>Add module</h3>

        <input
          required
          placeholder="Module title"
          value={module.title}
          onChange={(event) =>
            setModule({
              ...module,
              title: event.target.value,
            })
          }
        />

        <textarea
          placeholder="Description"
          value={module.description}
          onChange={(event) =>
            setModule({
              ...module,
              description: event.target.value,
            })
          }
        />

        <input
          type="number"
          placeholder="Order"
          value={module.order}
          onChange={(event) =>
            setModule({
              ...module,
              order: event.target.value,
            })
          }
        />

        <button
          type="submit"
          className="button button-primary"
          disabled={addingModule}
        >
          {addingModule ? 'Adding...' : 'Add module'}
        </button>
      </form>
    </main>
  );
}