from typing import Callable, Optional
import os

from nicegui import ui
from nicegui.element import Element


class PdfViewer(Element, component="pdf_viewer.js"):

    def __init__(self, path: str, *, on_change: Optional[Callable] = None) -> None:
        super().__init__()
        self._props['path'] = path
        self.on('change', on_change)

        # Load pdf_viewer.min.css from same path as this file
        self._load_css_file("pdf_viewer.min.css")
        self._load_js_file("pdf.min.js")
        self._load_js_file("jquery.min.js")
        self._load_worker("pdf.worker.min.js")


    #
    # Functions
    #
    def previous_page(self):
        self.run_method("previous_page")

    def next_page(self) -> None:
        self.run_method("next_page")

    def init(self) -> None:
        self.run_method("init")
    

    #
    # Helper for pdf.js library
    #
    def _load_worker(self, resource: str) -> None:
        # Load the worker from the same path as this file
        resource_path = os.path.join(os.path.dirname(__file__), "lib", resource)
        with open(resource_path, 'r') as f:
            workerjs = f.read()
        
        js_content = f"""
            var PDFJS = window['pdfjs-dist/build/pdf'];
            PDFJS.GlobalWorkerOptions.workerSrc = {workerjs};
        """
        ui.add_body_html(f"\n<script>\n{js_content}\n</script>\n")

    def _load_css_file(self, resource: str):
        css_content = self._load_lib_file(resource)
        ui.add_css(css_content)

    def _load_js_file(self, resource: str):
        js_content = self._load_lib_file(resource)
        ui.add_body_html(f"\n<script>\n{js_content}\n</script>\n")

    def _load_lib_file(self, resource: str) -> str:
        # Load the resource from the same path as this file
        resource_path = os.path.join(os.path.dirname(__file__), "lib", resource)
        with open(resource_path, 'r') as f:
            return f.read()