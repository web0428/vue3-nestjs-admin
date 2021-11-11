import request from 'src/request/index'

class UploadApi {
  upload(body: any) {
    return request({
      url: "/upload",
      method: "post",
      data: body,
    })
  }
}

export const uploadApi = new UploadApi();