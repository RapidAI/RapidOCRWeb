// RapidOCR Web App - 增强交互脚本
document.addEventListener('DOMContentLoaded', function() {
    // 初始化应用
    initApp();
});

function initApp() {
    // 添加上传区域的拖拽反馈
    const uploadArea = document.getElementById('uploadArea');
    const uploadContainer = document.getElementById('uploadContainer');

    if (uploadArea) {
        // 拖拽进入效果
        uploadArea.addEventListener('dragenter', function(e) {
            e.preventDefault();
            uploadArea.classList.add('dragging');
            uploadContainer.style.transform = 'scale(1.02)';
        });

        // 拖拽离开效果
        uploadArea.addEventListener('dragleave', function(e) {
            e.preventDefault();
            if (!uploadArea.contains(e.relatedTarget)) {
                uploadArea.classList.remove('dragging');
                uploadContainer.style.transform = 'scale(1)';
            }
        });

        // 拖拽结束效果
        uploadArea.addEventListener('drop', function(e) {
            e.preventDefault();
            uploadArea.classList.remove('dragging');
            uploadContainer.style.transform = 'scale(1)';
        });

        // 点击上传区域触发文件选择
        uploadArea.addEventListener('click', function(e) {
            if (e.target !== uploadArea.querySelector('.upload-btn')) {
                document.getElementById('rapid_ocr').click();
            }
        });
    }

        // 添加键盘快捷键支持
    document.addEventListener('keydown', function(e) {
        // Ctrl+V 粘贴图片
        if (e.ctrlKey && e.key === 'v') {
            console.log('粘贴快捷键触发');
        }

        // Ctrl+O 打开文件选择
        if (e.ctrlKey && e.key === 'o') {
            e.preventDefault();
            document.getElementById('rapid_ocr').click();
        }

        // Ctrl+C 复制所有识别结果
        if (e.ctrlKey && e.key === 'c') {
            const copyBtn = document.getElementById('copyAllBtn');
            if (copyBtn && copyBtn.style.display !== 'none') {
                e.preventDefault();
                if (typeof copyAllResults === 'function') {
                    copyAllResults();
                } else {
                    console.log('copyAllResults function not found');
                }
            }
        }
    });

    // 添加图片预览功能
    const fileInput = document.getElementById('rapid_ocr');
    if (fileInput) {
        fileInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                showImagePreview(file);
            }
        });
    }
}

// 显示图片预览
function showImagePreview(file) {
    const reader = new FileReader();
    reader.onload = function(e) {
        const img = document.getElementById('detect_img');
        if (img) {
            img.src = e.target.result;
            img.style.display = 'block';

            // 移除之前的尺寸设置
            img.removeAttribute('width');
            img.removeAttribute('height');

            // 添加图片加载完成后的处理
            img.onload = function() {
                adjustImageSizeAdaptive(this);
            };

            // 添加淡入动画
            img.style.opacity = '0';
            img.style.transition = 'opacity 0.3s ease';
            setTimeout(() => {
                img.style.opacity = '1';
            }, 10);
        }
    };
    reader.readAsDataURL(file);
}

// 增强的通知系统
function showEnhancedNotification(message, type = 'info', duration = 3000) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;

    const icon = type === 'error' ? 'exclamation-triangle' :
                 type === 'success' ? 'check-circle' : 'info-circle';

    notification.innerHTML = `
        <i class="fas fa-${icon}"></i>
        <span>${message}</span>
        <button class="notification-close" onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;

    document.body.appendChild(notification);

    // 显示动画
    setTimeout(() => notification.classList.add('show'), 100);

    // 自动隐藏
    if (duration > 0) {
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentElement) {
                    notification.parentElement.removeChild(notification);
                }
            }, 300);
        }, duration);
    }
}

// 添加表格行点击复制功能
function addTableCopyFeature() {
    const table = document.getElementById('locTable');
    if (table) {
        table.addEventListener('click', function(e) {
            const cell = e.target.closest('td');
            if (cell && cell.classList.contains('recognition-result')) {
                const text = cell.textContent.trim();
                if (text) {
                    navigator.clipboard.writeText(text).then(() => {
                        showEnhancedNotification('文本已复制到剪贴板', 'success', 2000);
                    }).catch(() => {
                        // 降级方案
                        const textArea = document.createElement('textarea');
                        textArea.value = text;
                        document.body.appendChild(textArea);
                        textArea.select();
                        document.execCommand('copy');
                        document.body.removeChild(textArea);
                        showEnhancedNotification('文本已复制到剪贴板', 'success', 2000);
                    });
                }
            }
        });
    }
}

// 旧的结果统计图表功能 - 已弃用，使用新的性能统计设计
function createStatsChart(detTime, clsTime, recTime) {
    // 此函数已不再使用，保留是为了向后兼容
    console.log('createStatsChart已弃用，使用新的性能统计设计');
}

// 添加图片缩放功能
function addImageZoom() {
    const imageContainer = document.querySelector('.image-container');
    const img = document.getElementById('detect_img');

    if (imageContainer && img) {
        console.log('初始化图片缩放功能');

        let isZoomed = false;
        let currentScale = 1;
        let translateX = 0, translateY = 0;

        // 点击缩放
        imageContainer.addEventListener('click', function(e) {
            console.log('点击事件触发');
            e.preventDefault();
            e.stopPropagation();

            if (isZoomed) {
                console.log('退出缩放');
                resetZoom();
            } else {
                console.log('进入缩放');
                enterZoom(e);
            }
        });

        // 鼠标滚轮缩放
        imageContainer.addEventListener('wheel', function(e) {
            console.log('滚轮事件触发');
            e.preventDefault();
            e.stopPropagation();

            if (!isZoomed) {
                enterZoom(e);
            }

            const delta = e.deltaY > 0 ? 0.9 : 1.1;
            const newScale = Math.max(0.5, Math.min(3, currentScale * delta));

            // 计算鼠标位置相对于图片的偏移
            const rect = img.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;

            // 计算新的变换原点
            const scaleDiff = newScale - currentScale;
            translateX -= (mouseX * scaleDiff) / currentScale;
            translateY -= (mouseY * scaleDiff) / currentScale;

            currentScale = newScale;
            updateTransform();
        });

        // ESC键退出缩放
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && isZoomed) {
                resetZoom();
            }
        });

        // 双击重置缩放
        imageContainer.addEventListener('dblclick', function(e) {
            e.preventDefault();
            resetZoom();
        });

        // 拖拽移动功能
        let isDragging = false;
        let lastMouseX = 0, lastMouseY = 0;

        imageContainer.addEventListener('mousedown', function(e) {
            if (isZoomed) {
                e.preventDefault();
                isDragging = true;
                lastMouseX = e.clientX;
                lastMouseY = e.clientY;
                imageContainer.style.cursor = 'grabbing';
            }
        });

        document.addEventListener('mousemove', function(e) {
            if (isDragging && isZoomed) {
                e.preventDefault();

                const deltaX = e.clientX - lastMouseX;
                const deltaY = e.clientY - lastMouseY;

                translateX += deltaX;
                translateY += deltaY;

                lastMouseX = e.clientX;
                lastMouseY = e.clientY;

                updateTransform();
            }
        });

        document.addEventListener('mouseup', function(e) {
            if (isDragging) {
                isDragging = false;
                imageContainer.style.cursor = 'zoom-out';
            }
        });

        function enterZoom(e) {
            console.log('进入缩放模式');
            isZoomed = true;
            currentScale = 2;
            imageContainer.style.cursor = 'zoom-out';

            // 隐藏缩放提示
            const zoomHint = imageContainer.querySelector('.zoom-hint');
            if (zoomHint) {
                zoomHint.style.opacity = '0';
            }

            // 计算鼠标位置作为缩放中心
            if (e) {
                const rect = img.getBoundingClientRect();
                const mouseX = e.clientX - rect.left;
                const mouseY = e.clientY - rect.top;

                translateX = -mouseX * (currentScale - 1);
                translateY = -mouseY * (currentScale - 1);
            }

            updateTransform();
        }

        function resetZoom() {
            console.log('重置缩放');
            isZoomed = false;
            currentScale = 1;
            translateX = 0;
            translateY = 0;
            imageContainer.style.cursor = 'zoom-in';

            // 显示缩放提示
            const zoomHint = imageContainer.querySelector('.zoom-hint');
            if (zoomHint) {
                zoomHint.style.opacity = '1';
            }

            updateTransform();
        }

        function updateTransform() {
            console.log('更新变换:', {
                scale: currentScale,
                translateX: translateX,
                translateY: translateY,
                isZoomed: isZoomed
            });

            if (isZoomed) {
                img.style.transform = `scale(${currentScale}) translate(${translateX}px, ${translateY}px)`;
                img.classList.add('zoomed');
            } else {
                img.style.transform = 'scale(1) translate(0px, 0px)';
                img.classList.remove('zoomed');
            }
        }
    } else {
        console.log('图片容器或图片元素未找到');
    }
}

// 添加键盘导航支持
function addKeyboardNavigation() {
    document.addEventListener('keydown', function(e) {
        const table = document.getElementById('locTable');
        if (table && table.style.display !== 'none') {
            const rows = table.querySelectorAll('tbody tr');
            const currentRow = table.querySelector('tbody tr.selected');

            if (e.key === 'ArrowDown') {
                e.preventDefault();
                if (currentRow) {
                    currentRow.classList.remove('selected');
                    const nextRow = currentRow.nextElementSibling;
                    if (nextRow) {
                        nextRow.classList.add('selected');
                    }
                } else if (rows.length > 0) {
                    rows[0].classList.add('selected');
                }
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                if (currentRow) {
                    currentRow.classList.remove('selected');
                    const prevRow = currentRow.previousElementSibling;
                    if (prevRow) {
                        prevRow.classList.add('selected');
                    }
                } else if (rows.length > 0) {
                    rows[rows.length - 1].classList.add('selected');
                }
            } else if (e.key === 'Enter' && currentRow) {
                const textCell = currentRow.querySelector('.recognition-result');
                if (textCell) {
                    const text = textCell.textContent.trim();
                    navigator.clipboard.writeText(text);
                    showEnhancedNotification('文本已复制到剪贴板', 'success', 2000);
                }
            }
        }
    });
}

// 初始化所有增强功能
function initEnhancedFeatures() {
    addTableCopyFeature();
    addImageZoom();
    addKeyboardNavigation();
}

// 页面加载完成后初始化增强功能
window.addEventListener('load', function() {
    initEnhancedFeatures();
});

// 窗口大小变化时重新调整图片尺寸
window.addEventListener('resize', function() {
    const img = document.getElementById('detect_img');
    if (img && img.src && img.complete) {
        adjustImageSizeAdaptive(img);
    }
});

// 自适应图片尺寸调整
function adjustImageSizeAdaptive(img) {
    console.log('adjustImageSizeAdaptive 被调用');

    const container = img.parentElement;
    if (!container) {
        console.log('容器未找到');
        return;
    }

    // 等待图片完全加载
    if (!img.complete || !img.naturalWidth) {
        console.log('图片未完全加载，等待...');
        setTimeout(() => adjustImageSizeAdaptive(img), 100);
        return;
    }

    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;
    const imgWidth = img.naturalWidth;
    const imgHeight = img.naturalHeight;

    console.log('容器尺寸:', containerWidth, 'x', containerHeight);
    console.log('图片原始尺寸:', imgWidth, 'x', imgHeight);

    // 计算最佳显示尺寸
    const containerRatio = containerWidth / containerHeight;
    const imgRatio = imgWidth / imgHeight;

    let newWidth, newHeight;

    if (imgRatio > containerRatio) {
        // 图片更宽，以宽度为准
        newWidth = Math.min(containerWidth * 0.9, imgWidth);
        newHeight = (newWidth / imgWidth) * imgHeight;
    } else {
        // 图片更高，以高度为准
        newHeight = Math.min(containerHeight * 0.9, imgHeight);
        newWidth = (newHeight / imgHeight) * imgWidth;
    }

    console.log('计算的新尺寸:', newWidth, 'x', newHeight);

    // 设置图片尺寸
    img.style.width = newWidth + 'px';
    img.style.height = newHeight + 'px';
    img.style.maxWidth = '100%';
    img.style.maxHeight = '100%';
    img.style.objectFit = 'contain';

    // 更新容器高度
    const minContainerHeight = Math.max(200, newHeight + 40);
    container.style.minHeight = minContainerHeight + 'px';

    console.log('图片自适应调整完成');
}

        // 确保函数在全局作用域中可用
    window.adjustImageSizeAdaptive = adjustImageSizeAdaptive;
    window.addImageZoom = addImageZoom;

    // 初始化图片缩放功能
    addImageZoom();