function $get() {
  return new Promise((resolve, reject) => {
    var xhr = new XMLHttpRequest();
    xhr.open();
    xhr.send();
    xhr.onreadystatechange = function () {
      if (xhr.readyState == 4 && xhr.status == 200) {
        console.log(xhr.responseText);
        resolve(xhr.responseText)
      }
    }
  })
}

function $post(url,data) {
  return new Promise((resolve, reject) => {
    var xhr = new XMLHttpRequest();
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhr.open('post', url);
    xhr.send(data);
    xhr.onreadystatechange = function () {
      if (xhr.readyState == 4 && xhr.status == 200) {
        console.log(xhr.responseText);
        resolve(xhr.responseText)
      }
    };
  })
}