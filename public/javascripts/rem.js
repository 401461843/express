let deviceWidth = document.documentElement.clientWidth;

if (deviceWidth > 750) {
 deviceWidth = 750; 
}
document.documentElement.style.fontSize = deviceWidth / 750 * 100 + 'px';