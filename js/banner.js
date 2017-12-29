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