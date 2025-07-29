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
                if (typeof adjustImageSize === 'function') {
                    adjustImageSize(this);
                }
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
        imageContainer.style.cursor = 'zoom-in';

        imageContainer.addEventListener('click', function() {
            if (img.style.transform === 'scale(1.5)') {
                img.style.transform = 'scale(1)';
                imageContainer.style.cursor = 'zoom-in';
            } else {
                img.style.transform = 'scale(1.5)';
                imageContainer.style.cursor = 'zoom-out';
            }
        });

        // 添加鼠标滚轮缩放
        imageContainer.addEventListener('wheel', function(e) {
            e.preventDefault();
            const currentScale = parseFloat(img.style.transform.replace('scale(', '').replace(')', '')) || 1;
            const delta = e.deltaY > 0 ? 0.9 : 1.1;
            const newScale = Math.max(0.5, Math.min(3, currentScale * delta));
            img.style.transform = `scale(${newScale})`;
        });
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