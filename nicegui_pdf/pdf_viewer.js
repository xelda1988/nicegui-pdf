export default {
    template: `
    <div>
        <div :id="getPdfContentId()" style="display: none;">
            <canvas :id="getPdfCanvasId()" width="100%"></canvas>
            <div :id="getTextLayerId()" class="textLayer"></div>
        </div>
    </div>
    `,
    props: {
      path: String,
      pdf: Object,
    },
    data() {
      return {
        id: this.uuidv4(),
        num_pages: 1,
        page_number: 1,
        pdf: null,
      };
    },
    methods: {
      uuidv4() {
        return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, c =>
          (+c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> +c / 4).toString(16)
        );
      },      
      getPdfContentId(){
        return "pdf-contents-" + this.id;
      },
      getPdfCanvasId(){
        return "pdf-canvas-" + this.id;
      },
      getTextLayerId(){
        return "text-layer-" + this.id;
      },
      init() {
        var self = this;
        self.canvas = $("#" + self.getPdfCanvasId()).get(0);
        self.canvas_ctx = self.canvas.getContext('2d');
        
        this.page_number = 1;
        this.showPDF(this.path);
        console.log("INIT");
        console.log(this.num_pages);
      },

      previous_page(){
        var self = this;
        this.page_number -= 1;
        this.page_number = Math.max(this.page_number, 1);
        self.showPage(this.page_number);
      },

      next_page(){
        var self = this;
        this.page_number += 1;
        this.page_number = Math.min(this.page_number, this.num_pages);
        self.showPage(this.page_number);
      },

      load_worker(worker) {
        PDFJS.GlobalWorkerOptions.workerSrc = worker;
      },


      showPDF(pdf_url) {
        var self = this;
        PDFJS.getDocument({ url: pdf_url }).promise.then(function (pdf_doc) {
            self.pdf_doc = pdf_doc;
            self.num_pages = self.pdf_doc.numPages;
            $("#" + self.getPdfContentId()).show();
      
            // Show the first page
            self.showPage(1);
        }).catch(function (error) {
            alert(error.message);
        });
      },

      showPage(page_no) {
        var self = this;
      
        // Fetch the page
        self.pdf_doc.getPage(page_no).then(function (page) {
            // Make it slightly smaller than the parent container to ensure
            // the parent is always larger (e.g. a border is always shown)
            var width = $("#" + self.getPdfContentId()).width();
            width -= parseInt(width * 0.01);

            // set the canvas width to the width of the parent container
            self.canvas.width = width;

            // Get viewport of the page at required scale
            let viewport = page.getViewport({
                scale: 1,
            });
      
            // As the canvas is of a fixed width we need to set the scale of the viewport accordingly
            let scale = self.canvas.width / viewport.width;
            viewport = page.getViewport({
                scale: scale
            });
      
            // Set canvas height
            self.canvas.height = viewport.height;
            var renderContext = {
                canvasContext: self.canvas_ctx,
                viewport: viewport
            };
      
            // Render the page contents in the canvas
            page.render(renderContext).promise.then(function () {
                return page.getTextContent();
            }).then(function (textContent) {
                // Get canvas offset
                var canvas_offset = $("#" + self.getPdfCanvasId()).offset();
      
                // Clear HTML for text layer
                $("#" + self.getTextLayerId()).html('');
      
                // Assign the CSS created to the text-layer element
                document.getElementById(self.getTextLayerId()).style.setProperty('--scale-factor', viewport.scale);
                $("#" + self.getTextLayerId()).css({ left: canvas_offset.left + 'px', top: canvas_offset.top + 'px'});
      
                // Pass the data to the method for rendering of text over the pdf canvas.
                PDFJS.renderTextLayer({
                    textContentSource: textContent,
                    container: $("#" + self.getTextLayerId()).get(0),
                    viewport: viewport,
                    textDivs: []
                });
            });
        });
      }
    },
  };