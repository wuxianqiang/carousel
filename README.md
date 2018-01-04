# 原生JS封装轮播图

写一个轮播图插件，我们必须先清楚的了解其原理，说到原理，其实就是通过修改一个元素的的left不断切换，但是为了实现无缝滚动，我们一般会会在最后多添加一张图片使其和第一张图片保持一样，当来到达最后一张时，瞬间切换成第一张，然后继续轮播即可。

### 开始封装

在页面中我们不仅仅只有一个轮播图，或许会有多个，所以我通过构造函数把轮播图封装成为一个方法，可以通过生成实例的方式来初始化轮播图

### 代码如下
```js
class Banner {
    constructor(className, data, isClick) {
        this.className = className;
        this.banner = document.getElementsByClassName(this.className)[0];
        this.bannerWrapper = this.banner.children[0];
        this.imgList = this.bannerWrapper.getElementsByTagName("img");
        this.focusWrapper = this.banner.children[1]
        this.liList = this.focusWrapper.getElementsByTagName("li");
        this.arrowWrapper = this.banner.children[2];
        this.arrowLeft = this.arrowWrapper.children[0];
        this.arrowRight = this.arrowWrapper.children[1];
        this.bannerWidth = this.banner.offsetWidth;
        this.timer = null;
        this.interval = 300;
        this.duration = 3000;
        this.step = 0;
        this.bindHtml(data);
        this.isOk = true;
        if (isClick) {
            this.mouseEvent().arrowEvent().focusEvent()
        }
        document.addEventListener("visibilitychange", () => {
            if (document.visibilityState === "hidden") {
                clearInterval(this.timer);
            } else {
                this.autoPlay();
            }
        })
    }

    bindHtml(data) {
        let str1 = '',
            str2 = '';
        for (let i = 0; i < data.length; i++) {
            let current = data[i];
            str1 +=
                    `
                    <li>
                        <a href="${current.linkUrl}">
                            <img src="" alt="" data-src="${current.picUrl}">
                        </a>
                    </li>
                    `;
            str2 += i === 0 ? '<li class="selected"></li>' : '<li></li>';
        }
        str1 +=
                `
                <li>
                    <a href="${data[0].linkUrl}">
                        <img src="" alt="" data-src="${data[0].picUrl}">
                    </a>
                </li>
                `;

        setCss(this.bannerWrapper, "width", this.bannerWidth * (data.length + 1));
        this.bannerWrapper.innerHTML = str1;
        this.focusWrapper.innerHTML = str2;
        this.lazyImg();
    }

    lazyImg() {
        for (const item of this.imgList) {
            let oImg = new Image;
            oImg.src = item.dataset.src;
            let _this = this;
            oImg.onload = function () {
                item.src = this.src;
                tween(item, {
                    opacity: 1
                }, _this.interval);
            }
        }
        this.autoPlay();
    }

    autoPlay() {
        this.timer = setInterval(() => {
            this.paly();
        }, this.duration);
    }

    paly() {
        if (this.isOk) {
            this.isOk = false;
            if (this.step === this.imgList.length - 1) {
                this.step = 0;
                setCss(this.bannerWrapper, "left", 0);
            }
            this.step++;
            this.animate();
        }
    }

    animate() {
        tween(this.bannerWrapper, {
            left: -this.step * this.bannerWidth
        }, this.interval, () => {
            this.isOk = true;
        });
        this.focusChange();
    }

    focusChange() {
        let temp = this.step === this.imgList.length - 1 ? 0 : this.step;
        for (let i = 0; i < this.liList.length; i++) {
            if (i === temp) {
                this.liList[i].className = "selected";
            } else {
                this.liList[i].className = "";
            }
        }
    }

    mouseEvent() {
        this.banner.onmouseenter = () => {
            this.arrowWrapper.style.display = "block"
            window.clearInterval(this.timer);
        };
        this.banner.onmouseleave = () => {
            this.arrowWrapper.style.display = "none"
            this.autoPlay();
        }
        return this;
    }

    arrowEvent() {
        this.arrowLeft.onclick = () => {
            if (this.isOk) {
                this.isOk = false;
                if (this.step === 0) {
                    this.step = this.imgList.length - 1;
                    setCss(this.bannerWrapper, "left", -this.step * this.bannerWidth);
                }
                this.step--;
                this.animate();
            }
        }
        this.arrowRight.onclick = () => {
            this.paly();
        }
        return this;
    }

    focusEvent() {
        for (let i = 0; i < this.liList.length; i++) {
            const current = this.liList[i];
            current.onclick = () => {
                if (this.isOk) {
                    this.isOk = false;
                    this.step = i;
                    tween(this.bannerWrapper, {
                        left: -this.step * this.bannerWidth
                    }, this.interval, () => {
                        this.isOk = true;
                    });
                    this.focusChange();
                }
            }
        }
    }
}
```

### 使用方法

由于我是按照自己的样式和结构写的，所以你在使用的时候也要按照结构写。我们可以通过实例的方式初始化轮播图，该方法接收三个参数，元素的类名，绑定的数据，轮播图是否可以手动切换。

```js
let banner = new Banner("banner", slider, true);
```
