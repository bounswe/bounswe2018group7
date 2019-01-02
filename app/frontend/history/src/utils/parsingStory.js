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
      console.log("files[0] :", files[0]);
      story.push(files[0]);
      files.shift();
    } else {
      story.push(element);
    }
  });

  return story;
}
