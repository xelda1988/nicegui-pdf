from typing import Callable, Optional

from nicegui.element import Element


class PdfViewer(Element, component="pdf_viewer.js"):

    def __init__(self, path: str, *, on_change: Optional[Callable] = None) -> None:
        super().__init__()
        self._props['path'] = path
        self.on('change', on_change)
        
    def show_page(self):
        self.run_method("show_page")

    def next_page(self) -> None:
        self.run_method("next_page")

    def test(self) -> None:
        # self.run_method("init")
        print(self.numPages)
        #self.run_method("reset")