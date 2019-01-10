const state = {
  // 目录结构
  catalog: [{id: -1, label: '我的文件夹', children: []}],
  // 目录结构的kv值
  catalogKv: {'-1': '0'},
  // 当前目录
  activeCatalog: {id: -1, label: '我的文件夹', children: []},
  // 当前笔记
  activeNote: {},
  // 当前选中进行操作的节点
  selectedNode: {},
  // 控制显示
  show: {
    catalogMenu: false,
    deleteDialog: false,
    renameDialog: false,
    changeCatalogDialog: false
  },
  // 更新目录
  update: {}
}

export default state
