from nicegui import ui, app
from nicegui_pdf.pdf_viewer import PdfViewer


state = {
    "page_number": 1,
    "num_pages": 0,
    "is_rendering": False,
}

def next_page():
    state["page_number"] += 1
    on_off.page_number = state["page_number"]

def previous_page():
    state["page_number"] -= 1
    on_off.page_number = state["page_number"]

path = app.add_static_file(local_file="examples/hello_world/paper.pdf")
with ui.row().classes("w-1/3 justify-center mx-auto no-wrap"):
    ui.button("Previous", on_click=previous_page).props("outline")

    ui.space()
    ui.label("Page ")
    ui.label().bind_text_from(state, "page_number")
    ui.label(" of ")
    ui.label().bind_text_from(state, "num_pages")
    ui.space()

    ui.button("Next", on_click=next_page).props("outline")


with ui.row().classes("w-full justify-center no-wrap"):
    on_off = (
        PdfViewer(path)
        .classes("w-1/3")
        .style("border: solid 1px gray;")
        .bind_page_number_to(state)
        .bind_num_pages_to(state)
        .bind_is_rendering_to(state)
    )

ui.run(uvicorn_reload_includes="*.py,*.js,*.vue,*.mjs")
