export function PARSE(texts, files) {
  var story = [];
  var filtered = texts
    .replace(/\n/g, "")
    .split("***")
    .filter(function(el) {
      return el !== "";
    });

  filtered.forEach(element => {
    if (element === "[media]") {
      story.push(files[0]);
      files.pop();
    } else {
      story.push(element);
    }
  });

  return story;
}
