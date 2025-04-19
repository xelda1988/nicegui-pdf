from typing import Callable, Optional

from nicegui import ui
from nicegui.element import Element


css = """
#upload-button {
    width: 150px;
    display: block;
    margin: 20px auto;
}

#file-to-upload {
    display: none;
}

#pdf-main-container {
    width: 400px;
    margin: 20px auto;
}

#pdf-loader {
    display: none;
    text-align: center;
    color: #999999;
    font-size: 13px;
    line-height: 100px;
    height: 100px;
}

#pdf-contents {
    display: none;
}

#pdf-meta {
    overflow: hidden;
    margin: 0 0 20px 0;
}

#pdf-buttons {
    float: left;
}

#page-count-container {
    float: right;
}

#pdf-current-page {
    display: inline;
}

#pdf-total-pages {
    display: inline;
}

#pdf-canvas {
    border: 1px solid rgba(0, 0, 0, 0.2);
    box-sizing: border-box;
}

"""

class PdfViewer(Element, component="pdf_viewer.js"):

    def __init__(self, path: str, *, on_change: Optional[Callable] = None) -> None:
        super().__init__()
        self._props['path'] = path
        self.on('change', on_change)

        ui.add_head_html('<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.5.141/pdf_viewer.min.css" />')
        ui.add_css(css)

    def previous_page(self):
        self.run_method("previous_page")

    def next_page(self) -> None:
        self.run_method("next_page")

    def init(self) -> None:
        self.run_method("init")