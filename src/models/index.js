import { regist, upload } from '../services'
export default {
  namespace: 'regist',
  state: {},
  effects: {
    *regist({ payload }, { call }) {
      console.log(payload);
      const result = yield call(regist, payload);
      console.log(result);
      if (result.resultCode === '1') {
        return true;
      }
      return false;
    }
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
