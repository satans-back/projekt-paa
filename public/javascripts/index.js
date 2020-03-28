const updateTaskStatus = (id, status) => {
    fetch('/tasks/updateStatus', {
      method: 'post',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
      },
      body: `id=${id}&status=${status}`
    })
    .finally(() => {
      window.location = '/'
    })
}

const removeTask = (id) => {
    fetch('/tasks/removeTask', {
      method: 'post',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
      },
      body: `id=${id}`
    })
    .finally(() => {
      window.location = '/'
    })
}