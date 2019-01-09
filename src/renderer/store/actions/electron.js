// 在渲染器进程 (网页) 中。
const { ipcRenderer } = require('electron')

const demo = function () {
  // 同步消息
  console.log(ipcRenderer.sendSync('synchronous-message', 'ping')) // prints "pong"
  // 异步消息
  ipcRenderer.on('asynchronous-reply', (event, arg) => {
    console.log(arg) // prints "pong"
  })
  ipcRenderer.send('asynchronous-message', 'ping')
}

const noteMessager = {
  add: (data, callback) => {
    ipcRenderer.on('noteMessager.add.reply', (event, noteId) => {
      callback(noteId)
    })
    ipcRenderer.send('noteMessager.add', data)
  },
  findAllByCatalogId: (catalogId, callback) => {
    ipcRenderer.on('noteMessager.findAllByCatalogId.reply', (event, noteList) => {
      callback(noteList)
    })
    ipcRenderer.send('noteMessager.findAllByCatalogId', catalogId)

    // let noteList = ipcRenderer.sendSync('noteMessager.findAllByCatalogId', catalogId)
    // console.log('noteList:', noteList)
    // callback(noteList)
  }
}

const catalogMessager = {
  initCatalog: (callback) => {
    ipcRenderer.on('catalogMessager.initCatalog.reply', (event, data) => {
      callback(data)
    })
    ipcRenderer.send('catalogMessager.initCatalog')

    // let data = ipcRenderer.sendSync('catalogMessager.initCatalog')
    // callback(data)
  },
  updateCatalog: (data, callback) => {

  }
}

const searchMessager = {
  add: (data, callback) => {},
  update: (data, callback) => {},
  delete: (data, callback) => {},
  all: (condition, callback) => {}
}

const electron = {
  demo: demo,
  noteMessager: noteMessager,
  catalogMessager: catalogMessager,
  searchMessager: searchMessager
}

export default electron
