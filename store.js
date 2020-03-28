const uuid = require('uuid')
const storage = require('azure-storage')
var retryOperations = new storage.ExponentialRetryPolicyFilter()
const service = storage.createTableService().withFilter(retryOperations);
const table = 'tasks'

const init = async () => (
  new Promise((resolve, reject) => {
    service.createTableIfNotExists(table, (error, result, response) => {
      !error ? resolve() : reject()
    })
  })
)

const createTask = async (title, desc) => (
  new Promise((resolve, reject) => {
    const generator = storage.TableUtilities.entityGenerator
    const task = {
      PartitionKey: generator.String('task'),
      RowKey: generator.String.Format("{0:D19}", DateTime.MaxValue.Ticks - DateTime.UtcNow.Ticks),
      title,
      desc,
      status: 'open'
    }

    !title ? function() { alert("Please remember about task title!"); return reject(); } : service.insertEntity(table, task, (error, result, response) => {
      !error ? resolve() : reject()
    })
  })
)

const listTasks = async () => (
  new Promise((resolve, reject) => {
    const query = new storage.TableQuery()
      .select(['RowKey'], ['title'], ['desc'], ['Timestamp'], ['status'])
      .where('PartitionKey eq ?', 'task')

    service.queryEntities(table, query, null, (error, result, response) => {
      !error ? resolve(result.entries.map((entry) => ({
        id: entry.RowKey._,
        title: entry.title._,
        desc: !entry.desc._ ? "BRAK OPISU TASKA" : entry.desc._,
        Timestamp: entry.Timestamp._,
        status: entry.status._
      }))) : reject()
    })
  })
)

const updateTaskStatus = async (id, status) => (
  new Promise((resolve, reject) => {
    const generator = storage.TableUtilities.entityGenerator
    const task = {
      PartitionKey: generator.String('task'),
      RowKey: generator.String(id),
      status
    }

    service.mergeEntity(table, task, (error, result, response) => {
      !error ? resolve() : reject()
    })
  })
)

const removeTask = async (id) => (
  new Promise((resolve, reject) => {
    const generator = storage.TableUtilities.entityGenerator
    const task = {
      PartitionKey: generator.String('task'),
      RowKey: generator.String(id),
    }

    service.deleteEntity(table, task, (error, result, response) => {
      !error ? resolve() : reject()
    })
  })
)

module.exports = {
  init,
  createTask,
  listTasks,
  updateTaskStatus,
  removeTask
}
