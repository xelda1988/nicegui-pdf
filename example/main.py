from nicegui import ui, app
from nicegui_pdf import PdfViewer


state = {
    "current_page": 1,
    "num_pages": 0,
    "is_rendering": False,
    "selected_text": "",
}


def next_page():
    state["current_page"] += 1

def previous_page():
    state["current_page"] -= 1


with ui.row().classes("w-4/6 no-wrap mx-auto"):
    with ui.column().classes("w-1/2 justify-center no-wrap"):
        # Header for the pdf component
        with ui.row().classes("w-full no-wrap items-center"):
            ui.button("Previous", on_click=previous_page).props("outline")
            ui.space()
            ui.label("Page ")
            ui.number().bind_value(state, "current_page").style("width: 50px;")
            ui.label(" of ")
            ui.label().bind_text_from(state, "num_pages")
            ui.space()
            ui.button("Next", on_click=next_page).props("outline")
        

        # Load the PDF component
        path = app.add_static_file(local_file="example/paper.pdf")
        PdfViewer(path).classes("w-full").style(
            "border: solid 1px gray;"
        ).bind_current_page(
            state
        ).bind_num_pages_to(
            state
        ).bind_is_rendering_to(
            state
        ).bind_selected_text_to(
            state
        )

    with ui.column().classes("w-1/2 justify-center mx-auto no-wrap"):
        ui.label("Selected text").style("font-weight: bold;").classes("mx-auto")
        ui.markdown().bind_content_from(state, "selected_text")


ui.run(uvicorn_reload_includes="*.py,*.js,*.vue,*.mjs")
