import request from 'src/request/index'

class UserApi implements CRUDApi {
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
  login(body: any) {
    return request({
      url: 'user/login',
      method: 'post',
      data: body
    })
  }
}

const userApi = new UserApi('user');

export default userApi;