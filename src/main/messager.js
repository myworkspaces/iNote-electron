const path = require('path')
const fs = require('fs')
const events = require('events')

const catalogFile = path.resolve(__dirname, 'catalog.json')
const catalogKvFile = path.resolve(__dirname, 'catalog.kv.json')

module.exports = function (ipcMain) {
  // 处理异步消息
  ipcMain.on('asynchronous-message', (event, arg) => {
    console.log(arg)
    event.sender.send('asynchronous-reply', 'pong')
  })
  // 处理同步消息
  ipcMain.on('synchronous-message', (event, arg) => {
    console.log(arg) // prints "ping"
    event.returnValue = 'pong'
  })

  // 添加笔记
  ipcMain.on('noteMessager.add', (event, note) => {
    console.log(note)
    const noteId = 1
    event.sender.send('noteMessager.add.reply', noteId)
  })
  // 更新笔记
  ipcMain.on('noteMessager.update', (event, arg) => {

  })
  // 删除笔记
  ipcMain.on('noteMessager.delete', (event, arg) => {

  })
  // 恢复逻辑删除的笔记
  ipcMain.on('noteMessager.recover', (event, arg) => {

  })
  // 根据目录读取
  ipcMain.on('noteMessager.findAllByCatalogId', (event, catelogId) => {
    console.log('find notes by catalogId: ', catelogId)
    var data = []
    event.sender.send('noteMessager.findAllByCatalogId.reply', JSON.stringify(data))
  })

  // 初始化全局目录结构
  ipcMain.on('catalogMessager.initCatalog', (event) => {
    var data = {}
    var myEvent = new events.EventEmitter()
    myEvent.on('send', function () {
      if (Object.keys(data).length === 2) {
        console.log('initCatalog:', data)
        event.sender.send('catalogMessager.initCatalog.reply', JSON.stringify(data))
        // event.returnValue = JSON.stringify(data)
      }
    })
    fs.readFile(catalogFile, function (err, catalog) {
      if (err) {
        data.catalog = [{id: -1, label: '我的文件夹', children: []}]
      } else {
        data.catalog = catalog
      }
      myEvent.emit('send')
    })
    fs.readFile(catalogKvFile, function (err, catalogKv) {
      if (err) {
        data.catalogKv = {'-1': '0'}
      } else {
        data.catalogKv = catalogKv
      }
      myEvent.emit('send')
    })
  })
  // 更新全局目录结构
  ipcMain.on('catalogMessager.updateCatalog', (event) => {

  })
  // 新目录入库
  ipcMain.on('catalogMessager.add', (event) => {

  })
  // 删除目录
  ipcMain.on('catalogMessager.delete', (event) => {

  })
  // 恢复逻辑删除的目录
  ipcMain.on('catalogMessager.recover', (event) => {

  })
}
