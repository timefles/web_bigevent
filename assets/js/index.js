$(function () {
  // 调用 getUserInfo 函数获取用户基本信息
  getUserInfo();

  // 获取layer
  const layer = layui.layer;
  $("#btnLogout").click(() => {
    layer.confirm("确认是否退出", { icon: 3, title: "" }, function (index) {
      localStorage.removeItem("token");
      location.href = "/login.html";
    });
  });
});

const layer = layui.layer;

// 获取用户基本信息
function getUserInfo() {
  $.ajax({
    type: "GET",
    url: "/my/userinfo",
    headers: {
      Authorization: localStorage.getItem("token"),
    },
    success: (res) => {
      console.log(res);
      if (res.status !== 0) return layer.msg("数据请求失败！");
      layer.msg("获取用户信息成功!");
      // 调用 renderAvatar 渲染用户头像
      renderAvatar(res.data);
    },
    complete: (res) => {
      console.log(res);
      if (
        res.responseJSON.status === 1 &&
        res.responseJSON.message === "请求身份认证失败"
      ) {
        //  强制清空 token
        localStorage.removeItem("token");
        // 强制跳转到登录页面
        location.href = "/login.html";
      }
    },
  });
}

// 渲染用户头像
const renderAvatar = (user) => {
  // 获取用户名字
  const name = user.nickname || user.username;
  // 设置欢迎文本
  $("#welcome").html(`欢迎 ${name}`);
  // 按需渲染用户头像
  if (user.user_pic !== null) {
    // 渲染图片头像
    $(".layui-nav-img").attr("src", user.user_pic).show();
    $(".text-avatar").hide();
  } else {
    // 渲染文本头像
    $(".layui-nav-img").hide();
    const firstName = name[0].toUpperCase();
    $(".text-avatar").html(firstName);
  }
};
