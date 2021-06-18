let canMessage = true;
const message = function (msg) {
  let options = {
    msg: msg,
    postion: 'top',
    time: 3000
  };
  if (canMessage) {
    canMessage = false;
    let para = document.createElement('div');
    para.classList.add('messageBox');
    para.innerHTML = msg;
    document.body.appendChild(para);
    setTimeout(function () {
      canMessage = true;
      document.body.removeChild(para);
    }, options.time);
  }
};