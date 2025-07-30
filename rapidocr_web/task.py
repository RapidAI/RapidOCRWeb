# -*- encoding: utf-8 -*-
# @Author: SWHL
# @Contact: liekkaskono@163.com
import base64
import copy
import json
from dataclasses import asdict, dataclass
from typing import Optional

import cv2
import numpy as np
from rapidocr import RapidOCR


@dataclass
class OCRWebOutput:
    image: str
    total_elapse: str
    elapse_part: str
    rec_res: str


class OCRWebUtils:
    def __init__(self) -> None:
        self.ocr = RapidOCR()

    def __call__(self, img_content: Optional[str]) -> str:
        if img_content is None:
            raise ValueError("img is None")

        img = self.prepare_img(img_content)

        return self.get_ocr_res(img)

    def prepare_img(self, img_str: str) -> np.ndarray:
        img_str = img_str.split(",")[1]
        image = base64.b64decode(img_str + "=" * (-len(img_str) % 4))
        nparr = np.frombuffer(image, np.uint8)
        image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        if image.ndim == 2:
            image = cv2.cvtColor(image, cv2.COLOR_GRAY2BGR)
        return image

    def get_ocr_res(self, img: np.ndarray) -> str:
        ocr_res = self.ocr(img)
        if ocr_res.txts is None:
            result = OCRWebOutput(
                image="",
                total_elapse="0",
                elapse_part="",
                rec_res="",
            )
            return json.dumps(asdict(result))

        boxes, txts, scores = ocr_res.boxes, ocr_res.txts, ocr_res.scores
        scores = [f"{v:.4f}" for v in scores]
        rec_res = list(zip(range(len(txts)), txts, scores))
        rec_res = json.dumps(rec_res, indent=2, ensure_ascii=False)

        det_im = self.draw_text_det_res(np.array(boxes), img)
        img_str = self.img_to_base64(det_im)

        elapse_part = ",".join([f"{x:.4f}" for x in ocr_res.elapse_list])

        web_return = OCRWebOutput(
            image=img_str,
            total_elapse=f"{ocr_res.elapse:.4f}",
            elapse_part=elapse_part,
            rec_res=rec_res,
        )
        return json.dumps(asdict(web_return))

    @staticmethod
    def img_to_base64(img: np.ndarray) -> str:
        img = cv2.imencode(".png", img)[1]
        img_str = str(base64.b64encode(img))[2:-1]
        return img_str

    @staticmethod
    def draw_text_det_res(dt_boxes: np.ndarray, raw_im: np.ndarray) -> np.ndarray:
        src_im = copy.deepcopy(raw_im)
        for i, box in enumerate(dt_boxes):
            box = np.array(box).astype(np.int32).reshape(-1, 2)
            cv2.polylines(src_im, [box], True, color=(0, 0, 255), thickness=1)
            cv2.putText(
                src_im,
                str(i),
                (int(box[0][0]), int(box[0][1])),
                cv2.FONT_HERSHEY_SIMPLEX,
                0.5,
                (0, 0, 0),
                2,
            )
        return src_im
