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
      RowKey: desc,
      title,
    }

    service.insertEntity(table, task, (error, result, response) => {
      !title ? function() { alert("Not enough info!"); reject(); } : !error ? resolve() : reject()
    })
  })
)

module.exports = {
  init,
  createTask
}
