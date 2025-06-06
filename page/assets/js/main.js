// 定义 iUp 对象
const iUp = (() => {
    let time = 0;
    const duration = 150;

    const clean = () => {
        time = 0;
    };

    const up = (element) => {
        setTimeout(() => {
            element.classList.add("up");
        }, time);
        time += duration;
    };

    const down = (element) => {
        element.classList.remove("up");
    };

    const toggle = (element) => {
        setTimeout(() => {
            element.classList.toggle("up");
        }, time);
        time += duration;
    };

    return {
        clean,
        up,
        down,
        toggle
    };
})();

// DOMContentLoaded 事件
document.addEventListener('DOMContentLoaded', () => {
    // 设置背景图片
    const panel = document.querySelector('#panel');
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    const screenRatio = screenWidth / screenHeight;

    let url;
    if (screenRatio > 1.5) {
        url = "https://art.lzzz.ink";
    } else {
        url = "https://art.lzzz.ink/m";
    }

    panel.style.background = `url('${url}') center center no-repeat #666`;
    panel.style.backgroundSize = "cover";

    // 获取图片数据
    const xhr = new XMLHttpRequest();
    xhr.onload = function () {
        if (this.status === 200) {
            const res = JSON.parse(this.responseText);
            document.getElementById('description').innerHTML = `${res.title}<br/><strong>「${res.copyright}」</strong>`;
        }
    };
    xhr.open("GET", "https://art.lzzz.ink/e", true);
    xhr.send();

    // 初始化点赞按钮
    const iUpElements = document.querySelectorAll(".iUp");
    iUpElements.forEach(element => {
        iUp.up(element);
    });

    // 图片加载完成后显示头像
    const avatarElement = document.querySelector(".js-avatar");
    avatarElement.addEventListener('load', () => {
        avatarElement.classList.add("show");
    });

    // 移动设备菜单按钮点击事件
    const btnMobileMenu = document.querySelector('.btn-mobile-menu__icon');
    const navigationWrapper = document.querySelector('.navigation-wrapper');

    btnMobileMenu.addEventListener('click', () => {
        navigationWrapper.classList.toggle('visible');
        navigationWrapper.classList.toggle('animated');
        navigationWrapper.classList.toggle('bounceInDown');
        btnMobileMenu.classList.toggle('icon-list');
        btnMobileMenu.classList.toggle('icon-angleup');
        btnMobileMenu.classList.toggle('fadeIn');
    });
});
