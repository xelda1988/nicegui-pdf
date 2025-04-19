import "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.5.141/pdf.min.js"
import "https://ajax.googleapis.com/ajax/libs/jquery/2.2.4/jquery.min.js"


var __PDF_DOC,
    __CURRENT_PAGE,
    __TOTAL_PAGES,
    __PAGE_RENDERING_IN_PROGRESS = 0,
    PDFJS = window['pdfjs-dist/build/pdf'];

PDFJS.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.5.141/pdf.worker.min.js';

function showPDF(self, pdf_url, canvas, canvas_ctx) {

  PDFJS.getDocument({ url: pdf_url }).promise.then(function (pdf_doc) {
      self.pdf_doc = pdf_doc;
      self.num_pages = self.pdf_doc.numPages;

      // Hide the pdf loader and show pdf container in HTML
      $("#pdf-contents").show();
      $("#pdf-total-pages").text(self.num_pages);

      // Show the first page
      showPage(self, 1, canvas, canvas_ctx);
  }).catch(function (error) {
      alert(error.message);
  });
}


function showPage(self, page_no, canvas, canvas_ctx) {
  __PAGE_RENDERING_IN_PROGRESS = 1;

  // Disable Prev & Next buttons while page is being loaded
  $("#pdf-next, #pdf-prev").attr('disabled', 'disabled');

  // While page is being rendered hide the canvas and show a loading message
  $("#pdf-canvas").hide();

  // Update current page in HTML
  $("#pdf-current-page").text(page_no);

  // Fetch the page
  self.pdf_doc.getPage(page_no).then(function (page) {
      // Get viewport of the page at required scale
      let viewport = page.getViewport({
          scale: 1,
      });

      // As the canvas is of a fixed width we need to set the scale of the viewport accordingly
      let scale = canvas.width / viewport.width;
      viewport = page.getViewport({
          scale: scale
      });

      // Set canvas height
      canvas.height = viewport.height;
      console.log(canvas.height);

      var renderContext = {
          canvasContext: canvas_ctx,
          viewport: viewport
      };

      // Render the page contents in the canvas
      page.render(renderContext).promise.then(function () {
          __PAGE_RENDERING_IN_PROGRESS = 0;

          // Re-enable Prev & Next buttons
          $("#pdf-next, #pdf-prev").removeAttr('disabled');

          // Show the canvas and hide the page loader
          $("#pdf-canvas").show();

          // Return the text contents of the page after the pdf has been rendered in the canvas
          return page.getTextContent();
      }).then(function (textContent) {
          // Get canvas offset
          var canvas_offset = $("#pdf-canvas").offset();

          // Clear HTML for text layer
          $("#text-layer").html('');

          // Assign the CSS created to the text-layer element
          document.getElementById('text-layer').style.setProperty('--scale-factor', viewport.scale);
          $("#text-layer").css({ left: canvas_offset.left + 'px', top: canvas_offset.top + 'px'});

          // Pass the data to the method for rendering of text over the pdf canvas.
          PDFJS.renderTextLayer({
              textContentSource: textContent,
              container: $("#text-layer").get(0),
              viewport: viewport,
              textDivs: []
          });
      });
  });
}


export default {
    template: `
    <div id="pdf-main-container">
        <div id="pdf-contents">
            <div id="pdf-meta">
                <div id="page-count-container">Page <div id="pdf-current-page"></div> of <div id="pdf-total-pages">
                    </div>
                </div>
            </div>
            <canvas id="pdf-canvas" width="800"></canvas>
            <div id="text-layer" class="textLayer"></div>
         </div>
    </div>
    `,
    props: {
      path: String,
      pdf: Object,
    },
    data() {
      return {
        num_pages: 1,
        page_number: 1,
        pdf: null,
      };
    },
    methods: {
      init() {
        var self = this;
        var canvas = $('#pdf-canvas').get(0);
        var canvas_ctx = canvas.getContext('2d');
        
        this.page_number = 1;
        showPDF(self, this.path, canvas, canvas_ctx);
        console.log("INIT");
        console.log(this.num_pages);
      },

      previous_page() {
        var self = this;
        var canvas = $('#pdf-canvas').get(0);
        var canvas_ctx = canvas.getContext('2d');

        this.page_number -= 1;
        this.page_number = Math.max(this.page_number, 1);
        showPage(self, this.page_number, canvas, canvas_ctx);
      },

      next_page(){
        var self = this;
        var canvas = $('#pdf-canvas').get(0);
        var canvas_ctx = canvas.getContext('2d');
        
        this.page_number += 1;
        this.page_number = Math.min(this.page_number, this.num_pages);
        showPage(self, this.page_number, canvas, canvas_ctx);
      }
    },
  };