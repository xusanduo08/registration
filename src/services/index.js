import { extend } from "umi-request";

const request = extend({

})

export function regist(data) {
  // return request({
  //   url: '/regist',
  //   method: 'POST',
  //   data,
  // })

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve({
        code: '200',
        resultCode: '1'
      })
    }, 500);
  })
}

export function upload(data) {
  return request();
}
