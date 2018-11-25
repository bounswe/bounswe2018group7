export function PARSE(text) {
  var res = text.replace(/\n/g, "").split("***");
  var filtered = res.filter(function(el) {
    return el != "";
  });

  return filtered;
}
