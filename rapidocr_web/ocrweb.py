# -*- encoding: utf-8 -*-
# @Author: SWHL
# @Contact: liekkaskono@163.com
import argparse
from pathlib import Path
from wsgiref.simple_server import make_server

from flask import Flask, render_template, request

try:
    from rapidocr_web.task import OCRWebUtils
except:
    from task import OCRWebUtils

root_dir = Path(__file__).resolve().parent

app = Flask(__name__, template_folder="templates")
processor = OCRWebUtils()


@app.route("/")
def index():
    # Expose max upload size (in MB) to the frontend; 0 means unlimited
    mcl = app.config.get("MAX_CONTENT_LENGTH", None)
    if mcl is None:
        max_upload_mb = 0
    else:
        try:
            max_upload_mb = int(mcl // (1024 * 1024))
        except Exception:
            max_upload_mb = 0
    return render_template("index.html", max_upload_mb=max_upload_mb)


@app.route("/ocr", methods=["POST"])
def ocr():
    if request.method == "POST":
        img_str = request.get_json().get("file", None)
        ocr_res = processor(img_str)
        return ocr_res


def main():
    parser = argparse.ArgumentParser("rapidocr_web")
    parser.add_argument("-ip", "--ip", type=str, default="0.0.0.0", help="IP Address")
    parser.add_argument("-p", "--port", type=int, default=9003, help="IP port")
    parser.add_argument("-m", "--max-content-length", type=int, default=3,
                        help="Max upload size in MB. Set 0 for unlimited.")
    args = parser.parse_args()

    # Configure MAX_CONTENT_LENGTH based on CLI argument
    if args.max_content_length is None or args.max_content_length == 0:
        app.config["MAX_CONTENT_LENGTH"] = None  # Unlimited
    else:
        app.config["MAX_CONTENT_LENGTH"] = int(args.max_content_length) * 1024 * 1024

    print(f"Successfully launched and visit http://{args.ip}:{args.port} to view.")
    server = make_server(args.ip, args.port, app)
    server.serve_forever()


if __name__ == "__main__":
    main()
