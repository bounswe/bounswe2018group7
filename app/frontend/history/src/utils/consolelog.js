export function clNormal(text, param) {
  text = text + " => ";
  console.log("%c" + text, "background: black; color: white", param);
}

export function clSuccess(text, param) {
  text = text + " => ";
  console.log("%c" + text, "background: green; color: white", param);
}

export function clWarning(text, param) {
  text = text + " => ";
  console.log("%c" + text, "background: yellow; color: white", param);
}
export function clError(text, param) {
  text = text + " => ";
  console.log("%c" + text, "background: red; color: white", param);
}
