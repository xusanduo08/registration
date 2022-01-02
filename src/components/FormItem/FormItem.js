import { useState, useMemo } from 'react';
import { DatePicker as AntdDatePicker, message, Spin } from 'antd';
import request from 'umi-request';
import get from 'lodash/get';
import logo from '../../assets/logo.svg';
import deleteLogo from '../../assets/delete.svg';
import pictureSvg from '../../assets/picture.svg';
import styles from './form.less';

// FormItem
// input/DatePicker/Upload

function useFormItem(params) {
  const {
    label,
    required = false,
    validator,
    formItemProps = {},
    beforeUploadValidator,
    onSuccess,
    uploadUrl,
  } = params || {};
  const [value, setValue] = useState(); // 保存控件值
  const [hasError, setHasError] = useState(params.hasError); // 控制控件状态（校验通过、不通过）
  const [info, setInfo] = useState(); // 有错误信息时控件需要展示的信息
  const [previewSrc, setPreviewSrc] = useState(); // 上传附件的展示地址
  const [uploadDisabled, setuploadDisabled] = useState(false); // 控制上传控件
  const [uploadLoading, setUploadLoading] = useState(false);

  function onValueChange(v) {
    setValue(v);
    setHasError(false);
    if (get(v, 'length') === 0 && required) {
      setHasError(true);
      setInfo(`${label} is required!.`);
    } else if (get(v, 'length') > 0) {
      if (validator && typeof validator === 'function') {
        validator(v, (errorInfo) => {
          setInfo(errorInfo);
          setHasError(true);
        });
      }
    }
  }

  function onFileUpload(e) {
    const file = e.target.files[0]; // 获取图片资源
    // 限制图片大小不超过5M
    if (get(file, 'size') > 1024 * 1024 * 5) {
      message.warning('Picture size > 5M, please another one. ');
      return;
    }
    if (
      beforeUploadValidator &&
      typeof beforeUploadValidator === 'function' &&
      beforeUploadValidator(file, (errorInfo) => {
        setInfo(errorInfo);
        setHasError(true);
      })
    ) {
      // 开始上传
      setPreviewSrc(pictureSvg); // 设置占位图片
      setUploadLoading(true);
      setuploadDisabled(true);
      const formData = new FormData();
      formData.append('file', file);
      request(uploadUrl, {
        method: 'post',
        data: formData,
        requestType: 'form',
      }).then(
        (resp) => {
          setUploadLoading(false);
          // 图片上传到这个地址 https://www.niupic.com/
          // 相应格式为
          // {status: "success", code: 200, data: "https://i.niupic.com/images/2021/12/30/9SE2.jpeg", msg: "上传成功!"}
          if (resp.status === 'success') {
            setHasError(false);
            if (onSuccess && typeof onSuccess === 'function') {
              onSuccess({ file, url: resp.data });
            }
            setValue({
              file: { name: get(file, 'name'), type: get(file, 'type') },
              url: resp.data,
            });
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onloadend = (event) => {
              const { result } = event.target;
              setPreviewSrc(result);
            };
          } else {
            // TODO 上传失败
            message.error('Upload fail, please try again later.');
            setPreviewSrc(null);
            setuploadDisabled(false);
          }
        },
        () => {
          setuploadDisabled(false);
          setUploadLoading(false);
        },
      );
    }
  }

  function deleteFile() {
    setPreviewSrc(null);
    setValue(null);
    setuploadDisabled(false);
  }

  // 校验方法，可以返回给外部调用
  function validate() {
    let validateResult = true;

    if (required && !value) {
      validateResult = false;
      setInfo(`${label} is required!.`);
      setHasError(true);
    } else if (validator && typeof validator === 'function') {
      validateResult = validator(value, (errorInfo) => {
        setInfo(errorInfo);
        setHasError(true);
      });
    } else {
      setHasError(false);
    }
    return validateResult;
  }

  // 控件类型可继续扩展，目前支持：输入框、日期、上传
  const formItemType = {
    INPUT: (
      <input
        onChange={(e) => onValueChange(get(e, 'target.value'))}
        {...formItemProps}
      />
    ),
    DATEPICKER: <AntdDatePicker onChange={onValueChange} {...formItemProps} />,
    UPLOAD: (
      <>
        <label className={styles.upload} disabled={uploadDisabled}>
          <input
            type="file"
            style={{ display: 'none' }}
            {...formItemProps}
            onChange={onFileUpload}
            disabled={uploadDisabled}
          />
          <div style={{ display: 'flex', color: '#666', marginTop: '13px' }}>
            <img
              src={logo}
              width="50%"
              style={{ marginBottom: '5px' }}
              alt=""
            />
            Upload
          </div>
        </label>
        {previewSrc && (
          <Spin spinning={uploadLoading}>
            <label className={styles.upload}>
              <img
                alt=""
                className={styles.delete}
                src={deleteLogo}
                onClick={deleteFile}
              />
              <img
                alt=""
                className={styles.preview}
                src={previewSrc}
                height="100%"
                width="100%"
              />
            </label>
          </Spin>
        )}
      </>
    ),
  };

  const formItem = useMemo(() => formItemType[params.type], [
    params.type,
    previewSrc,
  ]);
  return [
    <div className={`${styles.formItem} ${hasError ? styles.hasError : ''}`}>
      <div>
        <span className={styles.label}>{label}</span>
        {formItem}
      </div>
      {hasError && <span className={styles.info}>{info}</span>}
    </div>,
    validate,
    value,
  ];
}

export default useFormItem;
