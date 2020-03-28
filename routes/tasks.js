const router = require('koa-router')()
const store = require('../store')

router.prefix('/tasks')

router.post('/add', async (ctx, next) => {
  await store.createTask(ctx.request.body.title, ctx.request.body.desc)
  ctx.redirect('/')
})

router.post('/updateStatus', async (ctx, next) => {
  const { id, status } = ctx.request.body
  await store.updateTaskStatus(id, status)
  ctx.status = 200
})

router.post('/removeTask', async (ctx, next) => {
  const { id } = ctx.request.body
  await store.removeTask(id)
  ctx.status = 204
})

module.exports = router
