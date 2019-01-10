const path = require('path')
const fs = require('fs')
const events = require('events')
const { MongoClient, ObjectID } = require('mongodb')
const mongodbUrl = 'mongodb://localhost:27017'
const dbName = 'note'

const catalogFile = path.resolve(__dirname, 'catalog.json')
const catalogKvFile = path.resolve(__dirname, 'catalog.kv.json')

const reply = function (callback) {
  var myEvent = new events.EventEmitter()
  myEvent.on('reply', callback)
  return myEvent
}

const emitReply = function (myEvent) {
  myEvent.emit('reply')
}

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
    var newNote = JSON.parse(note)
    MongoClient.connect(mongodbUrl, {useNewUrlParser: true}, function (err, client) {
      if (err) {
        throw err
      }
      console.log('连接数据库成功')
      var dbase = client.db(dbName)
      dbase.collection('note').insertOne(newNote, function (err, res) {
        if (err) {
          throw err
        }
        console.log('添加笔记成功')
        client.close()
        newNote.id = newNote._id.toHexString()
        delete newNote._id
        event.sender.send('noteMessager.add.reply', newNote.id)
      })
    })
  })
  // 更新笔记
  ipcMain.on('noteMessager.update', (event, note) => {
    console.log(note)
    var newNote = JSON.parse(note)
    delete newNote.id
    delete newNote.isNote
    MongoClient.connect(mongodbUrl, {useNewUrlParser: true}, function (err, client) {
      if (err) {
        throw err
      }
      console.log('连接数据库成功')
      var dbase = client.db(dbName)
      dbase.collection('note').updateOne({'_id': ObjectID(newNote.id)}, {$set: newNote}, function (err, res) {
        if (err) {
          throw err
        }
        console.log('更新笔记成功')
        client.close()
        event.sender.send('noteMessager.update.reply')
      })
    })
  })
  // 删除笔记
  ipcMain.on('noteMessager.delete', (event, note) => {
    console.log(note)
    MongoClient.connect(mongodbUrl, {useNewUrlParser: true}, function (err, client) {
      if (err) {
        throw err
      }
      console.log('连接数据库成功')
      var dbase = client.db(dbName)
      dbase.collection('note').deleteOne({'_id': ObjectID(JSON.parse(note).id)}, function (err, obj) {
        if (err) {
          throw err
        }
        console.log('删除笔记成功')
        client.close()
        event.sender.send('noteMessager.delete.reply')
      })
    })
  })
  // 根据目录读取
  ipcMain.on('noteMessager.findAllByCatalogId', (event, catelogId) => {
    console.log('find notes by catalogId: ', catelogId)
    MongoClient.connect(mongodbUrl, {useNewUrlParser: true}, function (err, client) {
      if (err) {
        throw err
      }
      console.log('连接数据库成功')
      var dbase = client.db(dbName)
      dbase.collection('note').find({'catalog_id': catelogId}).toArray(function (err, result) {
        if (err) {
          throw err
        }
        console.log('查询笔记成功')
        client.close()
        result.forEach((item, index) => {
          result[index]['id'] = item['_id'].toHexString()
          result[index]['title'] = item['label']
          delete result[index]['_id']
          delete result[index]['label']
        })
        console.log(result)
        event.sender.send('noteMessager.findAllByCatalogId.reply', JSON.stringify(result))
      })
    })
  })

  // 初始化全局目录结构
  ipcMain.on('catalogMessager.initCatalog', (event) => {
    var data = {}
    const myEvent = reply(function () {
      if (Object.keys(data).length === 2) {
        console.log('initCatalog:', data)
        event.sender.send('catalogMessager.initCatalog.reply', JSON.stringify(data))
      }
      if (Object.keys(data).length === 0) {
        event.sender.send('catalogMessager.initCatalog.reply')
      }
    })
    fs.readFile(catalogFile, function (err, catalog) {
      if (err) {
        // data.catalog = [{id: -1, label: '我的文件夹', children: []}]
      } else {
        data.catalog = JSON.parse(catalog)
      }
      emitReply(myEvent)
    })
    fs.readFile(catalogKvFile, function (err, catalogKv) {
      if (err) {
        // data.catalogKv = {'-1': '0'}
      } else {
        data.catalogKv = JSON.parse(catalogKv)
      }
      emitReply(myEvent)
    })
  })
  // 更新全局目录结构
  ipcMain.on('catalogMessager.updateCatalog', (event, data) => {
    var count = 0
    const myEvent = reply(function () {
      if (count === 2) {
        event.sender.send('catalogMessager.updateCatalog.reply')
      }
    })
    const newData = JSON.parse(data)
    if (newData && newData.catalog) {
      fs.writeFile(catalogFile, JSON.stringify(newData.catalog), function (err) {
        if (err) {
          console.log('updateCatalog:', err)
        } else {
          count++
          emitReply(myEvent)
        }
      })
    }
    if (newData && newData.catalogKv) {
      fs.writeFile(catalogKvFile, JSON.stringify(newData.catalogKv), function (err) {
        if (err) {
          console.log('updateCatalog:', err)
        } else {
          count++
          emitReply(myEvent)
        }
      })
    }
  })
  // 新目录入库
  ipcMain.on('catalogMessager.add', (event, catalog) => {
    console.log(catalog)
    var newCatalog = JSON.parse(catalog)
    MongoClient.connect(mongodbUrl, {useNewUrlParser: true}, function (err, client) {
      if (err) {
        throw err
      }
      console.log('连接数据库成功')
      var dbase = client.db(dbName)
      dbase.collection('catalog').insertOne(newCatalog, function (err, res) {
        if (err) {
          throw err
        }
        console.log('添加目录成功')
        client.close()
        event.sender.send('catalogMessager.add.reply', newCatalog._id.toString())
      })
    })
  })
  // @todo: 更新目录
  ipcMain.on('catalogMessager.update', (event, catalog) => {
    console.log(catalog)
    event.sender.send('catalogMessager.update.reply')
  })
  // @todo: 删除目录
  ipcMain.on('catalogMessager.delete', (event, catalog) => {
    console.log(catalog)
    event.sender.send('catalogMessager.delete.reply')
  })
}
