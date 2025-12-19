// 获取canvas元素
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
let fontSize = 60;

// 加载背景图
const backgroundImage = new Image();
backgroundImage.onload = () => {
    console.log("[Background] Ready");
};
backgroundImage.src = "bg.png";

// 配置常量
const GRAVITY = 0.003; // 重力加速度%
const GROUND_Y = 0.8; // 地面Y坐标%
const MOVE_SPEED = 0.0035; // 移动速度%
const ATTACK_DAMAGE = 15; // 攻击伤害
const keys = {
    // P1 keys
    a: { pressed: false },
    d: { pressed: false },
    // P2 keys
    ArrowLeft: { pressed: false },
    ArrowRight: { pressed: false },
};
// 键盘事件处理器 (需要保存引用以便后续移除)
const keydownHandler = (event) => {
    switch (event.key) {
        // P1
        case "a":
            keys.a.pressed = true;
            player1.velocity.x = -MOVE_SPEED;
            player1.direction = "Left";
            break;
        case "d":
            keys.d.pressed = true;
            player1.velocity.x = MOVE_SPEED;
            player1.direction = "Right";
            break;
        case "w":
            player1.jump();
            break;
        case "f":
            player1.attack();
            break;
        case "ArrowLeft":
            keys.ArrowLeft.pressed = true;
            player2.velocity.x = -MOVE_SPEED;
            player2.direction = "Left";
            break;
        case "ArrowRight":
            keys.ArrowRight.pressed = true;
            player2.velocity.x = MOVE_SPEED;
            player2.direction = "Right";
            break;
        case "ArrowUp":
            player2.jump();
            break;
        case "Enter":
            player2.attack();
            break;
    }
};
const keyupHandler = (event) => {
    switch (event.key) {
        // P1
        case "a":
            keys.a.pressed = false;
            player1.velocity.x = keys.d.pressed ? MOVE_SPEED : 0; // 如果d键还在按，继续向右移动
            player1.direction = keys.d.pressed ? "Right" : "Left";
            break;
        case "d":
            keys.d.pressed = false;
            player1.velocity.x = keys.a.pressed ? -MOVE_SPEED : 0; // 如果a键还在按，继续向左移动
            player1.direction = keys.a.pressed ? "Left" : "Right";
            break;
        // P2
        case "ArrowLeft":
            keys.ArrowLeft.pressed = false;
            player2.velocity.x = keys.ArrowRight.pressed ? MOVE_SPEED : 0;
            player2.direction = keys.ArrowRight.pressed ? "Right" : "Left";
            break;
        case "ArrowRight":
            keys.ArrowRight.pressed = false;
            player2.velocity.x = keys.ArrowLeft.pressed ? -MOVE_SPEED : 0;
            player2.direction = keys.ArrowLeft.pressed ? "Left" : "Right";
            break;
    }
};

// 对局数据变量
let gameTimer = 60; // 倒计时
let animationId; // 游戏循环 ID
let player1; // 玩家实例
let player2;

// 角色类定义
class Player {
    constructor({ position, color, direction }) {
        this.health = 100; // 血量
        this.position = position; // {x, y} 位置向量%
        this.velocity = { x: 0, y: 0 }; // {x, y} 速度向量%
        this.width = 0.05; // 初始化宽度%
        this.height = 0.2; // 初始化高度%
        this.color = color; // 颜色
        this.direction = direction; // 人物朝向
        this.isJumping = true; // 跳跃状态
        this.isAttacking = false; // 攻击状态
        this.attackCD = false; // 攻击冷却
        this.attackBox = {
            width: 0.025,
            height: 0.05,
        };

        // log for debug
        console.log("[Player] Created", this);
    }

    draw() {
        // 用矩形代替角色
        ctx.fillStyle = this.color;
        ctx.fillRect(
            this.position.x * canvas.width,
            this.position.y * canvas.height,
            this.width * canvas.width,
            this.height * canvas.height,
        );

        // 绘制攻击框
        if (this.isAttacking) {
            ctx.fillRect(
                this.direction == "Right"
                    ? (this.position.x + this.width) * canvas.width
                    : (this.position.x - this.attackBox.width) * canvas.width,
                (this.position.y + this.attackBox.height) * canvas.height,
                this.attackBox.width * canvas.width,
                this.attackBox.height * canvas.height,
            );
        }
    }

    jump() {
        if (this.isJumping === false) {
            this.velocity.y -= MOVE_SPEED * 12;
            this.isJumping = true;
        }
    }

    attack() {
        if (this.attackCD) return; // 冷却中直接返回

        this.isAttacking = true;
        this.attackCD = true;

        setTimeout(() => {
            this.isAttacking = false;
        }, 200); // 攻击持续200ms

        setTimeout(() => {
            this.attackCD = false;
        }, 500); // 攻击冷却500ms
    }

    update() {
        // 更新位置
        this.draw();

        // 重力与地面碰撞逻辑
        if (this.position.y + this.height + this.velocity.y >= GROUND_Y) {
            // 如果到达了地面
            this.velocity.y = 0; // 停止下落
            this.position.y = GROUND_Y - this.height; // 确保站在地面
            this.isJumping = false; // 落地后允许再次跳跃
        } else {
            // 在空中
            this.velocity.y += GRAVITY; // 施加重力
            this.position.y += this.velocity.y; // 应用垂直速度
        }

        // 水平移动逻辑
        this.position.x += this.velocity.x;
        // 边界限制
        if (this.position.x < 0) this.position.x = 0;
        if (this.position.x > 1 - this.width) this.position.x = 1 - this.width;
    }
}

// 窗口自适应
function resizeCanvas() {
    // 修改画布大小和字体大小以适应实际窗口大小
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    fontSize = canvas.width * 0.035 + 25; // 25px + 3.5%画布宽度

    // log for debug
    console.log("[Canvas] Resized");
}

// 渲染逻辑
function draw() {
    // 绘制灰色背景
    ctx.fillStyle = "#333";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    // 覆盖图片背景 (拉伸到全屏)
    ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);

    // 绘制UI (HUD)
    const barWidth = canvas.width * 0.35; // 血量条宽度取画布宽度的35%
    const barHeight = 30; // 血量条固定高度
    const margin = 50; //元素间距

    // 倒计时 (居中)
    ctx.fillStyle = "#fff"; // 白色填充
    ctx.strokeStyle = "#000"; // 黑色描边
    ctx.lineWidth = 8; // 设置描边线条宽度
    ctx.font = "bold " + fontSize + "px Arial"; // 字体加粗
    ctx.textAlign = "center"; // 文字居中

    ctx.strokeText(gameTimer, canvas.width / 2, margin + fontSize / 2);
    ctx.fillText(gameTimer, canvas.width / 2, margin + fontSize / 2);

    // 血量条 (顶部两边)
    const p1Width = Math.max(0, (player1.health / 100) * barWidth); // 使用 Math.max 确保血量不会计算出负宽度
    const p2Width = Math.max(0, (player2.health / 100) * barWidth);
    const p2X = canvas.width - margin - barWidth; // P2右对齐
    const p2FillX = p2X + barWidth - p2Width;

    ctx.fillStyle = "rgba(0,0,0,0.5)"; // 血量条背景 (半透明黑色)
    ctx.fillRect(margin, margin, barWidth, barHeight); // P1
    ctx.fillRect(p2X, margin, barWidth, barHeight); // P2

    ctx.strokeStyle = "#000"; // 血量条边框 (黑色)
    ctx.lineWidth = 3; // 边框加粗
    ctx.strokeRect(margin, margin, barWidth, barHeight); // P1
    ctx.strokeRect(p2X, margin, barWidth, barHeight); // P2

    ctx.fillStyle = "#ff3333"; // P1血量条填充色 (红色)
    ctx.fillRect(margin, margin, p1Width, barHeight);
    ctx.fillStyle = "#3366ff"; // P2血量条填充色 (蓝色)
    ctx.fillRect(p2FillX, margin, p2Width, barHeight);
}

// 通用 AABB 碰撞检测逻辑
function checkCollision(attacker, defender) {
    // 获取 attacker 的攻击框位置（需考虑朝向）
    const r1AttackX =
        attacker.direction === "Right"
            ? attacker.position.x + attacker.width
            : attacker.position.x - attacker.attackBox.width;

    const r1AttackY = attacker.position.y + attacker.attackBox.height; // 攻击框下边界

    return (
        r1AttackX + attacker.attackBox.width >= defender.position.x && // 攻击框右边界 >= 防御者左边界
        r1AttackX <= defender.position.x + defender.width && // 攻击框左边界 <= 防御者右边界
        r1AttackY + attacker.attackBox.height >= defender.position.y && // 攻击框下边界 >= 防御者上边界
        r1AttackY <= defender.position.y + defender.height // 攻击框上边界 <= 防御者下边界
    );
}

// 实例化两个玩家
function initPlayers() {
    player1 = new Player({
        position: { x: 0.2, y: 0.15 }, // 从空中出生
        color: "red",
        direction: "Right",
    });

    player2 = new Player({
        position: { x: 0.8 - 0.05, y: 0.15 }, // 减去玩家宽度确保对齐
        color: "blue",
        direction: "Left",
    });
}

// 游戏主循环
function animate() {
    animationId = requestAnimationFrame(animate); // 由浏览器自动循环

    // 绘制背景 && HUD
    draw();

    // 更新角色
    player1.update();
    player2.update();

    // 1. 检测 Player 1 攻击 Player 2
    if (player1.isAttacking && checkCollision(player1, player2)) {
        player2.health -= ATTACK_DAMAGE; // 扣血
        player1.isAttacking = false; // 关键：命中后立即关闭攻击状态，防止一帧内多次触发伤害
        console.log("P1 Hit P2!");
    }
    // 2. 检测 Player 2 攻击 Player 1
    if (player2.isAttacking && checkCollision(player2, player1)) {
        player1.health -= ATTACK_DAMAGE;
        player2.isAttacking = false;
        console.log("P2 Hit P1!");
    }

    if (player1.health <= 0 || player2.health <= 0) {
        draw(); // 刷新一次UI确保血量归零
        endGame(); // 结束游戏
    }
}

// 游戏结束
function endGame() {
    console.log("[Game] Game Over");

    // 清理定时器和事件监听器
    clearInterval(timerInterval);
    window.removeEventListener("keydown", keydownHandler);
    window.removeEventListener("keyup", keyupHandler);

    // 停止游戏循环
    cancelAnimationFrame(animationId);

    // 结算
    let result;
    if (player1.health != player2.health) {
        result =
            "Winner: " + (player1.health > player2.health ? "Player 1" : "Player 2");
    } else {
        result = "Tie!";
    }

    // 绘制结束画面
    ctx.fillStyle = "rgba(0,0,0,0.7)"; // 半透明黑色遮罩
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#fff";
    ctx.font = "bold " + fontSize * 1.5 + "px Arial"; // 字体放大1.5倍
    ctx.textAlign = "center";
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 8;
    ctx.strokeText("Game Over!", canvas.width / 2, canvas.height / 2);
    ctx.fillText("Game Over!", canvas.width / 2, canvas.height / 2);

    // 显示胜者
    ctx.font = "bold " + fontSize * 2 + "px Arial"; // 字体放大2倍
    ctx.textAlign = "center";
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 8;
    ctx.strokeText(result, canvas.width / 2, canvas.height / 2 + fontSize * 2);
    ctx.fillText(result, canvas.width / 2, canvas.height / 2 + fontSize * 2);
}

// 初始化调整大小
resizeCanvas();

// 监听窗口大小变化事件 -> 自动调整画布
window.addEventListener("resize", resizeCanvas);

// 启动游戏
initPlayers();
animate();

// 监听键盘事件
window.addEventListener("keydown", keydownHandler);
window.addEventListener("keyup", keyupHandler);

// 设定倒计时
const timerInterval = setInterval(() => {
    if (gameTimer > 0) {
        gameTimer--;
    } else {
        // 游戏结束
        gameTimer = "Times!";
        endGame();
    }
}, 1000);
