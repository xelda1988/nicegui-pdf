from nicegui import ui, app
from nicegui_pdf.pdf_viewer import PdfViewer


path = app.add_static_file(local_file="examples/hello_world/paper.pdf")

with ui.row(align_items='center'):
    on_off = PdfViewer(path, on_change=lambda e: ui.notify(f'The value changed to {e.args}.'))
    ui.button('Show', on_click=on_off.show_page).props('outline')
    ui.button('Next', on_click=on_off.next_page).props('outline')

ui.run(uvicorn_reload_includes='*.py,*.js,*.vue,*.mjs')