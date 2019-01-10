import Vue from 'vue'

// 重新生成目录结构
function reGenerateCatalog (state, change) {
  // change: {type: '', catalog: {}} 发生变更的目录
  console.log('change', change)
  // 新建子目录
  function _add (parent) {
    console.log('parent', parent)
    if (parent['id'] === change.catalog.parent_id) {
      parent['children'].push({...change.catalog})
      return true
    }
    let children = parent['children']
    for (let index in children) {
      if (_add(children[index])) {
        return false
      }
    }
    return false
  }
  // 更新目录
  function _updateSelf (parent) {
    console.log('parent', parent)
    if (parent['id'] === change.catalog.id) {
      parent['label'] = change.catalog.label
      return true
    }
    let children = parent['children']
    for (let index in children) {
      if (_updateSelf(children[index])) {
        return false
      }
    }
    return false
  }
  // 更新目录的归属目录
  function _updateParent (parent) {

  }
  // 删除目录
  function _delete (parent) {
    console.log('parent', parent)
    if (parent['id'] === change.catalog.id) {
      return true
    }
    let children = parent['children']
    for (let index in children) {
      if (_delete(children[index])) {
        children.splice(index, 1)
        return false
      }
    }
    return false
  }
  // top为顶级目录
  let top = state.catalog[0]
  switch (change.type) {
    case 'add':
      _add(top)
      break
    case 'updateSelf':
      _updateSelf(top)
      break
    case 'updateParent':
      _updateParent(top)
      break
    case 'delete':
      _delete(top)
      break
    default:
  }
}

const mutations = {
  // 重新生成目录结构
  reGenerateCatalog (state, payload) {
    if (payload) {
      reGenerateCatalog(state, payload)
    }
  },
  // 重置全局目录结构
  resetCatalog (state, payload) {
    console.log('resetCatalog: ', payload)
    if (payload && payload.catalog) {
      // 浅拷贝
      state.catalog = [...payload.catalog]
    }
    if (payload && payload.catalogKv) {
      state.catalogKv = {...payload.catalogKv}
    }
  },
  // 新建笔记
  addNote (state, payload) {
    console.log('addNote: ', payload)
    if (payload && payload.newNote) {
      state.activeCatalog.children.push({...payload.newNote})
    }
  },
  // 更新笔记
  updateNote (state, payload) {
    console.log('updateNote: ', payload)
    if (payload && payload.note) {
      state.activeNote = {...payload.note}
    }
  },
  // 设置当前目录
  activeCatalog (state, payload) {
    console.log('activeCatalog: ', payload)
    if (payload && payload.catalog) {
      state.activeCatalog = {...payload.catalog}
    }
  },
  // 设置当前笔记
  activeNote (state, payload) {
    console.log('activeNote: ', payload)
    if (payload && payload.note) {
      state.activeNote = {...payload.note}
    }
  },
  // 取消设置当前笔记
  deactivateNote (state) {
    state.activeNote = {}
  },
  // 选择节点
  selectNode (state, payload) {
    if (payload && payload.node) {
      state.selectedNode = {...payload.node}
    }
  },
  // 删除节点
  deleteNode (state) {
    state.selectedNode = {}
  },
  // 设置弹窗显示/隐藏
  show (state, payload) {
    if (payload && payload.key) {
      Vue.set(state.show, payload.key, payload.value)
      console.log('show:', payload.key, payload.value)
    }
  },
  // 设置更新对象
  update (state, payload) {
    if (payload && payload.key) {
      Vue.set(state.update, payload.key, payload.value)
      console.log('update:', payload.key, payload.value)
    }
  }
}

export default mutations
