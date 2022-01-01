import { extend } from 'umi-request';

const request = extend({});

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
        resultCode: '1',
      });
    }, 500);
  });
}

export function login(data) {
  // return request({
  //   url: '/login',
  //   method: 'POST',
  //   data,
  // })
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve({
        code: '200',
        resultCode: '1',
      });
    }, 500);
  });
}

export function qryMenus(data) {
  return request({
    url: '/qryMenus',
    method: 'POST',
    data,
  });
}

export function qrySubsList(data) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve({
        code: '200',
        resultCode: '1',
        data: [
          {
            key: '1',
            name: 'John Brown',
            dateOfBirth: 1041326099334,
            appointmentTime: 1231233305195,
            address: 'New York No. 1 Lake Park',
          },
          {
            key: '2',
            name: 'Jim Green',
            dateOfBirth: 1041326099334,
            appointmentTime: 1231233305195,
            address: 'London No. 1 Lake Park',
          },
          {
            key: '3',
            name: 'Joe Black',
            dateOfBirth: 1041326099334,
            appointmentTime: 1231233305195,
            address: 'Sidney No. 1 Lake Park',
          },
        ],
      });
    }, 500);
  });
}
