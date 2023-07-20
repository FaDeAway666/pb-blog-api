import EnvVars from '@src/constants/EnvVars';

// 生成uuid
export function uuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c == 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export function getHostIP() {
  console.log(process.env.HOST, process.env.PORT);
  return `http://${process.env.HOST || 'localhost'}:${
    process.env.PORT || '3001'
  }`;
}
