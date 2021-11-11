import request from 'src/request/index'

class TableApi implements CRUDApi {
  constructor(private readonly path: string) { }
  create(body: any) {
    return request({
      url: `${this.path}`,
      method: 'post',
      data: body
    })
  }
  update(body: any) {
    return request({
      url: `${this.path}/${body.id}`,
      method: "patch",
      data: body
    })
  }
  find(querys: any) {
    return request({
      url: `${this.path}`,
      method: 'get',
      params: querys
    })
  }
  delete(id: string) {
    return request({
      url: `${this.path}/${id}`,
      method: 'delete',
    })
  }
  findOne(id: string) {
    return request({
      url: `${this.path}/${id}`,
      method: 'get',
    })
  }
  createTable(id: string) {
    return request({
      url: `${this.path}/create-table/${id}`,
      method: 'get',
    })
  }
  findTable(tableName: string) {
    return request({
      url: `${this.path}/find-table/${tableName}`,
      method: 'get',
    })
  }
}

const tableApi = new TableApi('custom-table');

export default tableApi;