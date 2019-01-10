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
    ipcRenderer.once('noteMessager.add.reply', (event, noteId) => {
      callback(noteId)
    })
    ipcRenderer.send('noteMessager.add', data)
  },
  update: (data, callback) => {
    ipcRenderer.once('noteMessager.update.reply', (event) => {
      callback()
    })
    ipcRenderer.send('noteMessager.update', data)
  },
  delete: (data, callback) => {
    ipcRenderer.once('noteMessager.delete.reply', (event) => {
      callback()
    })
    ipcRenderer.send('noteMessager.delete', data)
  },
  findAllByCatalogId: (catalogId, callback) => {
    ipcRenderer.once('noteMessager.findAllByCatalogId.reply', (event, noteList) => {
      callback(noteList)
    })
    ipcRenderer.send('noteMessager.findAllByCatalogId', catalogId)
  }
}

const catalogMessager = {
  initCatalog: (callback) => {
    ipcRenderer.once('catalogMessager.initCatalog.reply', (event, data) => {
      callback(data)
    })
    ipcRenderer.send('catalogMessager.initCatalog')
  },
  updateCatalog: (data, callback) => {
    ipcRenderer.once('catalogMessager.updateCatalog.reply', (event) => {
      callback()
    })
    ipcRenderer.send('catalogMessager.updateCatalog', data)
  },
  add: (catalog, callback) => {
    ipcRenderer.once('catalogMessager.add.reply', (event, catalogId) => {
      callback(catalogId)
    })
    ipcRenderer.send('catalogMessager.add', catalog)
  },
  update: (data, callback) => {
    ipcRenderer.once('catalogMessager.update.reply', (event) => {
      callback()
    })
    ipcRenderer.send('catalogMessager.update', data)
  },
  delete: (data, callback) => {
    ipcRenderer.once('catalogMessager.delete.reply', (event) => {
      callback()
    })
    ipcRenderer.send('catalogMessager.delete', data)
  }
}

const searcherMessager = {
  add: (data, callback) => {},
  update: (data, callback) => {},
  delete: (data, callback) => {},
  all: (condition, callback) => {}
}

const electron = {
  demo: demo,
  noteMessager: noteMessager,
  catalogMessager: catalogMessager,
  searcherMessager: searcherMessager
}

export default electron
