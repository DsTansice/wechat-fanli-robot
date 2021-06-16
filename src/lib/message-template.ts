/**
 * Message template
 */
export function template(msg: string) {
  switch (msg.toLowerCase()) {
    case 'ding':
      return 'dong';
    default:
      return '有什么可以帮助你的';
  }
};
