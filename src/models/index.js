import get from 'lodash/get';
import { regist, login, qrySubsList } from '../services';
export default {
  namespace: 'regist',
  state: {
    subsList: [], // 用户列表
  },
  effects: {
    *regist({ payload }, { call }) {
      const result = yield call(regist, payload);
      if (result.resultCode === '1') {
        return true;
      }
      return false;
    },
    *login({ payload }, { call }) {
      const result = yield call(login, payload);
      if (result.resultCode === '1') {
        return true;
      }

      return false;
    },
    *qrySubsList({ payload }, { call, put }) {
      const result = yield call(qrySubsList, payload);
      if (result.resultCode === '1') {
        const data = get(result, 'data');
        yield put({
          type: 'save',
          payload: { subsList: data },
        });
        return true;
      }
      return false;
    },
  },

  reducers: {
    save(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
  },
};
