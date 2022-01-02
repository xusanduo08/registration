import { history, Link } from 'umi';
import { JSEncrypt } from 'jsencrypt';
import { connect } from 'react-redux';
import { Spin } from 'antd';
import { publicKey } from '../../utils';
import { useFormItem } from '../../components';
import styles from './index.less';

function Login(props) {
  const { dispatch, loading } = props;
  const [userNameFormItem, userNameValidate, userName] = useFormItem({
    label: 'User Name',
    type: 'INPUT',
    required: true,
    formItemProps: { placeholder: 'Please input your name' },
  });

  const [pwdFormItem, pwdValidate, pwd] = useFormItem({
    label: 'Password',
    type: 'INPUT',
    required: true,
    formItemProps: { placeholder: 'Please input password', type: 'password' },
  });

  async function onSubmit() {
    if (userNameValidate() && pwdValidate()) {
      const encrypt = new JSEncrypt();
      encrypt.setPublicKey(publicKey);
      const encryptedPwd = encrypt.encrypt(pwd);
      const loginResult = await dispatch({
        type: 'regist/login',
        payload: { userName, pwd: encryptedPwd },
      });
      if (loginResult) {
        history.push('/dashboard');
      }
    }
  }

  return (
    <Spin spinning={loading}>
      <div className="app">
        <form>
          {userNameFormItem}
          {pwdFormItem}
          <span className={styles.goToRegist}>
            Don&apos;t have an account yet?
            <Link to="/regist">Create one</Link>
          </span>
          <div className="submit">
            <button type="button" onClick={onSubmit} disabled={false}>
              Submit
            </button>
          </div>
        </form>
      </div>
    </Spin>
  );
}

export default connect((state) => ({
  loading: state.loading.models.regist || false,
}))(Login);
