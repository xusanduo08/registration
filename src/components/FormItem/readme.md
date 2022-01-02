
## 使用

自定义hook

|参数 | 说明 |类型| 默认值|
|-----|-----|-----| ----- |
|label|控件名 |object| null |
|onValueChange|输入值变化时的响应函数|function|null|
|required | 是否必填 | boolean| false |
|validator |校验器|(value, callback) => {}| null |
|formItemProps |控件属性 | object| {} |
|uploadUrl|上传地址|String| null |
|beforeUploadValidator |文件在上传前的校验器 | function| (file, callback) => {}|
|onSuccess |文件在上传成功后的回调| function |(fileInfo) => {}|

返回值: `[ReactElemennt, validate(function), value]`

目前支持input、Upload、Datepicker（使用antd的实现）控件，控件类型可继续扩展
