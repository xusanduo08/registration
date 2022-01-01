import { history } from 'umi';
import { useFormItem } from '../../components';
import styles from './index.less';

function Login() {
  const [userNameFormItem, userNameValidate, userName] = useFormItem({
    label: 'User Name',
    type: 'INPUT',
    required: true,
    formItemProps: { placeholder: 'Please input your name' },
    validator: (value, callback) => {
      if (value && value.length > 10) {
        callback('Please input normal name!');
        return false;
      }
      return true;
    },
  });

  const [pwdFormItem, pwdValidate, pwd] = useFormItem({
    label: 'Password',
    type: 'INPUT',
    required: true,
    formItemProps: { placeholder: 'Please input password' },
    validator: (value, callback) => {
      if (value && value.length > 10) {
        callback('Please input normal name!');
        return false;
      }
      return true;
    },
  });

  function onSubmit() {
    history.push('/regist');
  }

  return (
    <div className="app">
      <form>
        {userNameFormItem}
        {pwdFormItem}

        <div className={styles.submit}>
          <button type="button" onClick={onSubmit} disabled={false}>
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}

export default Login;
