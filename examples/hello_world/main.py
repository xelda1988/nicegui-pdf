from nicegui import ui, app
from nicegui_pdf.pdf_viewer import PdfViewer


path = app.add_static_file(local_file="examples/hello_world/paper.pdf")

with ui.row().classes("w-full justify-center no-wrap"):
    on_off = PdfViewer(path).classes("w-1/3").style("border: solid 1px gray;")

with ui.row().classes("w-full justify-center"):
    ui.button("Previous", on_click=on_off.previous_page).props("outline")
    ui.button("Next", on_click=on_off.next_page).props("outline")

ui.run(uvicorn_reload_includes="*.py,*.js,*.vue,*.mjs")
