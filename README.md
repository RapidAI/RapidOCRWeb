<div align="center">
  <div align="center">
    <img src="https://github.com/RapidAI/RapidOCRWeb/releases/download/v0.0.0/RapidOCRWeb_LOGO.png"/>
  </div>
 <br/>
  <a href=""><img src="https://img.shields.io/badge/Python->=3.6-aff.svg"></a>
  <a href=""><img src="https://img.shields.io/badge/OS-Linux%2C%20Win%2C%20Mac-pink.svg"></a>
  <a href="https://pepy.tech/project/rapidocr_web"><img src="https://static.pepy.tech/personalized-badge/rapidocr_web?period=total&units=abbreviation&left_color=grey&right_color=blue&left_text=Downloads"></a>
  <a href="https://pypi.org/project/rapidocr_api/"><img alt="PyPI" src="https://img.shields.io/pypi/v/rapidocr_api"></a>
  <a href="https://choosealicense.com/licenses/apache-2.0/"><img src="https://img.shields.io/badge/License-Apache%202-dfd.svg"></a>
  <a href="https://semver.org/"><img alt="SemVer2.0" src="https://img.shields.io/badge/SemVer-2.0-brightgreen"></a>
  <a href="https://github.com/psf/black"><img src="https://img.shields.io/badge/code%20style-black-000000.svg"></a>

</div>

### 📖 简介

`rapidocr_web`是基于`rapidocr`库封装的web版OCR程序。它可以让小伙们快速在本地启动OCR服务，支持剪贴板、拖拽和选择图像文件上传识别，同时具有一键复制识别文本功能。

整体项目采用前后端分离设计：

- 前端：HTML + CSS + JavaScript
- 后端：Flask

UI来自Cursor，自适应移动端和PC端。相比于旧有版本（v0.x），现在版本（v1.x）更加现代化。

### 🛠️ 安装

```bash
pip install rapidocr_web
```

### 🚀 使用

```bash
rapidocr_web -ip 0.0.0.0 -p 9003
```

#### 浏览器打开 <http://localhost:9003/> ，enjoy it

> [!NOTE]
>
> 浏览器打开的网址是`http`的，不是`https`。

<div align="center">
            <img src="https://github.com/RapidAI/RapidOCR/releases/download/v1.1.0/rapidocr_web_demo.gif" width="100%" height="100%">
</div>

### 📚 文档

完整文档请移步：[docs](https://rapidai.github.io/RapidOCRDocs/main/install_usage/rapidocr_api/usage/)
