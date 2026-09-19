// TeamForge Kanban Task Board Manager

class TeamForgeTasks {
  constructor() {
    this.store = window.TF_STORE;
    this.auth = window.TF_AUTH;
    this.state = window.TF_STATE;
  }

  createTask(teamId, title, description, assignedTo, priority = 'medium', dueDate = '') {
    if (!title) return null;

    const newTask = {
      id: "task_" + Date.now(),
      teamId: teamId,
      title: title,
      description: description || "",
      status: "todo",
      priority: priority,
      assignedTo: assignedTo || null,
      dueDate: dueDate || new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0]
    };

    this.store.saveTask(newTask);
    this.state.toast("Task Created", `"${title}" added to To Do list.`, "success");
    return newTask;
  }

  updateTaskStatus(taskId, newStatus) {
    const tasks = this.store.getTasks();
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      task.status = newStatus;
      this.store.saveTask(task);
      this.state.toast("Task Updated", `Task moved to ${newStatus.replace('_', ' ').toUpperCase()}`, "info");
      return task;
    }
    return null;
  }

  deleteTask(taskId) {
    this.store.deleteTask(taskId);
    this.state.toast("Task Deleted", "Task removed from board.", "info");
  }

  setupDragAndDrop(containerId, onStatusChange) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const columns = container.querySelectorAll('.kanban-col');

    columns.forEach(col => {
      col.addEventListener('dragover', (e) => {
        e.preventDefault();
        col.classList.add('drag-over');
      });

      col.addEventListener('dragleave', () => {
        col.classList.remove('drag-over');
      });

      col.addEventListener('drop', (e) => {
        e.preventDefault();
        col.classList.remove('drag-over');
        const taskId = e.dataTransfer.getData('text/plain');
        const newStatus = col.getAttribute('data-status');
        if (taskId && newStatus) {
          this.updateTaskStatus(taskId, newStatus);
          if (onStatusChange) onStatusChange();
        }
      });
    });
  }
}

window.TF_TASKS = new TeamForgeTasks();
