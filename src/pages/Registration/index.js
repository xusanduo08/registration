import { useState, useRef } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import { JSEncrypt } from 'jsencrypt';
import { history } from 'umi';
import { Spin, message } from 'antd';
import { get } from 'lodash';
import { useFormItem } from '../../components';
import { publicKey } from '../../utils';

function App(props) {
  const { dispatch, loading } = props;
  const [btnDisabled, setBtnDisabled] = useState(false);
  const firstPwd = useRef(); // 保存第一次输入的密码

  const [nameFormItem, nameValidate, name] = useFormItem({
    label: 'Name',
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
  const [dateOfBirthFormItem, dateOfBirthValidate, dateOfBirth] = useFormItem({
    label: 'Date of Birth',
    type: 'DATEPICKER',
    required: true,
    formItemProps: {
      placeholder: 'Please select your date of birth.',
      disabledDate: (current) => current > moment(),
    },
  });
  const [phoneNumberFormItem, phoneNumberValidate, phoneNumber] = useFormItem({
    label: 'Phone Number',
    type: 'INPUT',
    required: true,
    formItemProps: { placeholder: 'Please input your phone number.' },
    validator: (value, callback) => {
      if (
        !/^((13[0-9])|(14[5,7])|(15[0-3,5-9])|(17[0,3,5-8])|(18[0-9])|166|198|199|(147))\d{8}$/.test(
          value,
        )
      ) {
        callback('This phone number is invalid');
        return false;
      }
      return true;
    },
  });
  const [emailFormItem, emailValite, email] = useFormItem({
    label: 'Email',
    type: 'INPUT',
    required: true,
    formItemProps: { placeholder: 'Please input your email.' },
    validator: (value, callback) => {
      if (!/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(value)) {
        callback('Invalid email address.');
        return false;
      }
      return true;
    },
  });
  const [addressFormItem, addressValite, address] = useFormItem({
    label: 'Address',
    type: 'INPUT',
    required: true,
    formItemProps: { placeholder: 'Please input your address.' },
  });
  const [driveLicenseFormItem, driveLicenseValite, driveLicense] = useFormItem({
    label: 'Drive License',
    type: 'UPLOAD',
    required: true,
    formItemProps: {
      placeholder: 'Please upload your drive license.',
      accept: 'image/*, .heic',
    }, // heic为iPhone手机拍照格式
    uploadUrl: '/upload',
    beforeUploadValidator: (file) => {
      // 上传前的校验，返回true则继续上传至文件服务器，否则终止上传。value为一个file对象
      const { type } = file || {};
      const typeList = [
        'image/png',
        'image/jpeg',
        'image/jpg',
        'image/heic',
        'image/bmp',
        'image/tiff',
      ];
      if (typeList.indexOf(type) === -1) {
        return false;
      }
      return true;
    },
    onSuccess: () => {
      // 上传成功，返回文件的存储地址，以及文件的其他信息
      // { status: 'done', uid: '', name: '', attachUrl: '' }
    },
  });

  const [pwdFormItem, pwdvalidate, pwd] = useFormItem({
    label: 'Password',
    type: 'INPUT',
    required: true,
    formItemProps: {
      placeholder: 'Please input your password.',
      type: 'password',
    },
    onValueChange: (value) => {
      firstPwd.current = value;
    },
    validator: (value, callback) => {
      // 长度大于6，包含大些字母，包含小写字母，包含数字
      if (get(value, 'length') < 6) {
        callback("Password's length must over 6");
        return false;
      }
      if (!/[A-Z]+/.test(value)) {
        callback('Must contain an uppercase letter.');
        return false;
      }

      if (!/[a-z]+/.test(value)) {
        callback('Must contain a lowercase letter.');
        return false;
      }

      if (!/[0-9]+/.test(value)) {
        callback('Must contain a number.');
        return false;
      }

      return true;
    },
  });

  const [confirmPwdFormItem, confirmPwdvalidate] = useFormItem({
    label: 'Confirm Password',
    type: 'INPUT',
    required: true,
    formItemProps: { placeholder: 'Confirm your password.', type: 'password' },
    validator: (value, callback) => {
      if (value !== firstPwd.current) {
        callback('Password is not same.');
        return false;
      }

      return true;
    },
  });

  const [
    appointmentTimeFormItem,
    appointmentTimeValite,
    appointmentTime,
  ] = useFormItem({
    label: 'Appointment Time',
    type: 'DATEPICKER',
    required: true,
    formItemProps: {
      placeholder: 'Please select your appointment time.',
      disabledDate: (current) => current < moment(),
    },
  });

  async function onSubmit(e) {
    if (
      !nameValidate() ||
      !dateOfBirthValidate() ||
      !phoneNumberValidate() ||
      !emailValite() ||
      !addressValite() ||
      !driveLicenseValite() ||
      !appointmentTimeValite() ||
      !pwdvalidate() ||
      !confirmPwdvalidate()
    ) {
      return;
    }
    e.preventDefault();
    setBtnDisabled(true);
    const encrypt = new JSEncrypt();
    encrypt.setPublicKey(publicKey);
    const encryptedPwd = encrypt.encrypt(pwd);
    const registResult = await dispatch({
      type: 'regist/regist',
      payload: {
        name,
        dateOfBirth: moment(dateOfBirth).valueOf(),
        phoneNumber,
        email,
        address,
        driveLicense,
        appointmentTime: moment(appointmentTime).valueOf(),
        pwd: encryptedPwd,
      },
    });
    if (registResult) {
      // TODO 跳转登陆页面
      message
        .success('Regist successfully, redirect to login after 2s...', 2)
        .then(() => history.push('/login'));
    } else {
      setBtnDisabled(false);
    }
  }

  return (
    <Spin spinning={loading}>
      <div className="app">
        <form>
          {nameFormItem}
          {dateOfBirthFormItem}
          {phoneNumberFormItem}
          {emailFormItem}
          {addressFormItem}
          {driveLicenseFormItem}
          {appointmentTimeFormItem}
          {pwdFormItem}
          {confirmPwdFormItem}
          <div className="submit">
            <button type="button" onClick={onSubmit} disabled={btnDisabled}>
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
}))(App);
